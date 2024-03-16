/*
  Warnings:

  - A unique constraint covering the columns `[product_iteration_id,variant_id]` on the table `ProductVariantMapping` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `ProductVariantMapping_product_iteration_id_variant_id_key` ON `ProductVariantMapping`(`product_iteration_id`, `variant_id`);
