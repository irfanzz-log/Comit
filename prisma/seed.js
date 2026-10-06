import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

// ==========================================================================
// Konstanta — nilai default DEVELOPMENT ONLY.
// Password demo: <npm> (sama dengan NPM), di-hash dengan bcrypt rounds=10
// agar identik dengan mekanisme production (src/lib/hash.js).
// ==========================================================================

const DEV_PASSWORD_ROUNDS = 10;

// Daftar anggota COMIT periode 2025-2026.
// `role` menentukan hak akses panel internal; `posisi` adalah jabatan
// organisasi (ditampilkan di UI). `linkimg` memetakan ke file foto
// pengurus di /public/pengurus.
const ANGGOTA_2025 = [
  { user_npm: "2023804102", nama: "Danang Prasetio", posisi: "Ketua Umum", role: "superadmin", linkimg: "ketua-umum" },
  { user_npm: "2023804059", nama: "Erik Susanto", posisi: "Wakil Ketua", role: "superadmin", linkimg: "wakil-ketua-umum" },
  { user_npm: "2024102234", nama: "Abella Pinkan Ham", posisi: "Sekretaris I", role: "sekretaris", linkimg: "sekretaris-1" },
  { user_npm: "2024102181", nama: "Putriyana", posisi: "Sekretaris II", role: "sekretaris", linkimg: "sekretaris-2" },
  { user_npm: "2024804058", nama: "Sofi Utami", posisi: "Bendahara I", role: "bendahara", linkimg: "bendahara-1" },
  { user_npm: "2024102189", nama: "Eva Fauziah", posisi: "Bendahara II", role: "bendahara", linkimg: "bendahara-2" },
  { user_npm: "2023804011", nama: "Ahmad Rohman", posisi: "SDM", role: "staff", linkimg: "sdm-1" },
  { user_npm: "2023804004", nama: "Crisvin", posisi: "SDM", role: "staff", linkimg: "sdm-2" },
  { user_npm: "2024102191", nama: "Dewi Fatimah Nurhasiya", posisi: "SDM", role: "staff", linkimg: "sdm-3" },
  { user_npm: "2023804070", nama: "Muhammad Teuku Rizal", posisi: "Koor Humas", role: "staff", linkimg: "koor-humas" },
  { user_npm: "2025804005", nama: "Ihya Ulumudin", posisi: "Humas Internal", role: "staff", linkimg: "humas-internal-1" },
  { user_npm: "2024102037", nama: "Dita Resty Pauji", posisi: "Humas Internal", role: "staff", linkimg: "humas-internal-2" },
  { user_npm: "2024102034", nama: "Komalasari", posisi: "Humas Eksternal", role: "staff", linkimg: "humas-eksternal-1" },
  { user_npm: "2024102179", nama: "Chesa Aulia", posisi: "Humas Eksternal", role: "staff", linkimg: "humas-eksternal-2" },
  { user_npm: "2025102236", nama: "Ryan Adi Prasetyo", posisi: "Humas Eksternal", role: "staff", linkimg: "humas-eksternal-3" },
  { user_npm: "2023806076", nama: "M Irfansyah", posisi: "Koor Akademik", role: "developer", linkimg: "koor-akademik" },
  { user_npm: "2024804175", nama: "Fikriyah", posisi: "Staff Design", role: "staff", linkimg: "design-1" },
  { user_npm: "2025102011", nama: "Meysha Shifa Ayudia", posisi: "Staff Design", role: "staff", linkimg: "design-2" },
  { user_npm: "2025104052", nama: "Nabila Salsabila", posisi: "Staff Design", role: "staff", linkimg: "design-3" },
  { user_npm: "2025804010", nama: "Rifki Dwi Al Zari", posisi: "Staff Program", role: "staff", linkimg: "program-1" },
  { user_npm: "2025806037", nama: "Galih Eza Kurniawansyah", posisi: "Staff Program", role: "staff", linkimg: "program-2" },
  { user_npm: "2025804018", nama: "Reva Andini", posisi: "Staff Program", role: "staff", linkimg: "program-3" },
  { user_npm: "2024804153", nama: "Ripki Dimas Andrea", posisi: "Staff Com. Network", role: "staff", linkimg: "comp-and-network-1" },
  { user_npm: "2024806015", nama: "Rusminah", posisi: "Staff Com. Network", role: "staff", linkimg: "comp-and-network-2" },
  { user_npm: "2024804101", nama: "Haikal Rifalda", posisi: "Staff Com. Network", role: "staff", linkimg: "comp-and-network-3" },
  { user_npm: "2025104062", nama: "Andini Rahmayati", posisi: "Staff Ms. Office", role: "staff", linkimg: "ms-office-1" },
  { user_npm: "2025104063", nama: "Yuliyanti", posisi: "Staff Ms. Office", role: "staff", linkimg: "ms-office-2" },
  { user_npm: "2024104086", nama: "Giany Syahnariza Haura", posisi: "Staff Ms. Office", role: "staff", linkimg: "ms-office-3" },
  { user_npm: "2024104052", nama: "Dona Raflina", posisi: "Staff Ms. Office", role: "staff", linkimg: "ms-office-4" },
  { user_npm: "2023804086", nama: "Nufail Jazali", posisi: "Kominfo", role: "staff", linkimg: "kominfo-1" },
  { user_npm: "2025804007", nama: "Zunda Melandari", posisi: "Kominfo", role: "staff", linkimg: "kominfo-2" },
  { user_npm: "2025804015", nama: "Agustian Sadovin", posisi: "Prasarana", role: "staff", linkimg: "prasarana-1" },
  { user_npm: "2023804165", nama: "Bayu Indra Setiawan", posisi: "Prasarana", role: "staff", linkimg: "prasarana-2" },
  { user_npm: "2025804028", nama: "Muhammad Chandra Wijaya", posisi: "Prasarana", role: "staff", linkimg: "prasarana-3" },
];

