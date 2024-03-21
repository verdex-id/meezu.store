/*
  Warnings:

  - The primary key for the `Invoice` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Order` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Payment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Shipment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[id]` on the table `CourierCompany` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `CourierService` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `DailyDiscount` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `Discount` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `GuestOrder` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[order_code]` on the table `GuestOrder` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `Invoice` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `InvoiceItem` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `IterationImage` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `LimitedTimeDiscount` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `OrderItem` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `ProductCategory` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `ProductDiscount` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `ProductIteration` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `ProductVariantMapping` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `Shipment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `ThresholdDiscount` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `Variant` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `VariantType` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `GuestOrder` DROP FOREIGN KEY `GuestOrder_order_id_fkey`;

-- DropForeignKey
ALTER TABLE `Invoice` DROP FOREIGN KEY `Invoice_order_id_fkey`;

-- DropForeignKey
ALTER TABLE `InvoiceItem` DROP FOREIGN KEY `InvoiceItem_invoice_id_fkey`;

-- DropForeignKey
ALTER TABLE `OrderItem` DROP FOREIGN KEY `OrderItem_order_id_fkey`;

-- DropForeignKey
ALTER TABLE `Payment` DROP FOREIGN KEY `Payment_order_id_fkey`;

-- DropForeignKey
ALTER TABLE `Shipment` DROP FOREIGN KEY `Shipment_order_id_fkey`;

-- AlterTable
ALTER TABLE `GuestOrder` MODIFY `order_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Invoice` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `order_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `InvoiceItem` MODIFY `invoice_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Order` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `OrderItem` MODIFY `order_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Payment` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `order_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Shipment` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `order_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- CreateIndex
CREATE UNIQUE INDEX `CourierCompany_id_key` ON `CourierCompany`(`id`);

-- CreateIndex
CREATE UNIQUE INDEX `CourierService_id_key` ON `CourierService`(`id`);

-- CreateIndex
CREATE UNIQUE INDEX `DailyDiscount_id_key` ON `DailyDiscount`(`id`);

-- CreateIndex
CREATE UNIQUE INDEX `Discount_id_key` ON `Discount`(`id`);

-- CreateIndex
CREATE UNIQUE INDEX `GuestOrder_id_key` ON `GuestOrder`(`id`);

-- CreateIndex
CREATE UNIQUE INDEX `GuestOrder_order_code_key` ON `GuestOrder`(`order_code`);

-- CreateIndex
CREATE UNIQUE INDEX `Invoice_id_key` ON `Invoice`(`id`);

-- CreateIndex
CREATE UNIQUE INDEX `InvoiceItem_id_key` ON `InvoiceItem`(`id`);

-- CreateIndex
CREATE UNIQUE INDEX `IterationImage_id_key` ON `IterationImage`(`id`);

-- CreateIndex
CREATE UNIQUE INDEX `LimitedTimeDiscount_id_key` ON `LimitedTimeDiscount`(`id`);

-- CreateIndex
CREATE UNIQUE INDEX `Order_id_key` ON `Order`(`id`);

-- CreateIndex
CREATE UNIQUE INDEX `OrderItem_id_key` ON `OrderItem`(`id`);

-- CreateIndex
CREATE UNIQUE INDEX `Payment_id_key` ON `Payment`(`id`);

-- CreateIndex
CREATE UNIQUE INDEX `Product_id_key` ON `Product`(`id`);

-- CreateIndex
CREATE UNIQUE INDEX `ProductCategory_id_key` ON `ProductCategory`(`id`);

-- CreateIndex
CREATE UNIQUE INDEX `ProductDiscount_id_key` ON `ProductDiscount`(`id`);

-- CreateIndex
CREATE UNIQUE INDEX `ProductIteration_id_key` ON `ProductIteration`(`id`);

-- CreateIndex
CREATE UNIQUE INDEX `ProductVariantMapping_id_key` ON `ProductVariantMapping`(`id`);

-- CreateIndex
CREATE UNIQUE INDEX `Shipment_id_key` ON `Shipment`(`id`);

-- CreateIndex
CREATE UNIQUE INDEX `ThresholdDiscount_id_key` ON `ThresholdDiscount`(`id`);

-- CreateIndex
CREATE UNIQUE INDEX `Variant_id_key` ON `Variant`(`id`);

-- CreateIndex
CREATE UNIQUE INDEX `VariantType_id_key` ON `VariantType`(`id`);

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Invoice` ADD CONSTRAINT `Invoice_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InvoiceItem` ADD CONSTRAINT `InvoiceItem_invoice_id_fkey` FOREIGN KEY (`invoice_id`) REFERENCES `Invoice`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Shipment` ADD CONSTRAINT `Shipment_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GuestOrder` ADD CONSTRAINT `GuestOrder_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
