-- AlterTable
-- Kolom "updated_at" NOT NULL tanpa DEFAULT, tetapi INSERT di
-- POST /api/enrollments tidak mengisinya, sehingga pendaftaran anggota
-- baru selalu gagal. Beri default di level database.
ALTER TABLE "enrollments" ALTER COLUMN "updated_at" SET DEFAULT now();
