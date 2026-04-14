-- AlterTable
ALTER TABLE `JobSeekerProfile` ADD COLUMN `contactEmail` VARCHAR(191) NULL,
    ADD COLUMN `contactPhone` VARCHAR(191) NULL,
    ADD COLUMN `github` VARCHAR(191) NULL,
    ADD COLUMN `isProfilePublic` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `linkedin` VARCHAR(191) NULL,
    ADD COLUMN `location` VARCHAR(191) NULL,
    ADD COLUMN `twitter` VARCHAR(191) NULL,
    ADD COLUMN `website` VARCHAR(191) NULL;
