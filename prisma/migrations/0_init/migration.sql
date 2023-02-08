-- CreateTable
CREATE TABLE "author" (
    "profile" JSONB NOT NULL,
    "read_email_count" BIGINT NOT NULL,
    "sent_email_count" BIGINT NOT NULL,
    "open_email_count" BIGINT NOT NULL,
    "is_registered" BOOLEAN NOT NULL,
    "rowid" TEXT NOT NULL,

    CONSTRAINT "author___pkey" PRIMARY KEY ("rowid")
);

-- CreateTable
CREATE TABLE "email" (
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "topic_list" TEXT[],
    "open_count" BIGINT NOT NULL,
    "clipboard_count" BIGINT NOT NULL,
    "send_count" BIGINT NOT NULL,
    "read_count" BIGINT NOT NULL,
    "recipient_list" TEXT[],
    "rowid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "added_by" TEXT NOT NULL,
    "shortid" TEXT NOT NULL,

    CONSTRAINT "email___pkey" PRIMARY KEY ("rowid")
);

-- CreateTable
CREATE TABLE "issue" (
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "rowid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email_id" UUID NOT NULL,
    "added_by" TEXT NOT NULL,

    CONSTRAINT "issue___pkey" PRIMARY KEY ("rowid")
);

-- CreateTable
CREATE TABLE "recipient" (
    "address" TEXT NOT NULL,
    "email_open_count" BIGINT NOT NULL,
    "email_read_count" BIGINT NOT NULL,
    "email_sent_count" BIGINT NOT NULL,
    "added_by" TEXT NOT NULL,
    "email_count" BIGINT NOT NULL,
    "last_updated" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "recipient___pkey" PRIMARY KEY ("address")
);

-- CreateTable
CREATE TABLE "topic" (
    "name" TEXT NOT NULL,
    "email_count" BIGINT NOT NULL,
    "last_updated" TIMESTAMP(6) NOT NULL,
    "email_open_count" BIGINT NOT NULL,
    "email_read_count" BIGINT NOT NULL,
    "email_sent_count" BIGINT NOT NULL,
    "added_by" TEXT NOT NULL,

    CONSTRAINT "topic___pkey" PRIMARY KEY ("name")
);

-- CreateIndex
CREATE UNIQUE INDEX "shortid__key" ON "email"("shortid");

-- AddForeignKey
ALTER TABLE "email" ADD CONSTRAINT "added_by___fkey" FOREIGN KEY ("added_by") REFERENCES "author"("rowid") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "issue" ADD CONSTRAINT "added_by___fkey" FOREIGN KEY ("added_by") REFERENCES "author"("rowid") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "issue" ADD CONSTRAINT "email_id___fkey" FOREIGN KEY ("email_id") REFERENCES "email"("rowid") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipient" ADD CONSTRAINT "added_by___fkey" FOREIGN KEY ("added_by") REFERENCES "author"("rowid") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "topic" ADD CONSTRAINT "added_by___fkey" FOREIGN KEY ("added_by") REFERENCES "author"("rowid") ON DELETE NO ACTION ON UPDATE CASCADE;

