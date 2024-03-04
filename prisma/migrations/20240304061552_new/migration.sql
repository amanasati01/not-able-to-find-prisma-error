/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Blog_userId_key";

-- AlterTable
ALTER TABLE "Blog" ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Blog_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
