import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

// Secret pendek/lemah bisa di-brute-force offline (HS256). .env.example
// sendiri menyarankan randomBytes(48).toString('base64'). Tolak secret
// yang jelas-jelas tidak memenuhi syarat saat modul dimuat — lebih baik
// app gagal start daripada menandatangani token dengan secret lemah.
if (JWT_SECRET.length < 32) {
  throw new Error(
    "JWT_SECRET terlalu pendek (minimum 32 karakter). Generate dengan: " +
      'node -e "console.log(require(\'crypto\').randomBytes(48).toString(\'base64\'))"'
  );
}

// Hanya klaim ini yang boleh ditandatangani. Payload JWT bisa dibaca siapa
// saja (base64), jadi tidak boleh ada field sensitif seperti password.
const ALLOWED_CLAIMS = ["id", "npm", "role"];

function sanitizePayload(payload) {
  const safe = {};
  for (const key of ALLOWED_CLAIMS) {
    if (payload?.[key] !== undefined) safe[key] = payload[key];
  }
  return safe;
}

export function signToken(payload, options = {}) {
  return jwt.sign(sanitizePayload(payload), JWT_SECRET, options);
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}