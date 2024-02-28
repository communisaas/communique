-- CreateTable
CREATE TABLE "author" (
    "read_email_count" INT8 NOT NULL,
    "sent_email_count" INT8 NOT NULL,
    "open_email_count" INT8 NOT NULL,
    "email_address" STRING NOT NULL,
    "last_updated" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "issue_list" STRING[],
    "add_date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "email_id_list" STRING[],

    CONSTRAINT "author___pkey" PRIMARY KEY ("email_address")
);

-- CreateTable
CREATE TABLE "email" (
    "subject" STRING NOT NULL,
    "body" STRING NOT NULL,
    "topic_list" STRING[],
    "open_count" INT8 NOT NULL,
    "clipboard_count" INT8 NOT NULL,
    "send_count" INT8 NOT NULL,
    "read_count" INT8 NOT NULL,
    "recipient_list" STRING[],
    "rowid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "added_by" STRING NOT NULL,
    "shortid" STRING NOT NULL,
    "title" STRING,
    "add_date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "issue_list" STRING[],
    "postal_code" STRING,
    "state" STRING,
    "country" STRING,
    "city" STRING,
    "last_updated" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "email___pkey" PRIMARY KEY ("rowid")
);

-- CreateTable
CREATE TABLE "issue" (
    "type" STRING,
    "description" STRING,
    "rowid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "added_by" STRING NOT NULL,
    "add_date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "email_id" STRING NOT NULL,

    CONSTRAINT "issue___pkey" PRIMARY KEY ("rowid")
);

-- CreateTable
CREATE TABLE "recipient" (
    "address" STRING NOT NULL,
    "email_open_count" INT8 NOT NULL,
    "email_read_count" INT8 NOT NULL,
    "email_sent_count" INT8 NOT NULL,
    "added_by" STRING NOT NULL,
    "email_count" INT8 NOT NULL,
    "last_updated" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "add_date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "recipient___pkey" PRIMARY KEY ("address")
);

-- CreateTable
CREATE TABLE "topic" (
    "name" STRING NOT NULL,
    "email_count" INT8 NOT NULL,
    "last_updated" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email_open_count" INT8 NOT NULL,
    "email_read_count" INT8 NOT NULL,
    "email_sent_count" INT8 NOT NULL,
    "added_by" STRING NOT NULL,
    "add_date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "topic___pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "user" (
    "email" STRING NOT NULL,
    "fingerprint" JSONB,
    "ignored_email_list" STRING[],
    "address" STRING,
    "signup_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "phone" STRING,
    "auth_provider" STRING,
    "last_login" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "sent_email_list" STRING[],
    "privilege" INT8 DEFAULT 0,
    "given_name" STRING,
    "family_name" STRING,

    CONSTRAINT "user__pkey" PRIMARY KEY ("email")
);

-- CreateIndex
CREATE UNIQUE INDEX "shortid__key" ON "email"("shortid");

-- CreateIndex
CREATE UNIQUE INDEX "added_by_email_id___ckey" ON "issue"("added_by", "email_id");

-- AddForeignKey
ALTER TABLE "author" ADD CONSTRAINT "author___fkey" FOREIGN KEY ("email_address") REFERENCES "user"("email") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email" ADD CONSTRAINT "added_by___fkey" FOREIGN KEY ("added_by") REFERENCES "author"("email_address") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "issue" ADD CONSTRAINT "added_by___fk" FOREIGN KEY ("added_by") REFERENCES "user"("email") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "issue" ADD CONSTRAINT "email_id___fk" FOREIGN KEY ("email_id") REFERENCES "email"("shortid") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipient" ADD CONSTRAINT "added_by___fkey" FOREIGN KEY ("added_by") REFERENCES "author"("email_address") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "topic" ADD CONSTRAINT "added_by___fkey" FOREIGN KEY ("added_by") REFERENCES "author"("email_address") ON DELETE NO ACTION ON UPDATE CASCADE;

