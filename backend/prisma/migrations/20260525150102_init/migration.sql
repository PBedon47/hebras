/*
  Warnings:

  - You are about to drop the column `text` on the `comment` table. All the data in the column will be lost.
  - You are about to drop the column `followerId` on the `follow` table. All the data in the column will be lost.
  - You are about to drop the column `followingId` on the `follow` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `post` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,ongId]` on the table `Follow` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,postId]` on the table `Like` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `texto` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ongId` to the `Follow` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Follow` table without a default value. This is not possible if the table is not empty.
  - Added the required column `texto` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ciudad` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nombre` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `follow` DROP FOREIGN KEY `Follow_followerId_fkey`;

-- DropForeignKey
ALTER TABLE `follow` DROP FOREIGN KEY `Follow_followingId_fkey`;

-- AlterTable
ALTER TABLE `comment` DROP COLUMN `text`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `texto` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `follow` DROP COLUMN `followerId`,
    DROP COLUMN `followingId`,
    ADD COLUMN `ongId` INTEGER NOT NULL,
    ADD COLUMN `userId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `post` DROP COLUMN `content`,
    ADD COLUMN `imagen` VARCHAR(191) NULL,
    ADD COLUMN `texto` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `name`,
    ADD COLUMN `ciudad` VARCHAR(191) NOT NULL,
    ADD COLUMN `nivel` VARCHAR(191) NOT NULL DEFAULT 'BROTE',
    ADD COLUMN `nombre` VARCHAR(191) NOT NULL,
    ADD COLUMN `password` VARCHAR(191) NOT NULL,
    ADD COLUMN `puntos` INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE `Ong` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `tipo` VARCHAR(191) NOT NULL,
    `loc` VARCHAR(191) NOT NULL,
    `distrito` VARCHAR(191) NOT NULL,
    `rating` DOUBLE NOT NULL,
    `emoji` VARCHAR(191) NOT NULL,
    `imgKey` VARCHAR(191) NOT NULL,
    `mision` VARCHAR(191) NOT NULL,
    `webUrl` VARCHAR(191) NOT NULL,
    `whatsapp` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Campana` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ongId` INTEGER NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `desc` VARCHAR(191) NOT NULL,
    `fecha` VARCHAR(191) NOT NULL,
    `fechaISO` DATETIME(3) NOT NULL,
    `fechaISOFin` DATETIME(3) NULL,
    `vacantes` INTEGER NOT NULL,
    `tipo` VARCHAR(191) NOT NULL,
    `imgKey` VARCHAR(191) NOT NULL,
    `tasks` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CampanaRealizada` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `campanaId` INTEGER NOT NULL,
    `horas` INTEGER NOT NULL,
    `pts` INTEGER NOT NULL,
    `rating` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Follow_userId_ongId_key` ON `Follow`(`userId`, `ongId`);

-- CreateIndex
CREATE UNIQUE INDEX `Like_userId_postId_key` ON `Like`(`userId`, `postId`);

-- AddForeignKey
ALTER TABLE `Follow` ADD CONSTRAINT `Follow_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Follow` ADD CONSTRAINT `Follow_ongId_fkey` FOREIGN KEY (`ongId`) REFERENCES `Ong`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Campana` ADD CONSTRAINT `Campana_ongId_fkey` FOREIGN KEY (`ongId`) REFERENCES `Ong`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CampanaRealizada` ADD CONSTRAINT `CampanaRealizada_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CampanaRealizada` ADD CONSTRAINT `CampanaRealizada_campanaId_fkey` FOREIGN KEY (`campanaId`) REFERENCES `Campana`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
