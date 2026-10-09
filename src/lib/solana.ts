/** Solana payment-channels wire format. Devnet mirror — vouchers are real Ed25519. */

export const CLUSTER = "solana:devnet";
export const CHANNEL_PROGRAM = "CHNLxYvVA28MJP9PrFuDXccuoGXAx7jBacfLEkahyGsX";
export const USDC_MINT = "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU";
export const USDC_DECIMALS = 6;

export const FAUCET_USDC = 25;
export const FAUCET_CAP = 100;
export const SUGGESTED_CEILING = 10;
export const CHANNEL_PRESETS = [5, 10, 25] as const;

const ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

export function base58Encode(source: Uint8Array): string {
  if (source.length === 0) return "";
  const zeroes = source.findIndex((b) => b !== 0);
  const leading = zeroes === -1 ? source.length : zeroes;
  let pbegin = leading === source.length ? source.length : leading;
  const pend = source.length;
  const size = (((pend - pbegin) * Math.log(256)) / Math.log(58) + 1) >>> 0;
  const b58 = new Uint8Array(size);
  let length = 0;
  while (pbegin !== pend) {
    let carry = source[pbegin];
    let i = 0;
    for (let it = size - 1; (carry !== 0 || i < length) && it !== -1; it--, i++) {
      carry += (256 * b58[it]) >>> 0;
      b58[it] = carry % 58;
      carry = (carry / 58) >>> 0;
    }
    length = i;
    pbegin++;
  }
  let it = size - length;
  while (it !== size && b58[it] === 0) it++;
  let str = "1".repeat(leading);
  for (; it < size; ++it) str += ALPHABET[b58[it]];
  return str;
}

export function base58Decode(source: string): Uint8Array {
  if (source.length === 0) return new Uint8Array();
  let psz = 0;
  let zeroes = 0;
  while (source[psz] === "1") {
    zeroes++;
    psz++;
  }
  const size = (((source.length - psz) * Math.log(58)) / Math.log(256) + 1) >>> 0;
  const b256 = new Uint8Array(size);
  let length = 0;
  while (psz < source.length) {
    const ch = ALPHABET.indexOf(source[psz]);
    if (ch === -1) throw new Error("bad base58");
    let carry = ch;
    let i = 0;
    for (let it = size - 1; (carry !== 0 || i < length) && it !== -1; it--, i++) {
      carry += 58 * b256[it];
      b256[it] = carry % 256;
      carry = Math.floor(carry / 256);
    }
    length = i;
    psz++;
  }
  let it = size - length;
  while (it !== size && b256[it] === 0) it++;
  const out = new Uint8Array(zeroes + (size - it));
  out.set(b256.subarray(it), zeroes);
  return out;
}

export function usdcToAtomic(amount: number): bigint {
  return BigInt(Math.round(amount * 1_000_000));
}

function asBuffer(bytes: Uint8Array): Uint8Array<ArrayBuffer> {
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);
  return copy;
}

export function bytesToB64(bytes: Uint8Array): string {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s);
}

export function b64ToBytes(b64: string): Uint8Array {
  const s = atob(b64);
  const out = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) out[i] = s.charCodeAt(i);
  return out;
}

/** 50-byte voucher: magic, channel id, cumulative u64 LE, expires_at i64 LE. */
export function encodeVoucher(channelId: Uint8Array, cumulativeAtomic: bigint, expiresAt = 0n): Uint8Array {
  if (channelId.length !== 32) throw new Error("channel id must be 32 bytes");
  const msg = new Uint8Array(50);
  msg[0] = 0x56;
  msg[1] = 0x01;
  msg.set(channelId, 2);
  const view = new DataView(msg.buffer);
  view.setBigUint64(34, cumulativeAtomic, true);
  view.setBigInt64(42, expiresAt, true);
  return msg;
}

export function decodeVoucher(msg: Uint8Array): { channel: Uint8Array; cumulative: bigint; expiresAt: bigint } | null {
  if (msg.length !== 50 || msg[0] !== 0x56 || msg[1] !== 0x01) return null;
  const view = new DataView(msg.buffer, msg.byteOffset, msg.byteLength);
  return {
    channel: msg.slice(2, 34),
    cumulative: view.getBigUint64(34, true),
    expiresAt: view.getBigInt64(42, true),
  };
}

export type AgentKeys = {
  address: string;
  publicKey: string;
  privateKeyPkcs8: string;
};

export async function generateAgentKeys(): Promise<AgentKeys> {
  const kp = await crypto.subtle.generateKey({ name: "Ed25519" }, true, ["sign", "verify"]);
  const raw = new Uint8Array(await crypto.subtle.exportKey("raw", kp.publicKey));
  const pkcs8 = new Uint8Array(await crypto.subtle.exportKey("pkcs8", kp.privateKey));
  return {
    address: base58Encode(raw),
    publicKey: bytesToB64(raw),
    privateKeyPkcs8: bytesToB64(pkcs8),
  };
}

export async function signMessage(privateKeyPkcs8B64: string, message: Uint8Array): Promise<Uint8Array> {
  const pkcs8 = b64ToBytes(privateKeyPkcs8B64);
  const key = await crypto.subtle.importKey("pkcs8", asBuffer(pkcs8), { name: "Ed25519" }, false, ["sign"]);
  return new Uint8Array(await crypto.subtle.sign({ name: "Ed25519" }, key, asBuffer(message)));
}

export async function verifyVoucher(input: {
  payer: string;
  publicKey: string;
  voucher: string;
  signature: string;
}): Promise<{ ok: true; channel: string; cumulativeAtomic: bigint } | { ok: false; error: string }> {
  let pub: Uint8Array;
  let msg: Uint8Array;
  let sig: Uint8Array;
  try {
    pub = b64ToBytes(input.publicKey);
    msg = b64ToBytes(input.voucher);
    sig = b64ToBytes(input.signature);
  } catch {
    return { ok: false, error: "invalid_voucher" };
  }
  if (pub.length !== 32 || msg.length !== 50 || sig.length !== 64) {
    return { ok: false, error: "invalid_voucher" };
  }
  if (base58Encode(pub) !== input.payer) return { ok: false, error: "payer_mismatch" };
  const decoded = decodeVoucher(msg);
  if (!decoded || decoded.cumulative <= 0n) return { ok: false, error: "invalid_voucher" };
  const key = await crypto.subtle.importKey("raw", asBuffer(pub), { name: "Ed25519" }, false, ["verify"]);
  const valid = await crypto.subtle.verify({ name: "Ed25519" }, key, asBuffer(sig), asBuffer(msg));
  if (!valid) return { ok: false, error: "bad_signature" };
  return { ok: true, channel: base58Encode(decoded.channel), cumulativeAtomic: decoded.cumulative };
}
