import { NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";
import { errorResponse, failResponse, successResponse } from "@/utils/response";
import { FailError } from "@/utils/custom-error";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import prisma, { prismaErrorCode } from "@/lib/prisma";
import { fetchAdminIfAuthorized } from "@/utils/check-admin";
import Joi from "joi";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { generateRandomString } from "@/utils/random";

export async function GET(request) {
  let iterationImages;
  try {
    const schema = Joi.object({
      product_iteration_id: Joi.number().integer().required(),
    });

    const { searchParams } = new URL(request.url);
    const productIterationId = searchParams.get("product_iteration_id");

    let req = schema.validate({ product_iteration_id: productIterationId });
    if (req.error) {
      throw new FailError("Invalid request format", 403, req.error.details);
    }
    req = req.value;

    iterationImages = await prisma.iterationImage.findMany({
      where: {
        product_iteration_id: req.product_iteration_id,
      },
    });
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        return NextResponse.json(
          ...failResponse(`${e.meta.modelName} not found`, 404)
        );
      }
      return NextResponse.json(
        ...failResponse(prismaErrorCode[e.code], 409, e.meta.modelName)
      );
    }
    if (e instanceof FailError) {
      return NextResponse.json(...failResponse(e.message, e.code, e.detail));
    }
    return NextResponse.json(...errorResponse());
  }

  return NextResponse.json(
    ...successResponse({ iteration_images: iterationImages })
  );
}

export async function POST(request) {
  const limit = 2;
  const sizeLimit = limit * 1024 * 1024;
  const imageType = "image";
  const saveLocation = "/iteration_images/";
  const imagePerIteration = 5;

  let iterationImage;
  try {
    const admin = await fetchAdminIfAuthorized();
    if (admin.error) {
      throw new FailError(admin.error, admin.errorCode);
    }

    const schema = Joi.object({
      product_iteration_id: Joi.number().integer().required(),
    });

    const { searchParams } = new URL(request.url);
    const productIterationId = searchParams.get("product_iteration_id");

    let req = schema.validate({ product_iteration_id: productIterationId });
    if (req.error) {
      throw new FailError("Invalid request format", 403, req.error.details);
    }
    req = req.value;

    const formData = await request.formData();
    const file = formData.get("image_file");

    if (!file) {
      throw new FailError("No image file received", 400);
    }

    if (!hasExactlyOneDot(file.name)) {
      throw new FailError(
        "Invalid file name",
        400,
        "Only one dot in file name is allowed"
      );
    }

    if (!isMatch(imageType, file.type)) {
      throw new FailError(
        "Invalid file type. Please upload an image file",
        415
      );
    }

    if (file.size > sizeLimit) {
      throw new FailError(
        `File size exceeds the maximum limit of ${limit}MB`,
        413
      );
    }

    const productIteration = await prisma.productIteration.findUnique({
      where: {
        product_iteration_id: req.product_iteration_id,
      },
      select: {
        _count: {
          select: { iteration_images: true },
        },
      },
    });

    if (productIteration._count.iteration_images >= imagePerIteration) {
      throw new FailError(
        `Image limit exceeded. You cannot upload more than ${imagePerIteration} images`,
        403
      );
    }

    const fileBuffer = await file.arrayBuffer();

    const mimeType = file.type;
    const encoding = "base64";
    const base64Data = Buffer.from(fileBuffer).toString("base64");
    const fileUri = "data:" + mimeType + ";" + encoding + "," + base64Data;

    // const newFileName =
    //   new Date().getTime() + "." + getFileExtension(file.name);
    // const buffer = Buffer.from(await file.arrayBuffer());
    // const savePath = path.join("public" + saveLocation + newFileName);
    // await writeFile(savePath, buffer);

    const public_id = generateRandomString(12);
    const folder = "iteration_images";

    const res = await uploadToCloudinary(fileUri, folder, file.name, public_id);

    if (res.success && res.result) {
      iterationImage = await prisma.iterationImage.create({
        data: {
          iteration_image_id: folder + "-" + public_id,
          iteration_image_path: res.result.secure_url,
          product_iteration_id: req.product_iteration_id,
        },
      });
    } else {
      throw new Error("failed upload image on cloudinary");
    }
  } catch (e) {
    if (
      e instanceof TypeError &&
      e.message.includes("Could not parse content as FormData")
    ) {
      return NextResponse.json(
        ...failResponse("Invalid image file", 400, e.message)
      );
    }
    if (e instanceof PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        return NextResponse.json(
          ...failResponse(`${e.meta.modelName} not found`, 404)
        );
      }
      return NextResponse.json(
        ...failResponse(prismaErrorCode[e.code], 409, e.meta.modelName)
      );
    }
    if (e instanceof FailError) {
      return NextResponse.json(...failResponse(e.message, e.code, e.detail));
    }
    return NextResponse.json(...errorResponse());
  }

  return NextResponse.json(
    ...successResponse({ iteration_image: iterationImage })
  );
}

function isMatch(pattern, str) {
  const regex = new RegExp(`^${pattern}`);
  return regex.test(str);
}

function hasExactlyOneDot(str) {
  const dotCount = (str.match(/\./g) || []).length;
  return dotCount === 1;
}

function getFileExtension(fileName) {
  const parts = fileName.split(".");
  return parts.length > 1 ? parts[parts.length - 1] : "";
}
