/*
  Warnings:

  - A unique constraint covering the columns `[variant_type_name]` on the table `VariantType` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `VariantType_variant_type_name_key` ON `VariantType`(`variant_type_name`);
