/*
  Warnings:

  - The primary key for the `Administrator` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `admin_id` on the `Administrator` table. All the data in the column will be lost.
  - The primary key for the `Category` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `category_id` on the `Category` table. All the data in the column will be lost.
  - The primary key for the `Customer` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `customer_id` on the `Customer` table. All the data in the column will be lost.
  - The primary key for the `Event` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `event_id` on the `Event` table. All the data in the column will be lost.
  - The primary key for the `EventOrganizer` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `organizer_id` on the `EventOrganizer` table. All the data in the column will be lost.
  - The primary key for the `Ticket` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `ticket_id` on the `Ticket` table. All the data in the column will be lost.
  - The primary key for the `TicketPurchase` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `purchase_id` on the `TicketPurchase` table. All the data in the column will be lost.
  - The primary key for the `Users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `user_id` on the `Users` table. All the data in the column will be lost.
  - You are about to alter the column `user_type` on the `Users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(48)` to `Enum(EnumId(0))`.
  - Added the required column `id` to the `Administrator` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `EventOrganizer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organization_name` to the `EventOrganizer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `Ticket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `TicketPurchase` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `Users` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE `Administrator` DROP FOREIGN KEY `Administrator_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `Customer` DROP FOREIGN KEY `Customer_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `Event` DROP FOREIGN KEY `Event_category_id_fkey`;

-- DropForeignKey
ALTER TABLE `Event` DROP FOREIGN KEY `Event_organizer_id_fkey`;

-- DropForeignKey
ALTER TABLE `EventOrganizer` DROP FOREIGN KEY `EventOrganizer_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `Ticket` DROP FOREIGN KEY `Ticket_event_id_fkey`;

-- DropForeignKey
ALTER TABLE `TicketPurchase` DROP FOREIGN KEY `TicketPurchase_customer_id_fkey`;

-- DropForeignKey
ALTER TABLE `TicketPurchase` DROP FOREIGN KEY `TicketPurchase_ticket_id_fkey`;

-- AlterTable
ALTER TABLE `Administrator` DROP PRIMARY KEY,
    DROP COLUMN `admin_id`,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `user_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Category` DROP PRIMARY KEY,
    DROP COLUMN `category_id`,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Customer` DROP PRIMARY KEY,
    DROP COLUMN `customer_id`,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `user_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Event` DROP PRIMARY KEY,
    DROP COLUMN `event_id`,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `EventOrganizer` DROP PRIMARY KEY,
    DROP COLUMN `organizer_id`,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `organization_name` VARCHAR(191) NOT NULL,
    MODIFY `user_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Ticket` DROP PRIMARY KEY,
    DROP COLUMN `ticket_id`,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `TicketPurchase` DROP PRIMARY KEY,
    DROP COLUMN `purchase_id`,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Users` DROP PRIMARY KEY,
    DROP COLUMN `user_id`,
    ADD COLUMN `id` VARCHAR(191) NOT NULL,
    MODIFY `user_type` ENUM('ADMIN', 'CUSTOMER', 'EVENTORGANIZER') NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `Administrator` ADD CONSTRAINT `Administrator_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Customer` ADD CONSTRAINT `Customer_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EventOrganizer` ADD CONSTRAINT `EventOrganizer_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Event` ADD CONSTRAINT `Event_organizer_id_fkey` FOREIGN KEY (`organizer_id`) REFERENCES `EventOrganizer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Event` ADD CONSTRAINT `Event_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TicketPurchase` ADD CONSTRAINT `TicketPurchase_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `Customer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TicketPurchase` ADD CONSTRAINT `TicketPurchase_ticket_id_fkey` FOREIGN KEY (`ticket_id`) REFERENCES `Ticket`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ticket` ADD CONSTRAINT `Ticket_event_id_fkey` FOREIGN KEY (`event_id`) REFERENCES `Event`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
