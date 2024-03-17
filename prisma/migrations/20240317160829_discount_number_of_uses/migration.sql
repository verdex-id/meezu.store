/*
  Warnings:

  - Added the required column `number_of_uses` to the `Discount` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Discount` ADD COLUMN `number_of_uses` SMALLINT UNSIGNED NOT NULL;
