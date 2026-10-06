import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
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