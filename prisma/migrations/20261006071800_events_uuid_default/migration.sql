-- AlterTable
-- Kolom "uuid" sebelumnya NOT NULL tanpa DEFAULT, sehingga setiap INSERT
-- yang tidak membawa uuid (mis. POST /api/addEvents) melanggar constraint.
-- Buat default di level database agar selalu terisi meski aplikasi lupa.
ALTER TABLE "events" ALTER COLUMN "uuid" SET DEFAULT gen_random_uuid();