// Tanggal dit-tetapkan agar seed deterministik (chart dashboard selalu sama)
const DAY = 24 * 60 * 60 * 1000;
const SEED_BASE = new Date("2026-01-15T09:00:00Z").getTime();

function isoDay(offsetDays) {
  return new Date(SEED_BASE + offsetDays * DAY);
}

async function upsertUser({ user_npm, nama, posisi, role, linkimg, status = "aktif" }) {
  const password = await bcrypt.hash(user_npm, DEV_PASSWORD_ROUNDS);

  const user = await prisma.user.upsert({
    where: { user_npm },
    create: {
      user_npm,
      password,
      user_role: role,
      info: {
        create: { nama, posisi, status, linkimg },
      },
    },
    update: { user_role: role },
  });

  await prisma.userInfo.upsert({
    where: { user_id: user.id },
    create: { user_id: user.id, nama, posisi, status, linkimg },
    update: { nama, posisi, status, linkimg },
  });

  return user;
}

async function main() {
  console.log("→ COMIT seed dimulai (development data)\n");

  // -------------------------------------------------------- Users
  const allUsers = [];
  for (const a of ANGGOTA_2025) {
    allUsers.push(await upsertUser(a));
  }
  const staff = allUsers.filter((u) => u.user_role !== "anggota");
  console.log(`✓ ${allUsers.length} users (${staff.length} staff + ${allUsers.length - staff.length} anggota)`);

  // -------------------------------------------------------- Certificate templates
  const templates = [];
  for (const t of [
    { name: "Template Standart", background: "/certificate/standart.png" },
  ]) {
    templates.push(
      await prisma.certificateTemplate.upsert({
        where: { name: t.name },
        create: t,
        update: { background: t.background },
      })
    );
  }
  console.log(`✓ ${templates.length} certificate template`);

  // -------------------------------------------------------- Events
  const events = [];
  const eventSeed = [
    { nama_acara: "Rapat Bulanan COMIT", tipe_acara: "internal", day: 2, komentar: "Rapat evaluasi program kerja", creatorIdx: 0 },
    { nama_acara: "Workshop Web Development", tipe_acara: "public", day: 9, komentar: "Pengenalan Next.js", creatorIdx: 15 },
    { nama_acara: "Sharing Session Design", tipe_acara: "public", day: 16, komentar: "UI/UX fundamentals", creatorIdx: 17 },
    { nama_acara: "Praktik Jaringan Komputer", tipe_acara: "internal", day: 23, komentar: "Lab Comnet", creatorIdx: 22 },
  ];
  for (const e of eventSeed) {
    const found = await prisma.event.findFirst({ where: { nama_acara: e.nama_acara } });
    const data = {
      nama_acara: e.nama_acara,
      tipe_acara: e.tipe_acara,
      tanggal_acara: isoDay(e.day),
      komentar: e.komentar,
      user_id: allUsers[e.creatorIdx].id,
    };
    events.push(
      found
        ? prisma.event.update({ where: { id: found.id }, data })
        : prisma.event.create({ data })
    );
  }
  const createdEvents = await Promise.all(events);
  console.log(`✓ ${createdEvents.length} events`);

  // -------------------------------------------------------- Attendance
  const ATTENDANCE_STATUS = ["Hadir", "Hadir", "Hadir", "Izin", "Sakit"];
  let attendanceCount = 0;
  for (const ev of createdEvents) {
    for (let i = 0; i < allUsers.length; i++) {
      const u = allUsers[i];
      const status = ATTENDANCE_STATUS[(i + Number(ev.id)) % ATTENDANCE_STATUS.length];
      const existing = await prisma.attendance.findFirst({
        where: { user_id: u.id, acara: ev.nama_acara },
      });
      if (existing) continue;
      await prisma.attendance.create({
        data: {
          user_id: u.id,
          status_absen: status,
          keterangan: status === "Hadir" ? `Hadir di acara ${ev.nama_acara}` : status,
          acara: ev.nama_acara,
          createdAt: isoDay(Number(ev.id) % 20),
        },
      });
      attendanceCount++;
    }
  }
  console.log(`✓ ${attendanceCount} attendance records`);

  // -------------------------------------------------------- Transactions
  const bendahara = allUsers.find((u) => u.user_role === "bendahara") ?? allUsers[0];
  const txSeed = [
    { tipe: "pemasukkan", kategori: "kas", jumlah: 50000, deskripsi: "Uang kas bulanan", day: 1, targetIdx: null },
    { tipe: "pemasukkan", kategori: "kas", jumlah: 50000, deskripsi: "Uang kas bulanan", day: 3, targetIdx: 5 },
    { tipe: "pemasukkan", kategori: "kas", jumlah: 50000, deskripsi: "Uang kas bulanan", day: 5, targetIdx: 6 },
    { tipe: "pemasukkan", kategori: "donasi", jumlah: 250000, deskripsi: "Donasi alumni", day: 8, targetIdx: null },
    { tipe: "pemasukkan", kategori: "kegiatan", jumlah: 1200000, deskripsi: "Pendaftaran workshop", day: 12, targetIdx: null },
    { tipe: "pemasukkan", kategori: "kas", jumlah: 50000, deskripsi: "Uang kas bulanan", day: 15, targetIdx: 7 },
    { tipe: "pemasukkan", kategori: "donasi", jumlah: 100000, deskripsi: "Sponsor kegiatan", day: 19, targetIdx: null },
    { tipe: "pengeluaran", kategori: "kegiatan", jumlah: 350000, deskripsi: "Snack workshop", day: 10, targetIdx: null },
    { tipe: "pengeluaran", kategori: "kegiatan", jumlah: 200000, deskripsi: "Cetak sertifikat", day: 14, targetIdx: null },
    { tipe: "pengeluaran", kategori: "lainnya", jumlah: 75000, deskripsi: "ATK sekretariat", day: 18, targetIdx: null },
    { tipe: "pengeluaran", kategori: "kegiatan", jumlah: 150000, deskripsi: "Konsumsi rapat", day: 21, targetIdx: null },
  ];
  let txCount = 0;
  for (const t of txSeed) {
    const existing = await prisma.transaction.findFirst({
      where: { deskripsi: t.deskripsi, tipe: t.tipe, jumlah: t.jumlah },
    });
    if (existing) continue;
    await prisma.transaction.create({
      data: {
        tipe: t.tipe,
        jumlah: t.jumlah,
        deskripsi: t.deskripsi,
        kategori: t.kategori,
        created_by: bendahara.id,
        target_user_id: t.targetIdx == null ? null : allUsers[t.targetIdx].id,
        createdAt: isoDay(t.day),
      },
    });
    txCount++;
  }
  console.log(`✓ ${txCount} transactions`);

  // -------------------------------------------------------- Enrollments
  const enrollmentSeed = [
    { nama: "Mira Wulandari", npm: "20240001", jurusan: "Teknologi Informasi", status: "pending", day: 2 },
    { nama: "Nanda Pradana", npm: "20240002", jurusan: "Sistem Informasi", status: "pending", day: 4 },
    { nama: "Olivia Syafira", npm: "20240003", jurusan: "Manajemen", status: "approved", day: 6 },
    { nama: "Putra Maheswara", npm: "20240004", jurusan: "Hukum", status: "rejected", day: 8 },
  ];
  for (const e of enrollmentSeed) {
    const existing = await prisma.enrollment.findFirst({ where: { npm: e.npm } });
    const data = {
      nama: e.nama,
      npm: e.npm,
      no_telpon: "08" + e.npm,
      jurusan: e.jurusan,
      alasan: "Ingin belajar dan berkembang di bidang teknologi bersama COMIT",
      status: e.status,
      updatedAt: isoDay(e.day),
    };
    if (existing) {
      await prisma.enrollment.update({ where: { id: existing.id }, data });
    } else {
      await prisma.enrollment.create({ data });
    }
  }
  console.log(`✓ ${enrollmentSeed.length} enrollments`);

  // -------------------------------------------------------- Certificates
  const certCount = await prisma.certificate.count();
  if (certCount === 0) {
    await prisma.certificate.createMany({
      data: [
        {
          template_id: templates[0].id,
          certificate_number: "COMIT-2026-001",
          participant_name: "Eka Pratama",
          activity_name: "Workshop Web Development",
          activity_info: "Peserta aktif workshop Next.js",
          issue_date: isoDay(9),
          signer_name: "Danang Prasetio",
          signer_position: "Ketua Umum",
        },
      ],
    });
    console.log("✓ 1 certificate");
  } else {
    console.log(`✓ certificates sudah ada (${certCount})`);
  }

  console.log("\n→ Seed selesai.\n");
  console.log("  Login demo (password = NPM):");
  for (const s of ANGGOTA_2025.filter((a) => a.role !== "anggota")) {
    console.log(`    ${s.role.padEnd(11)} npm=${s.user_npm}  pass=${s.user_npm}`);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
