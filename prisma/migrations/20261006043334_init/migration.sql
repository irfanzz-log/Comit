-- CreateTable
CREATE TABLE "users" (
    "id" BIGSERIAL NOT NULL,
    "user_npm" VARCHAR(20) NOT NULL,
    "password" TEXT NOT NULL,
    "user_role" VARCHAR(50) NOT NULL DEFAULT 'anggota',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users_info" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "nama" VARCHAR(200) NOT NULL,
    "posisi" VARCHAR(100) NOT NULL DEFAULT 'Anggota',
    "jurusan" VARCHAR(100),
    "minat" VARCHAR(100),
    "status" VARCHAR(50) NOT NULL DEFAULT 'aktif',
    "no_telpon" VARCHAR(100),
    "linkimg" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enrollments" (
    "id" BIGSERIAL NOT NULL,
    "nama" VARCHAR(200) NOT NULL,
    "npm" VARCHAR(20) NOT NULL,
    "no_telpon" VARCHAR(50) NOT NULL,
    "jurusan" VARCHAR(100) NOT NULL,
    "alasan" VARCHAR(1000) NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "enrollments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" BIGSERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "nama_acara" VARCHAR(200) NOT NULL,
    "tanggal_acara" DATE NOT NULL,
    "komentar" VARCHAR(500),
    "tipe_acara" VARCHAR(50) NOT NULL,
    "file_url" VARCHAR(500),
    "file_key" VARCHAR(255),
    "user_id" BIGINT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attendance" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "status_absen" VARCHAR(20) NOT NULL,
    "keterangan" VARCHAR(500),
    "acara" VARCHAR(200),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" BIGSERIAL NOT NULL,
    "tipe" VARCHAR(20) NOT NULL,
    "jumlah" INTEGER NOT NULL,
    "deskripsi" VARCHAR(500),
    "kategori" VARCHAR(50) NOT NULL,
    "created_by" BIGINT NOT NULL,
    "target_user_id" BIGINT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "certificate_templates" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "background" VARCHAR(500) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "certificate_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "certificates" (
    "id" UUID NOT NULL,
    "template_id" BIGINT NOT NULL,
    "certificate_number" VARCHAR(100) NOT NULL,
    "participant_name" VARCHAR(200) NOT NULL,
    "activity_name" VARCHAR(200) NOT NULL,
    "activity_info" VARCHAR(500),
    "issue_date" DATE NOT NULL,
    "signer_name" VARCHAR(200),
    "signer_position" VARCHAR(200),
    "qr_code" VARCHAR(500),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "certificates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_user_npm_key" ON "users"("user_npm");

-- CreateIndex
CREATE UNIQUE INDEX "users_info_user_id_key" ON "users_info"("user_id");

-- CreateIndex
CREATE INDEX "enrollments_npm_idx" ON "enrollments"("npm");

-- CreateIndex
CREATE UNIQUE INDEX "events_uuid_key" ON "events"("uuid");

-- CreateIndex
CREATE INDEX "events_tanggal_acara_idx" ON "events"("tanggal_acara");

-- CreateIndex
CREATE INDEX "attendance_user_id_idx" ON "attendance"("user_id");

-- CreateIndex
CREATE INDEX "attendance_acara_idx" ON "attendance"("acara");

-- CreateIndex
CREATE INDEX "transactions_tipe_idx" ON "transactions"("tipe");

-- CreateIndex
CREATE INDEX "transactions_kategori_idx" ON "transactions"("kategori");

-- CreateIndex
CREATE INDEX "transactions_created_by_idx" ON "transactions"("created_by");

-- CreateIndex
CREATE UNIQUE INDEX "certificates_certificate_number_key" ON "certificates"("certificate_number");

-- CreateIndex
CREATE INDEX "certificates_template_id_idx" ON "certificates"("template_id");

-- AddForeignKey
ALTER TABLE "users_info" ADD CONSTRAINT "users_info_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_target_user_id_fkey" FOREIGN KEY ("target_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificates" ADD CONSTRAINT "certificates_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "certificate_templates"("id") ON DELETE CASCADE ON UPDATE CASCADE;
