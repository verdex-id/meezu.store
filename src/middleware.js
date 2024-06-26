import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { errorResponse, failResponse } from "./utils/response";
import { verifyToken } from "./lib/jwt";

export const authPayloadAccountId = "authorization_payload_account_id";

export async function middleware(request) {
  const jsonRoutes = [
    ["/api/areas", ["GET"]],
    ["/api/orders", ["GET"]],
    ["/api/orders/cancel", ["DELETE"]],
    ["/api/myshop_orders", ["GET"]],
    ["/api/addresses/origin", ["GET", "DELETE"]],
    ["/api/products", ["GET", "DELETE"]],
    ["/api/product_iterations", ["GET", "DELETE"]],
    ["/api/product_iterations_multiple", ["POST"]],
    ["/api/payment/channels", ["GET"]],
    ["/api/payment", ["GET"]],
    ["/api/variants", ["GET", "DELETE"]],
    ["/api/couriers", ["GET"]],
    ["/api/callbacks/biteship", ["GET", "POST"]],
    ["/api/discounts", ["GET", "DELETE"]],
    ["/api/vouchers", ["GET"]],
    ["/api/callbacks/biteship", ["GET"]],
    ["/api/banners", ["GET", "POST", "DELETE"]],
    ["/api/iteration_images", ["GET", "POST", "DELETE"]],
  ];

  if (!checkRoute(jsonRoutes, request)) {
    try {
      await request.json();
    } catch (e) {
      if (e instanceof SyntaxError) {
        return NextResponse.json(
          ...failResponse("Request/JSON syntax error", 400, {
            name: e.name,
            message: e.message,
          })
        );
      }
    }
  }

  const authRoutes = [
    ["/api/addresses/origin"],
    ["/api/products", ["POST", "PATCH", "DELETE"]],
    ["/api/product_iterations", ["POST", "PATCH", "DELETE"]],
    ["/api/variants", ["POST", "DELETE"]],
    ["/api/admins/settings"],
    ["/api/couriers/create"],
    ["/api/couriers", ["DELETE"]],
    ["/api/discounts/product", ["GET", "POST", "DELETE"]],
    ["/api/discounts", ["POST", "DELETE"]],
    ["/api/shipments/guest", ["POST"]],
    ["/api/myshop_orders", ["GET", "PATCH"]],
    ["/api/banners", ["POST", "DELETE", "PATCH"]],
    ["/api/iteration_images", ["POST", "DELETE"]],
  ];

  if (checkRoute(authRoutes, request)) {
    let authorization = headers().get("authorization");
    if (authorization === null) {
      return Response.json(
        ...failResponse("Authorization header is not provided.", 401)
      );
    }

    authorization = authorization.split(" ");

    if (authorization.length === 0) {
      return Response.json(
        ...failResponse("Authorization header is not provided.", 401)
      );
    }

    if (authorization.length < 2) {
      return Response.json(
        ...failResponse("Authorization header is not valid.", 401)
      );
    }

    if (authorization[0].toLowerCase() !== "bearer") {
      return Response.json(
        ...failResponse("Unsupported authentication type.", 401)
      );
    }

    const verificationResult = await verifyToken(authorization[1]);
    if (!verificationResult.isValid) {
      return Response.json(
        ...failResponse("token has expired or is invalid.", 401)
      );
    }

    if (!verificationResult.payload.accountId) {
      return NextResponse.json(...errorResponse());
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set(
      authPayloadAccountId,
      verificationResult.payload.accountId
    );

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }
}

export const config = {
  matcher: ["/api/:path*"],
};

function checkRoute(routes, request) {
  return routes.some((route) => {
    if (request.nextUrl.pathname.startsWith(route[0])) {
      if (route[1]) {
        return route[1].some((method) => method === request.method);
      }
      return true;
    }
    return false;
  });
}
