-- CreateTable
CREATE TABLE `ProductCategory` (
    `product_category_id` INTEGER NOT NULL AUTO_INCREMENT,
    `product_category_slug` VARCHAR(50) NOT NULL,
    `product_category_name` VARCHAR(50) NOT NULL,

    UNIQUE INDEX `ProductCategory_product_category_id_key`(`product_category_id`),
    UNIQUE INDEX `ProductCategory_product_category_slug_key`(`product_category_slug`),
    UNIQUE INDEX `ProductCategory_product_category_name_key`(`product_category_name`),
    PRIMARY KEY (`product_category_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Product` (
    `product_id` INTEGER NOT NULL AUTO_INCREMENT,
    `product_slug` VARCHAR(70) NOT NULL,
    `product_name` VARCHAR(70) NOT NULL,
    `product_description` VARCHAR(2000) NOT NULL,
    `product_category_id` INTEGER NOT NULL,

    UNIQUE INDEX `Product_product_id_key`(`product_id`),
    UNIQUE INDEX `Product_product_slug_key`(`product_slug`),
    UNIQUE INDEX `Product_product_name_key`(`product_name`),
    PRIMARY KEY (`product_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProductIteration` (
    `product_iteration_id` INTEGER NOT NULL AUTO_INCREMENT,
    `product_variant_weight` INTEGER NOT NULL,
    `product_variant_price` MEDIUMINT UNSIGNED NOT NULL,
    `product_variant_stock` SMALLINT UNSIGNED NOT NULL,
    `product_id` INTEGER NOT NULL,

    UNIQUE INDEX `ProductIteration_product_iteration_id_key`(`product_iteration_id`),
    PRIMARY KEY (`product_iteration_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProductVariantMapping` (
    `product_variant_mapping_id` INTEGER NOT NULL AUTO_INCREMENT,
    `product_iteration_id` INTEGER NOT NULL,
    `variant_id` INTEGER NOT NULL,

    UNIQUE INDEX `ProductVariantMapping_product_variant_mapping_id_key`(`product_variant_mapping_id`),
    UNIQUE INDEX `ProductVariantMapping_product_iteration_id_variant_id_key`(`product_iteration_id`, `variant_id`),
    PRIMARY KEY (`product_variant_mapping_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VariantType` (
    `varian_type_id` INTEGER NOT NULL AUTO_INCREMENT,
    `variant_type_name` VARCHAR(30) NOT NULL,

    UNIQUE INDEX `VariantType_varian_type_id_key`(`varian_type_id`),
    UNIQUE INDEX `VariantType_variant_type_name_key`(`variant_type_name`),
    PRIMARY KEY (`varian_type_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Variant` (
    `variant_id` INTEGER NOT NULL AUTO_INCREMENT,
    `variant_slug` VARCHAR(15) NOT NULL,
    `variant_name` VARCHAR(15) NOT NULL,
    `varian_type_id` INTEGER NOT NULL,

    UNIQUE INDEX `Variant_variant_id_key`(`variant_id`),
    UNIQUE INDEX `Variant_variant_slug_key`(`variant_slug`),
    UNIQUE INDEX `Variant_variant_name_key`(`variant_name`),
    PRIMARY KEY (`variant_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `IterationImage` (
    `iteration_image_id` INTEGER NOT NULL AUTO_INCREMENT,
    `product_variant_image` VARCHAR(191) NOT NULL,
    `product_variant_id` INTEGER NOT NULL,

    UNIQUE INDEX `IterationImage_iteration_image_id_key`(`iteration_image_id`),
    PRIMARY KEY (`iteration_image_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrderItem` (
    `order_item_id` INTEGER NOT NULL AUTO_INCREMENT,
    `order_item_name` VARCHAR(191) NOT NULL,
    `order_item_perunit_price` INTEGER NOT NULL,
    `order_item_quantity` SMALLINT UNSIGNED NOT NULL,
    `order_id` VARCHAR(191) NOT NULL,
    `product_variant_id` INTEGER NOT NULL,

    UNIQUE INDEX `OrderItem_order_item_id_key`(`order_item_id`),
    UNIQUE INDEX `OrderItem_order_id_key`(`order_id`),
    UNIQUE INDEX `OrderItem_product_variant_id_key`(`product_variant_id`),
    PRIMARY KEY (`order_item_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Invoice` (
    `invoice_id` VARCHAR(191) NOT NULL,
    `invoice_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `transaction_date` DATETIME(3) NOT NULL,
    `payment_date` DATETIME(3) NOT NULL,
    `customer_name` VARCHAR(35) NOT NULL,
    `customer_address` VARCHAR(200) NOT NULL,
    `discount_amount` MEDIUMINT UNSIGNED NOT NULL,
    `total_price` MEDIUMINT UNSIGNED NOT NULL,
    `bill` MEDIUMINT UNSIGNED NOT NULL,
    `order_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Invoice_invoice_id_key`(`invoice_id`),
    UNIQUE INDEX `Invoice_order_id_key`(`order_id`),
    PRIMARY KEY (`invoice_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InvoiceItem` (
    `invoice_item_id` INTEGER NOT NULL AUTO_INCREMENT,
    `invoice_item_quantity` SMALLINT UNSIGNED NOT NULL,
    `invoice_item_name` VARCHAR(191) NOT NULL,
    `invoice_item_weight` INTEGER NOT NULL,
    `invoice_perunit_price` MEDIUMINT UNSIGNED NOT NULL,
    `invoice_item_total_price` MEDIUMINT UNSIGNED NOT NULL,
    `invoice_item_description` VARCHAR(191) NOT NULL,
    `invoice_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `InvoiceItem_invoice_item_id_key`(`invoice_item_id`),
    PRIMARY KEY (`invoice_item_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Order` (
    `order_id` VARCHAR(191) NOT NULL,
    `order_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `order_status` VARCHAR(50) NOT NULL,
    `discount_amount` MEDIUMINT UNSIGNED NOT NULL,

    UNIQUE INDEX `Order_order_id_key`(`order_id`),
    PRIMARY KEY (`order_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Payment` (
    `payment_id` VARCHAR(191) NOT NULL,
    `paygate_transaction_id` VARCHAR(191) NOT NULL,
    `payment_date` DATETIME(3) NOT NULL,
    `payment_method` VARCHAR(191) NOT NULL,
    `total_payment` MEDIUMINT UNSIGNED NOT NULL,
    `order_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Payment_payment_id_key`(`payment_id`),
    UNIQUE INDEX `Payment_order_id_key`(`order_id`),
    PRIMARY KEY (`payment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Shipment` (
    `shipment_id` VARCHAR(191) NOT NULL,
    `expedition_order_id` VARCHAR(191) NOT NULL,
    `shipment_date` DATETIME(3) NOT NULL,
    `courier_id` INTEGER NOT NULL,
    `order_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Shipment_shipment_id_key`(`shipment_id`),
    UNIQUE INDEX `Shipment_order_id_key`(`order_id`),
    PRIMARY KEY (`shipment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Courier` (
    `courier_id` INTEGER NOT NULL AUTO_INCREMENT,
    `courier_name` VARCHAR(191) NOT NULL,
    `courier_code` VARCHAR(191) NOT NULL,
    `courier_service_name` VARCHAR(191) NOT NULL,
    `courier_service_code` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Courier_courier_id_key`(`courier_id`),
    UNIQUE INDEX `Courier_courier_code_courier_service_code_key`(`courier_code`, `courier_service_code`),
    PRIMARY KEY (`courier_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GuestOrder` (
    `guest_order_id` INTEGER NOT NULL AUTO_INCREMENT,
    `order_code` VARCHAR(191) NOT NULL,
    `guest_full_name` VARCHAR(35) NOT NULL,
    `guest_phone_number` TINYTEXT NOT NULL,
    `guest_email` VARCHAR(75) NOT NULL,
    `guest_address` VARCHAR(200) NOT NULL,
    `order_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `GuestOrder_guest_order_id_key`(`guest_order_id`),
    UNIQUE INDEX `GuestOrder_order_code_key`(`order_code`),
    UNIQUE INDEX `GuestOrder_order_id_key`(`order_id`),
    PRIMARY KEY (`guest_order_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Discount` (
    `discount_id` INTEGER NOT NULL AUTO_INCREMENT,
    `discount_code` VARCHAR(191) NOT NULL,
    `discount_value` MEDIUMINT UNSIGNED NOT NULL,
    `is_percent_discount` BOOLEAN NOT NULL,
    `maximum_discount_amount` MEDIUMINT UNSIGNED NOT NULL,
    `is_limited` BOOLEAN NOT NULL,
    `usage_limits` SMALLINT UNSIGNED NOT NULL,
    `number_of_uses` SMALLINT UNSIGNED NOT NULL,
    `product_discount_id` INTEGER NOT NULL,
    `threshold_discount_id` INTEGER NOT NULL,
    `limited_time_discount_id` INTEGER NOT NULL,
    `daily_discount_id` INTEGER NOT NULL,

    UNIQUE INDEX `Discount_discount_id_key`(`discount_id`),
    UNIQUE INDEX `Discount_product_discount_id_key`(`product_discount_id`),
    UNIQUE INDEX `Discount_threshold_discount_id_key`(`threshold_discount_id`),
    UNIQUE INDEX `Discount_limited_time_discount_id_key`(`limited_time_discount_id`),
    UNIQUE INDEX `Discount_daily_discount_id_key`(`daily_discount_id`),
    PRIMARY KEY (`discount_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ThresholdDiscount` (
    `threshold_discount_id` INTEGER NOT NULL AUTO_INCREMENT,
    `minimum_amount` MEDIUMINT UNSIGNED NOT NULL,

    UNIQUE INDEX `ThresholdDiscount_threshold_discount_id_key`(`threshold_discount_id`),
    PRIMARY KEY (`threshold_discount_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LimitedTimeDiscount` (
    `limited_time_discount_id` INTEGER NOT NULL AUTO_INCREMENT,
    `from_date` DATETIME(3) NOT NULL,
    `to_date` DATETIME(3) NOT NULL,

    UNIQUE INDEX `LimitedTimeDiscount_limited_time_discount_id_key`(`limited_time_discount_id`),
    PRIMARY KEY (`limited_time_discount_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DailyDiscount` (
    `daily_discount_id` INTEGER NOT NULL AUTO_INCREMENT,
    `from_hour` TIME NOT NULL,
    `to_hour` TIME NOT NULL,

    UNIQUE INDEX `DailyDiscount_daily_discount_id_key`(`daily_discount_id`),
    PRIMARY KEY (`daily_discount_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProductDiscount` (
    `product_discount_id` INTEGER NOT NULL AUTO_INCREMENT,
    `product_id` INTEGER NOT NULL,

    UNIQUE INDEX `ProductDiscount_product_discount_id_key`(`product_discount_id`),
    UNIQUE INDEX `ProductDiscount_product_id_key`(`product_id`),
    PRIMARY KEY (`product_discount_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Admin` (
    `admin_id` VARCHAR(191) NOT NULL,
    `admin_full_name` VARCHAR(35) NOT NULL,
    `admin_hashedPassword` VARCHAR(191) NOT NULL,
    `admin_email` VARCHAR(75) NOT NULL,
    `admin_created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Admin_admin_id_key`(`admin_id`),
    UNIQUE INDEX `Admin_admin_email_key`(`admin_email`),
    PRIMARY KEY (`admin_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Session` (
    `session_id` VARCHAR(191) NOT NULL,
    `refresh_token` VARCHAR(191) NOT NULL,
    `is_blocked` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `expired_at` DATETIME(3) NOT NULL,
    `admin_id` VARCHAR(191) NULL,

    UNIQUE INDEX `Session_session_id_key`(`session_id`),
    UNIQUE INDEX `Session_refresh_token_key`(`refresh_token`),
    PRIMARY KEY (`session_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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
ALTER TABLE `Shipment` ADD CONSTRAINT `Shipment_courier_id_fkey` FOREIGN KEY (`courier_id`) REFERENCES `Courier`(`courier_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Shipment` ADD CONSTRAINT `Shipment_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `Order`(`order_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

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
