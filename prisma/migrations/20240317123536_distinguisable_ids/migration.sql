/*
  Warnings:

  - The primary key for the `Admin` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Admin` table. All the data in the column will be lost.
  - The primary key for the `CourierCompany` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `CourierCompany` table. All the data in the column will be lost.
  - The primary key for the `CourierService` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `CourierService` table. All the data in the column will be lost.
  - The primary key for the `DailyDiscount` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `DailyDiscount` table. All the data in the column will be lost.
  - The primary key for the `Discount` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Discount` table. All the data in the column will be lost.
  - The primary key for the `GuestOrder` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `GuestOrder` table. All the data in the column will be lost.
  - The primary key for the `Invoice` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Invoice` table. All the data in the column will be lost.
  - The primary key for the `InvoiceItem` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `InvoiceItem` table. All the data in the column will be lost.
  - The primary key for the `IterationImage` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `IterationImage` table. All the data in the column will be lost.
  - The primary key for the `LimitedTimeDiscount` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `LimitedTimeDiscount` table. All the data in the column will be lost.
  - The primary key for the `Order` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Order` table. All the data in the column will be lost.
  - The primary key for the `OrderItem` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `OrderItem` table. All the data in the column will be lost.
  - The primary key for the `Payment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Payment` table. All the data in the column will be lost.
  - The primary key for the `Product` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Product` table. All the data in the column will be lost.
  - The primary key for the `ProductCategory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `ProductCategory` table. All the data in the column will be lost.
  - The primary key for the `ProductDiscount` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `ProductDiscount` table. All the data in the column will be lost.
  - The primary key for the `ProductIteration` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `ProductIteration` table. All the data in the column will be lost.
  - The primary key for the `ProductVariantMapping` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `ProductVariantMapping` table. All the data in the column will be lost.
  - The primary key for the `Session` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Session` table. All the data in the column will be lost.
  - The primary key for the `Shipment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Shipment` table. All the data in the column will be lost.
  - The primary key for the `ThresholdDiscount` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `ThresholdDiscount` table. All the data in the column will be lost.
  - The primary key for the `Variant` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Variant` table. All the data in the column will be lost.
  - The primary key for the `VariantType` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `VariantType` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[admin_id]` on the table `Admin` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[courier_company_id]` on the table `CourierCompany` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[courier_service_id]` on the table `CourierService` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[daily_discount_id]` on the table `DailyDiscount` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[discount_id]` on the table `Discount` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[guest_order_id]` on the table `GuestOrder` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[invoice_id]` on the table `Invoice` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[invoice_item_id]` on the table `InvoiceItem` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[iteration_image_id]` on the table `IterationImage` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[limited_time_discount_id]` on the table `LimitedTimeDiscount` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[order_id]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[order_item_id]` on the table `OrderItem` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[payment_id]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[product_id]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[product_category_id]` on the table `ProductCategory` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[product_discount_id]` on the table `ProductDiscount` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[product_iteration_id]` on the table `ProductIteration` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[product_variant_mapping_id]` on the table `ProductVariantMapping` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[session_id]` on the table `Session` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[shipment_id]` on the table `Shipment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[threshold_discount_id]` on the table `ThresholdDiscount` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[variant_id]` on the table `Variant` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[varian_type_id]` on the table `VariantType` will be added. If there are existing duplicate values, this will fail.
  - The required column `admin_id` was added to the `Admin` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `courier_company_id` to the `CourierCompany` table without a default value. This is not possible if the table is not empty.
  - Added the required column `courier_service_id` to the `CourierService` table without a default value. This is not possible if the table is not empty.
  - Added the required column `daily_discount_id` to the `DailyDiscount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `discount_id` to the `Discount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `guest_order_id` to the `GuestOrder` table without a default value. This is not possible if the table is not empty.
  - The required column `invoice_id` was added to the `Invoice` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `invoice_item_id` to the `InvoiceItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `iteration_image_id` to the `IterationImage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `limited_time_discount_id` to the `LimitedTimeDiscount` table without a default value. This is not possible if the table is not empty.
  - The required column `order_id` was added to the `Order` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `order_item_id` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - The required column `payment_id` was added to the `Payment` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `product_id` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_category_id` to the `ProductCategory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_discount_id` to the `ProductDiscount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_iteration_id` to the `ProductIteration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_variant_mapping_id` to the `ProductVariantMapping` table without a default value. This is not possible if the table is not empty.
  - The required column `session_id` was added to the `Session` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `shipment_id` was added to the `Shipment` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `threshold_discount_id` to the `ThresholdDiscount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `variant_id` to the `Variant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `varian_type_id` to the `VariantType` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `CourierService` DROP FOREIGN KEY `CourierService_courier_company_id_fkey`;

-- DropForeignKey
ALTER TABLE `Discount` DROP FOREIGN KEY `Discount_daily_discount_id_fkey`;

-- DropForeignKey
ALTER TABLE `Discount` DROP FOREIGN KEY `Discount_limited_time_discount_id_fkey`;

-- DropForeignKey
ALTER TABLE `Discount` DROP FOREIGN KEY `Discount_product_discount_id_fkey`;

-- DropForeignKey
ALTER TABLE `Discount` DROP FOREIGN KEY `Discount_threshold_discount_id_fkey`;

-- DropForeignKey
ALTER TABLE `GuestOrder` DROP FOREIGN KEY `GuestOrder_order_id_fkey`;

-- DropForeignKey
ALTER TABLE `Invoice` DROP FOREIGN KEY `Invoice_order_id_fkey`;

-- DropForeignKey
ALTER TABLE `InvoiceItem` DROP FOREIGN KEY `InvoiceItem_invoice_id_fkey`;

-- DropForeignKey
ALTER TABLE `IterationImage` DROP FOREIGN KEY `IterationImage_product_variant_id_fkey`;

-- DropForeignKey
ALTER TABLE `OrderItem` DROP FOREIGN KEY `OrderItem_order_id_fkey`;

-- DropForeignKey
ALTER TABLE `OrderItem` DROP FOREIGN KEY `OrderItem_product_variant_id_fkey`;

-- DropForeignKey
ALTER TABLE `Payment` DROP FOREIGN KEY `Payment_order_id_fkey`;

-- DropForeignKey
ALTER TABLE `Product` DROP FOREIGN KEY `Product_product_category_id_fkey`;

-- DropForeignKey
ALTER TABLE `ProductDiscount` DROP FOREIGN KEY `ProductDiscount_product_id_fkey`;

-- DropForeignKey
ALTER TABLE `ProductIteration` DROP FOREIGN KEY `ProductIteration_product_id_fkey`;

-- DropForeignKey
ALTER TABLE `ProductVariantMapping` DROP FOREIGN KEY `ProductVariantMapping_product_iteration_id_fkey`;

-- DropForeignKey
ALTER TABLE `ProductVariantMapping` DROP FOREIGN KEY `ProductVariantMapping_variant_id_fkey`;

-- DropForeignKey
ALTER TABLE `Session` DROP FOREIGN KEY `Session_admin_id_fkey`;

-- DropForeignKey
ALTER TABLE `Shipment` DROP FOREIGN KEY `Shipment_courier_service_id_fkey`;

-- DropForeignKey
ALTER TABLE `Shipment` DROP FOREIGN KEY `Shipment_order_id_fkey`;

-- DropForeignKey
ALTER TABLE `Variant` DROP FOREIGN KEY `Variant_varian_type_id_fkey`;

-- DropIndex
DROP INDEX `Admin_id_key` ON `Admin`;

-- DropIndex
DROP INDEX `CourierCompany_id_key` ON `CourierCompany`;

-- DropIndex
DROP INDEX `CourierService_id_key` ON `CourierService`;

-- DropIndex
DROP INDEX `DailyDiscount_id_key` ON `DailyDiscount`;

-- DropIndex
DROP INDEX `Discount_id_key` ON `Discount`;

-- DropIndex
DROP INDEX `GuestOrder_id_key` ON `GuestOrder`;

-- DropIndex
DROP INDEX `Invoice_id_key` ON `Invoice`;

-- DropIndex
DROP INDEX `InvoiceItem_id_key` ON `InvoiceItem`;

-- DropIndex
DROP INDEX `IterationImage_id_key` ON `IterationImage`;

-- DropIndex
DROP INDEX `LimitedTimeDiscount_id_key` ON `LimitedTimeDiscount`;

-- DropIndex
DROP INDEX `Order_id_key` ON `Order`;

-- DropIndex
DROP INDEX `OrderItem_id_key` ON `OrderItem`;

-- DropIndex
DROP INDEX `Payment_id_key` ON `Payment`;

-- DropIndex
DROP INDEX `Product_id_key` ON `Product`;

-- DropIndex
DROP INDEX `ProductCategory_id_key` ON `ProductCategory`;

-- DropIndex
DROP INDEX `ProductDiscount_id_key` ON `ProductDiscount`;

-- DropIndex
DROP INDEX `ProductIteration_id_key` ON `ProductIteration`;

-- DropIndex
DROP INDEX `ProductVariantMapping_id_key` ON `ProductVariantMapping`;

-- DropIndex
DROP INDEX `Session_id_key` ON `Session`;

-- DropIndex
DROP INDEX `Shipment_id_key` ON `Shipment`;

-- DropIndex
DROP INDEX `ThresholdDiscount_id_key` ON `ThresholdDiscount`;

-- DropIndex
DROP INDEX `Variant_id_key` ON `Variant`;

-- DropIndex
DROP INDEX `VariantType_id_key` ON `VariantType`;

-- AlterTable
ALTER TABLE `Admin` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `admin_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`admin_id`);

-- AlterTable
ALTER TABLE `CourierCompany` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `courier_company_id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`courier_company_id`);

-- AlterTable
ALTER TABLE `CourierService` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `courier_service_id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`courier_service_id`);

-- AlterTable
ALTER TABLE `DailyDiscount` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `daily_discount_id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`daily_discount_id`);

-- AlterTable
ALTER TABLE `Discount` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `discount_id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`discount_id`);

-- AlterTable
ALTER TABLE `GuestOrder` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `guest_order_id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`guest_order_id`);

-- AlterTable
ALTER TABLE `Invoice` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `invoice_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`invoice_id`);

-- AlterTable
ALTER TABLE `InvoiceItem` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `invoice_item_id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`invoice_item_id`);

-- AlterTable
ALTER TABLE `IterationImage` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `iteration_image_id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`iteration_image_id`);

-- AlterTable
ALTER TABLE `LimitedTimeDiscount` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `limited_time_discount_id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`limited_time_discount_id`);

-- AlterTable
ALTER TABLE `Order` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `order_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`order_id`);

-- AlterTable
ALTER TABLE `OrderItem` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `order_item_id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`order_item_id`);

-- AlterTable
ALTER TABLE `Payment` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `payment_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`payment_id`);

-- AlterTable
ALTER TABLE `Product` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `product_id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`product_id`);

-- AlterTable
ALTER TABLE `ProductCategory` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `product_category_id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`product_category_id`);

-- AlterTable
ALTER TABLE `ProductDiscount` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `product_discount_id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`product_discount_id`);

-- AlterTable
ALTER TABLE `ProductIteration` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `product_iteration_id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`product_iteration_id`);

-- AlterTable
ALTER TABLE `ProductVariantMapping` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `product_variant_mapping_id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`product_variant_mapping_id`);

-- AlterTable
ALTER TABLE `Session` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `session_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`session_id`);

-- AlterTable
ALTER TABLE `Shipment` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `shipment_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`shipment_id`);

-- AlterTable
ALTER TABLE `ThresholdDiscount` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `threshold_discount_id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`threshold_discount_id`);

-- AlterTable
ALTER TABLE `Variant` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `variant_id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`variant_id`);

-- AlterTable
ALTER TABLE `VariantType` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `varian_type_id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`varian_type_id`);

-- CreateIndex
CREATE UNIQUE INDEX `Admin_admin_id_key` ON `Admin`(`admin_id`);

-- CreateIndex
CREATE UNIQUE INDEX `CourierCompany_courier_company_id_key` ON `CourierCompany`(`courier_company_id`);

-- CreateIndex
CREATE UNIQUE INDEX `CourierService_courier_service_id_key` ON `CourierService`(`courier_service_id`);

-- CreateIndex
CREATE UNIQUE INDEX `DailyDiscount_daily_discount_id_key` ON `DailyDiscount`(`daily_discount_id`);

-- CreateIndex
CREATE UNIQUE INDEX `Discount_discount_id_key` ON `Discount`(`discount_id`);

-- CreateIndex
CREATE UNIQUE INDEX `GuestOrder_guest_order_id_key` ON `GuestOrder`(`guest_order_id`);

-- CreateIndex
CREATE UNIQUE INDEX `Invoice_invoice_id_key` ON `Invoice`(`invoice_id`);

-- CreateIndex
CREATE UNIQUE INDEX `InvoiceItem_invoice_item_id_key` ON `InvoiceItem`(`invoice_item_id`);

-- CreateIndex
CREATE UNIQUE INDEX `IterationImage_iteration_image_id_key` ON `IterationImage`(`iteration_image_id`);

-- CreateIndex
CREATE UNIQUE INDEX `LimitedTimeDiscount_limited_time_discount_id_key` ON `LimitedTimeDiscount`(`limited_time_discount_id`);

-- CreateIndex
CREATE UNIQUE INDEX `Order_order_id_key` ON `Order`(`order_id`);

-- CreateIndex
CREATE UNIQUE INDEX `OrderItem_order_item_id_key` ON `OrderItem`(`order_item_id`);

-- CreateIndex
CREATE UNIQUE INDEX `Payment_payment_id_key` ON `Payment`(`payment_id`);

-- CreateIndex
CREATE UNIQUE INDEX `Product_product_id_key` ON `Product`(`product_id`);

-- CreateIndex
CREATE UNIQUE INDEX `ProductCategory_product_category_id_key` ON `ProductCategory`(`product_category_id`);

-- CreateIndex
CREATE UNIQUE INDEX `ProductDiscount_product_discount_id_key` ON `ProductDiscount`(`product_discount_id`);

-- CreateIndex
CREATE UNIQUE INDEX `ProductIteration_product_iteration_id_key` ON `ProductIteration`(`product_iteration_id`);

-- CreateIndex
CREATE UNIQUE INDEX `ProductVariantMapping_product_variant_mapping_id_key` ON `ProductVariantMapping`(`product_variant_mapping_id`);

-- CreateIndex
CREATE UNIQUE INDEX `Session_session_id_key` ON `Session`(`session_id`);

-- CreateIndex
CREATE UNIQUE INDEX `Shipment_shipment_id_key` ON `Shipment`(`shipment_id`);

-- CreateIndex
CREATE UNIQUE INDEX `ThresholdDiscount_threshold_discount_id_key` ON `ThresholdDiscount`(`threshold_discount_id`);

-- CreateIndex
CREATE UNIQUE INDEX `Variant_variant_id_key` ON `Variant`(`variant_id`);

-- CreateIndex
CREATE UNIQUE INDEX `VariantType_varian_type_id_key` ON `VariantType`(`varian_type_id`);

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_product_category_id_fkey` FOREIGN KEY (`product_category_id`) REFERENCES `ProductCategory`(`product_category_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductIteration` ADD CONSTRAINT `ProductIteration_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `Product`(`product_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductVariantMapping` ADD CONSTRAINT `ProductVariantMapping_product_iteration_id_fkey` FOREIGN KEY (`product_iteration_id`) REFERENCES `ProductIteration`(`product_iteration_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductVariantMapping` ADD CONSTRAINT `ProductVariantMapping_variant_id_fkey` FOREIGN KEY (`variant_id`) REFERENCES `Variant`(`variant_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Variant` ADD CONSTRAINT `Variant_varian_type_id_fkey` FOREIGN KEY (`varian_type_id`) REFERENCES `VariantType`(`varian_type_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `IterationImage` ADD CONSTRAINT `IterationImage_product_variant_id_fkey` FOREIGN KEY (`product_variant_id`) REFERENCES `ProductIteration`(`product_iteration_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `Order`(`order_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_product_variant_id_fkey` FOREIGN KEY (`product_variant_id`) REFERENCES `ProductIteration`(`product_iteration_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Invoice` ADD CONSTRAINT `Invoice_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `Order`(`order_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InvoiceItem` ADD CONSTRAINT `InvoiceItem_invoice_id_fkey` FOREIGN KEY (`invoice_id`) REFERENCES `Invoice`(`invoice_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `Order`(`order_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Shipment` ADD CONSTRAINT `Shipment_courier_service_id_fkey` FOREIGN KEY (`courier_service_id`) REFERENCES `CourierService`(`courier_service_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Shipment` ADD CONSTRAINT `Shipment_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `Order`(`order_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CourierService` ADD CONSTRAINT `CourierService_courier_company_id_fkey` FOREIGN KEY (`courier_company_id`) REFERENCES `CourierCompany`(`courier_company_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GuestOrder` ADD CONSTRAINT `GuestOrder_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `Order`(`order_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Discount` ADD CONSTRAINT `Discount_product_discount_id_fkey` FOREIGN KEY (`product_discount_id`) REFERENCES `ProductDiscount`(`product_discount_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Discount` ADD CONSTRAINT `Discount_threshold_discount_id_fkey` FOREIGN KEY (`threshold_discount_id`) REFERENCES `ThresholdDiscount`(`threshold_discount_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Discount` ADD CONSTRAINT `Discount_limited_time_discount_id_fkey` FOREIGN KEY (`limited_time_discount_id`) REFERENCES `LimitedTimeDiscount`(`limited_time_discount_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Discount` ADD CONSTRAINT `Discount_daily_discount_id_fkey` FOREIGN KEY (`daily_discount_id`) REFERENCES `DailyDiscount`(`daily_discount_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductDiscount` ADD CONSTRAINT `ProductDiscount_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `Product`(`product_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Session` ADD CONSTRAINT `Session_admin_id_fkey` FOREIGN KEY (`admin_id`) REFERENCES `Admin`(`admin_id`) ON DELETE SET NULL ON UPDATE CASCADE;
