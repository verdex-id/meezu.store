/*
  Warnings:

  - The primary key for the `Banner` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE `Banner` DROP PRIMARY KEY,
    MODIFY `banner_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`banner_id`);
