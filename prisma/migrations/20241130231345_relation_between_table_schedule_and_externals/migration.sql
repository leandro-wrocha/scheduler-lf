/*
  Warnings:

  - Added the required column `external_id` to the `schedules` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `schedules` ADD COLUMN `external_id` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `schedules` ADD CONSTRAINT `schedules_external_id_fkey` FOREIGN KEY (`external_id`) REFERENCES `externals`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
