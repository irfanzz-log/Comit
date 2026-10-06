// Test setup: pastikan JWT_SECRET selalu ada saat test berjalan, dan
// tinggal tetap tenang saat modul sampingan (next/server, pg) tidak
// ter-load di environment vitest murni.
process.env.JWT_SECRET =
    process.env.JWT_SECRET || "test-secret-please-not-in-production";
process.env.NODE_ENV = process.env.NODE_ENV || "test";

// jsdom: simpan createElement asli agar test bisa mem-mock sebagian
// (mis. hanya elemen <a> untuk download) sambil tetap memakai DOM asli
// untuk <table>/<tr>/<td>.
if (typeof document !== "undefined" && !document.__origCreateElement) {
    document.__origCreateElement = document.createElement.bind(document);
}
