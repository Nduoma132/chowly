/*
  Warnings:

  - Added the required column `preparationTime` to the `MenuItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MenuItem" ADD COLUMN     "preparationTime" INTEGER NOT NULL DEFAULT 0;
