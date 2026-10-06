# Database & Deployment — COMIT

Dokumentasi setup database lokal, dump/restore, dan deployment ke VPS.

Stack: **Next.js 15 (App Router, JavaScript)** + **PostgreSQL 16** + **Prisma 6**.

Prisma adalah **single source of truth** untuk schema: `prisma/schema.prisma`.
Setiap perubahan schema harus melalui migration (`npm run db:migrate`), lalu
commit folder `prisma/migrations/` ke repository.

---

## 1. Setup database lokal (dari nol)

Prerequisite: PostgreSQL terinstall dan berjalan.

```bash
# Contoh: install PostgreSQL 16 via Homebrew (macOS)
brew install postgresql@16
brew services start postgresql@16
```

Buat role + database:

```bash
psql postgres <<'SQL'
CREATE ROLE comit WITH LOGIN PASSWORD 'comit123';
CREATE DATABASE comit_db    OWNER comit;
CREATE DATABASE comit_shadow OWNER comit;
SQL
```

Salin environment:

```bash
cp .env.example .env
# isi JWT_SECRET:
node -e "console.log(require('crypto').randomBytes(48).toString('base64'))" >> .env
```

Jalankan migration + seed dari kondisi kosong:

```bash
npm install
npm run db:generate     # generate Prisma Client
npm run db:deploy       # terapkan migration yang belum ada
npm run db:seed         # isi data development
```

Untuk reset total (hapus + buat ulang + seed):

```bash
npm run db:reset
```

### Login demo (hasil `db:seed`)

Password = NPM.

| Role        | NPM      |
|-------------|----------|
| developer   | 20220001 |
| sekretaris  | 20220002 |
| bendahara   | 20220003 |
| superadmin  | 20220004 |
| staff       | 20220005 |

### Credential database lokal

```
host     : localhost:5432
database : comit_db
user     : comit
password : comit123
```

> Password di atas hanya untuk database lokal. Di VPS gunakan password kuat
> yang dibuat saat setup (bagian 3).

---

## 2. Dump & restore database

`pg_dump` / `pg_restore` adalah jalur yang tepat untuk memindahkan data
antarmesin tanpa konflik sequence/fk.

### Dump dari lokal

```bash
# Format custom (paralel, cepat di-restore)
pg_dump -Fc -h localhost -U comit -d comit_db -f comit_db.dump

# Atau format SQL biasa
pg_dump -h localhost -U comit -d comit_db -f comit_db.sql
```

### Restore ke VPS

```bash
# format custom
pg_restore -h <VPS_HOST> -U comit -d comit_db --clean --if-exists comit_db.dump

# format SQL
psql -h <VPS_HOST> -U comit -d comit_db -f comit_db.sql
```

Setelah restore dari dump, sinkronkan schema agar migration state benar:

```bash
npx prisma migrate deploy
```

> Catatan: dump berisi data saja sudah cukup. Jika database VPS masih kosong,
> jalankan `npx prisma migrate deploy` dulu agar tabel ada sebelum restore.

---

## 3. Deployment ke VPS

### 3.1 Prerequisite VPS

- Node.js 20+ (v22 LTS disarankan)
- PostgreSQL 15+
- Nginx (reverse proxy + TLS)
- PM2 (process manager)

```bash
# di VPS
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo bash -
sudo apt install -y nodejs postgresql nginx
sudo npm install -g pm2
```

### 3.2 Database di VPS

```bash
sudo -u postgres psql <<'SQL'
CREATE ROLE comit WITH LOGIN PASSWORD '<PASSWORD_KUAT>';
CREATE DATABASE comit_db OWNER comit;
SQL
```

### 3.3 Clone & build

```bash
git clone <repo-url> /var/www/comit
cd /var/www/comit
npm ci
```

Buat `.env` produksi (lihat `.env.example`):

```bash
cat > .env <<'EOF'
DATABASE_URL="postgresql://comit:<PASSWORD_KUAT>@localhost:5432/comit_db"
JWT_SECRET="<SECRET_RANDOM>"
NODE_ENV="production"
RESEND_API_KEY="<API_KEY>"
UPLOADTHING_SECRET="<UT_SECRET>"
UPLOADTHING_APP_ID="<UT_APP_ID>"
EOF
chmod 600 .env
```

Generate JWT secret baru di VPS:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"
```

Build:

```bash
npm run db:deploy    # terapkan schema
npm run build
```

### 3.4 Jalankan dengan PM2

```bash
pm2 start "npm run start" --name comit
pm2 save
pm2 startup            # auto-start saat reboot
```

### 3.5 Nginx reverse proxy

```nginx
server {
    server_name comit.id;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Body upload (sertifikat/galeri)
    client_max_body_size 10M;
}
```

Aktifkan TLS:

```bash
sudo certbot --nginx -d comit.id
```

### 3.6 Update deployment

```bash
cd /var/www/comit
git pull
npm ci
npm run db:deploy
npm run build
pm2 restart comit
```

---

## 4. Variabel environment

| Variabel              | Wajib | Keterangan                                  |
|-----------------------|:-----:|---------------------------------------------|
| `DATABASE_URL`        |  Ya   | Connection string utama (dipakai Prisma)    |
| `SHADOW_DATABASE_URL` |  -    | Hanya untuk `migrate reset` saat dev        |
| `JWT_SECRET`          |  Ya   | Secret HS256 token autentikasi              |
| `NODE_ENV`            |  Ya   | `development` / `production`               |
| `RESEND_API_KEY`      |  -    | Pengiriman email form kontak                |
| `UPLOADTHING_SECRET`  |  -    | Upload file (sertifikat, galeri)            |
| `UPLOADTHING_APP_ID`  |  -    | Upload file (sertifikat, galeri)            |

`PGHOST` / `PGPORT` / `PGUSER` / `PGPASSWORD` / `PGDATABASE` diwarisi dari
`DATABASE_URL` oleh Prisma, dan hanya dipakai oleh `pg` CLI (`pg_dump`,
`pg_restore`).

---

## 5. Schema & migration workflow

Prisma adalah source of truth. Workflow perubahan schema:

```bash
# 1. Edit prisma/schema.prisma
# 2. Buat migration
npm run db:migrate -- --name <deskripsi_singkat>
# 3. Commit schema.prisma + folder prisma/migrations/
```

Lihat data secara visual:

```bash
npm run db:studio
```

### Tabel

| Tabel                  | Isi                                       |
|------------------------|-------------------------------------------|
| `users`                | Akun + role (`developer`, `superadmin`, `sekretaris`, `staff`, `bendahara`, `anggota`) |
| `users_info`           | Profil anggota (nama, jurusan, minat)     |
| `enrollments`          | Pendaftaran calon anggota                 |
| `events`               | Kegiatan/acara                            |
| `attendance`           | Absensi per acara                         |
| `transactions`         | Kas (pemasukkan / pengeluaran)            |
| `certificate_templates`| Template sertifikat                       |
| `certificates`         | Sertifikat yang diterbitkan               |

---

## 6. Scripts

| Script             | Keterangan                              |
|--------------------|-----------------------------------------|
| `npm run dev`      | Development server (port 3000)          |
| `npm run build`    | Production build                        |
| `npm run start`    | Jalankan production build               |
| `npm run lint`     | ESLint                                  |
| `npm run db:generate` | Generate Prisma Client               |
| `npm run db:migrate` | Buat migration dari perubahan schema   |
| `npm run db:deploy`  | Terapkan migration                    |
| `npm run db:seed`    | Isi data development                  |
| `npm run db:reset`   | Reset total + seed                    |
| `npm run db:studio`  | GUI Prisma Studio                     |
