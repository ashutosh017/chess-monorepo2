/*
  Warnings:

  - You are about to drop the column `endFen` on the `Move` table. All the data in the column will be lost.
  - You are about to drop the column `notation` on the `Move` table. All the data in the column will be lost.
  - You are about to drop the column `startFen` on the `Move` table. All the data in the column will be lost.
  - Added the required column `after` to the `Move` table without a default value. This is not possible if the table is not empty.
  - Added the required column `before` to the `Move` table without a default value. This is not possible if the table is not empty.
  - Added the required column `from` to the `Move` table without a default value. This is not possible if the table is not empty.
  - Added the required column `to` to the `Move` table without a default value. This is not possible if the table is not empty.
  - Added the required column `provider` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AuthProvider" AS ENUM ('EMAIL', 'GOOGLE', 'GITHUB', 'GUEST');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "GameStatus" ADD VALUE 'TIME_UP';
ALTER TYPE "GameStatus" ADD VALUE 'PLAYER_EXIT';

-- AlterTable
ALTER TABLE "Move" DROP COLUMN "endFen",
DROP COLUMN "notation",
DROP COLUMN "startFen",
ADD COLUMN     "after" TEXT NOT NULL,
ADD COLUMN     "before" TEXT NOT NULL,
ADD COLUMN     "from" TEXT NOT NULL,
ADD COLUMN     "san" TEXT,
ADD COLUMN     "to" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "provider" "AuthProvider" NOT NULL,
ALTER COLUMN "username" DROP NOT NULL,
ALTER COLUMN "password" DROP NOT NULL,
ALTER COLUMN "name" DROP NOT NULL;
