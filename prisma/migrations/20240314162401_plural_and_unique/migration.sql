/*
  Warnings:

  - A unique constraint covering the columns `[courier_company_name]` on the table `CourierCompany` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[product_slug]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[product_name]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[product_category_slug]` on the table `ProductCategory` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[product_category_name]` on the table `ProductCategory` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[variant_slug]` on the table `Variant` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[variant_name]` on the table `Variant` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `CourierCompany_courier_company_name_key` ON `CourierCompany`(`courier_company_name`);

-- CreateIndex
CREATE UNIQUE INDEX `Product_product_slug_key` ON `Product`(`product_slug`);

-- CreateIndex
CREATE UNIQUE INDEX `Product_product_name_key` ON `Product`(`product_name`);

-- CreateIndex
CREATE UNIQUE INDEX `ProductCategory_product_category_slug_key` ON `ProductCategory`(`product_category_slug`);

-- CreateIndex
CREATE UNIQUE INDEX `ProductCategory_product_category_name_key` ON `ProductCategory`(`product_category_name`);

-- CreateIndex
CREATE UNIQUE INDEX `Variant_variant_slug_key` ON `Variant`(`variant_slug`);

-- CreateIndex
CREATE UNIQUE INDEX `Variant_variant_name_key` ON `Variant`(`variant_name`);
