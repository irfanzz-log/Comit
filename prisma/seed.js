import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

// ==========================================================================
// Konstanta — nilai default DEVELOPMENT ONLY.
// Password demo: <npm> (sama dengan NPM), di-hash dengan bcrypt rounds=10
// agar identik dengan mekanisme production (src/lib/hash.js).
// ==========================================================================

const DEV_PASSWORD_ROUNDS = 10;

const STAFF = [
  {
    user_npm: "20220001",
    nama: "Syah Irfan",
    posisi: "Developer",
    user_role: "developer",
    jurusan: "Teknologi Informasi",
    minat: "Programming",
    no_telpon: "081234567801",
    linkimg: "kominfo-1",
  },
  {
    user_npm: "20220002",
    nama: "Aulia Putri",
    posisi: "Sekretaris",
    user_role: "sekretaris",
    jurusan: "Sistem Informasi",
    minat: "Office",
    no_telpon: "081234567802",
    linkimg: "sekretaris-1",
  },
  {
    user_npm: "20220003",
    nama: "Budi Santoso",
    posisi: "Bendahara",
    user_role: "bendahara",
    jurusan: "Akuntansi",
    minat: "Office",
    no_telpon: "081234567803",
    linkimg: "bendahara-1",
  },
  {
    user_npm: "20220004",
    nama: "Citra Lestari",
    posisi: "Ketua Umum",
    user_role: "superadmin",
    jurusan: "Teknologi Informasi",
    minat: "Programming",
    no_telpon: "081234567804",
    linkimg: "ketua-umum",
  },
  {
    user_npm: "20220005",
    nama: "Dewi Anggraini",
    posisi: "Koordinator Humas",
    user_role: "staff",
    jurusan: "Manajemen",
    minat: "Design",
    no_telpon: "081234567805",
    linkimg: "humas-eksternal-1",
  },
];

const ANGGOTA = [
  { user_npm: "20230001", nama: "Eka Pratama", jurusan: "Teknologi Informasi", minat: "Programming", no_telpon: "081234000001", linkimg: "program-1" },
  { user_npm: "20230002", nama: "Fitra Ramadhan", jurusan: "Teknologi Informasi", minat: "Design", no_telpon: "081234000002", linkimg: "design-1" },
  { user_npm: "20230003", nama: "Gita Nurhaliza", jurusan: "Sistem Informasi", minat: "Comnet", no_telpon: "081234000003", linkimg: "comp-and-network-1" },
  { user_npm: "20230004", nama: "Hadi Wijaya", jurusan: "Manajemen", minat: "Office", no_telpon: "081234000004", linkimg: "ms-office-1" },
  { user_npm: "20230005", nama: "Indah Permata", jurusan: "Akuntansi", minat: "Office", no_telpon: "081234000005", linkimg: "ms-office-2" },
  { user_npm: "20230006", nama: "Joko Susilo", jurusan: "Teknologi Informasi", minat: "Programming", no_telpon: "081234000006", linkimg: "program-2" },
  { user_npm: "20230007", nama: "Kirana Dewi", jurusan: "Hukum", minat: "Design", no_telpon: "081234000007", linkimg: "design-2" },
  { user_npm: "20230008", nama: "Lukman Hakim", jurusan: "Sistem Informasi", minat: "Comnet", no_telpon: "081234000008", linkimg: "comp-and-network-2" },
];

// Tanggal dit-tetapkan agar seed deterministik (chart dashboard selalu sama)
const DAY = 24 * 60 * 60 * 1000;
const SEED_BASE = new Date("2026-01-15T09:00:00Z").getTime();

function isoDay(offsetDays) {
  return new Date(SEED_BASE + offsetDays * DAY);
}

function fmtDate(d) {
  return d.toISOString().slice(0, 10);
}

async function upsertUser({ user_npm, nama, posisi, user_role, jurusan, minat, no_telpon, linkimg, status = "aktif" }) {
  const password = await bcrypt.hash(user_npm, DEV_PASSWORD_ROUNDS);

  const user = await prisma.user.upsert({
    where: { user_npm },
    create: {
      user_npm,
      password,
      user_role,
      info: {
        create: { nama, posisi, jurusan, minat, status, no_telpon, linkimg },
      },
    },
    update: { user_role },
  });

  await prisma.userInfo.upsert({
    where: { user_id: user.id },
    create: { user_id: user.id, nama, posisi, jurusan, minat, status, no_telpon, linkimg },
    update: { nama, posisi, jurusan, minat, status, no_telpon, linkimg },
  });

  return user;
}

async function main() {
  console.log("→ COMIT seed dimulai (development data)\n");

  // -------------------------------------------------------- Users
  const staff = [];
  for (const s of STAFF) {
    staff.push(await upsertUser(s));
  }
  const anggota = [];
  for (const a of ANGGOTA) {
    anggota.push(await upsertUser({ ...a, posisi: "Anggota", user_role: "anggota" }));
  }
  const allUsers = [...staff, ...anggota];
  console.log(`✓ ${allUsers.length} users (${staff.length} staff + ${anggota.length} anggota)`);

  // -------------------------------------------------------- Certificate templates
  const templates = [];
  for (const t of [
    { name: "Template Standart", background: "/certificate/standart.png" },
    { name: "Template Premium", background: "/certificate/premium.png" },
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
    { nama_acara: "Rapat Bulanan COMIT", tipe_acara: "internal", day: 2, komentar: "Rapat evaluasi program kerja", creatorIdx: 3 },
    { nama_acara: "Workshop Web Development", tipe_acara: "public", day: 9, komentar: "Pengenalan Next.js", creatorIdx: 0 },
    { nama_acara: "Sharing Session Design", tipe_acara: "public", day: 16, komentar: "UI/UX fundamentals", creatorIdx: 4 },
    { nama_acara: "Praktik Jaringan Komputer", tipe_acara: "internal", day: 23, komentar: "Lab Comnet", creatorIdx: 2 },
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
  const bendahara = staff.find((s) => s.user_role === "bendahara") ?? staff[0];
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
  let enrCount = 0;
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
      enrCount++;
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
          signer_name: "Citra Lestari",
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
  for (const s of staff) {
    console.log(`    ${s.user_role.padEnd(11)} npm=${s.user_npm}  pass=${s.user_npm}`);
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
