/*
  Warnings:

  - You are about to drop the column `endTime` on the `schedule_availabilities` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `schedule_availabilities` table. All the data in the column will be lost.
  - You are about to drop the column `endTime` on the `schedules` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `schedules` table. All the data in the column will be lost.
  - Added the required column `end_time` to the `schedule_availabilities` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_time` to the `schedule_availabilities` table without a default value. This is not possible if the table is not empty.
  - Added the required column `end_time` to the `schedules` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_time` to the `schedules` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `schedule_availabilities` DROP COLUMN `endTime`,
    DROP COLUMN `startTime`,
    ADD COLUMN `end_time` VARCHAR(191) NOT NULL,
    ADD COLUMN `start_time` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `schedules` DROP COLUMN `endTime`,
    DROP COLUMN `startTime`,
    ADD COLUMN `end_time` DATETIME(3) NOT NULL,
    ADD COLUMN `start_time` DATETIME(3) NOT NULL;
