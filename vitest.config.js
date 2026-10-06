import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
    test: {
        // jsdom dipakai karena beberapa modul (exportExcel) memanipulasi DOM.
        // Modul server-only (jwt, db) tetap aman karena hanya mengimpor node
        // built-in.
        environment: "jsdom",
        globals: true,
        include: ["tests/**/*.test.{js,jsx}"],
        setupFiles: ["tests/setup.js"],
        // Panggilan `restoreMocks` otomatis di setiap test agar spy tidak
        // bocor antar test.
        restoreMocks: true,
        coverage: {
            provider: "v8",
            reporter: ["text", "json", "html"],
            include: ["src/lib/**", "src/app/api/**"],
            exclude: ["src/app/api/uploadthing/**"],
        },
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
});
