/*
  Warnings:

  - The primary key for the `IterationImage` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE `IterationImage` DROP PRIMARY KEY,
    MODIFY `iteration_image_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`iteration_image_id`);
