/*
  Warnings:

  - You are about to drop the column `ignored_email_list` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `sent_email_list` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "ignored_email_list";
ALTER TABLE "user" DROP COLUMN "sent_email_list";
ALTER TABLE "user" ADD COLUMN     "ignored_content_list" STRING[];
ALTER TABLE "user" ADD COLUMN     "sent_content_list" STRING[];
