import { createHmac, randomBytes } from 'node:crypto';

const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
const TOTP_PERIOD_SECONDS = 30;
const TOTP_DIGITS = 6;

function encodeBase32(buffer: Buffer): string {
  let bits = '';

  for (const byte of buffer) {
    bits += byte.toString(2).padStart(8, '0');
  }

  let output = '';
  for (let index = 0; index < bits.length; index += 5) {
    const chunk = bits.slice(index, index + 5).padEnd(5, '0');
    output += BASE32_ALPHABET[parseInt(chunk, 2)];
  }

  return output;
}

function decodeBase32(secret: string): Buffer {
  const normalizedSecret = secret
    .replace(/=+$/u, '')
    .replace(/\s+/gu, '')
    .toUpperCase();
  let bits = '';

  for (const character of normalizedSecret) {
    const value = BASE32_ALPHABET.indexOf(character);

    if (value === -1) {
      throw new Error('Invalid base32 secret');
    }

    bits += value.toString(2).padStart(5, '0');
  }

  const bytes: number[] = [];
  for (let index = 0; index + 8 <= bits.length; index += 8) {
    bytes.push(parseInt(bits.slice(index, index + 8), 2));
  }

  return Buffer.from(bytes);
}

function generateCounterBuffer(counter: number): Buffer {
  const buffer = Buffer.alloc(8);
  buffer.writeUInt32BE(Math.floor(counter / 2 ** 32), 0);
  buffer.writeUInt32BE(counter >>> 0, 4);
  return buffer;
}

export function generateBase32Secret(byteLength = 20): string {
  return encodeBase32(randomBytes(byteLength));
}

export function buildOtpAuthUrl(
  email: string,
  secret: string,
  issuer: string,
): string {
  const label = encodeURIComponent(`${issuer}:${email}`);
  const encodedIssuer = encodeURIComponent(issuer);

  return `otpauth://totp/${label}?secret=${secret}&issuer=${encodedIssuer}&period=${TOTP_PERIOD_SECONDS}&digits=${TOTP_DIGITS}`;
}

export function generateTotpToken(
  secret: string,
  epochMs = Date.now(),
): string {
  const counter = Math.floor(epochMs / 1000 / TOTP_PERIOD_SECONDS);
  const counterBuffer = generateCounterBuffer(counter);
  const key = decodeBase32(secret);
  const hmac = createHmac('sha1', key).update(counterBuffer).digest();
  const offset = hmac[hmac.length - 1] & 0x0f;
  const binaryCode =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff);

  return String(binaryCode % 10 ** TOTP_DIGITS).padStart(TOTP_DIGITS, '0');
}

export function verifyTotpToken(
  token: string,
  secret: string,
  window = 1,
  epochMs = Date.now(),
): boolean {
  const normalizedToken = token.trim();

  for (let offset = -window; offset <= window; offset += 1) {
    const candidateToken = generateTotpToken(
      secret,
      epochMs + offset * TOTP_PERIOD_SECONDS * 1000,
    );

    if (candidateToken === normalizedToken) {
      return true;
    }
  }

  return false;
}
