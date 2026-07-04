const STORAGE_KEY = "inkwell-encryption-key";

async function getOrCreateKey(): Promise<CryptoKey> {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    const keyData = Uint8Array.from(JSON.parse(stored));
    return crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "AES-GCM" },
      false,
      ["encrypt", "decrypt"],
    );
  }
  const key = await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"],
  );
  const keyData = await crypto.subtle.exportKey("raw", key);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(new Uint8Array(keyData))));
  return key;
}

export async function encrypt(text: string): Promise<string> {
  if (!text) return "";
  const key = await getOrCreateKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(text);
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoded,
  );
  const combined = new Uint8Array([...iv, ...new Uint8Array(ciphertext)]);
  return btoa(String.fromCharCode(...combined));
}

export async function decrypt(encoded: string): Promise<string> {
  if (!encoded) return "";
  const key = await getOrCreateKey();
  try {
    const decoded = Uint8Array.from(atob(encoded), (c) => c.charCodeAt(0));
    const iv = decoded.slice(0, 12);
    const ciphertext = decoded.slice(12);
    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      ciphertext,
    );
    return new TextDecoder().decode(decrypted);
  } catch {
    return "";
  }
}

export function maskToken(token: string): string {
  if (!token) return "";
  if (token.length <= 8) return token.replace(/./g, "*");
  const prefix = token.slice(0, 4);
  const suffix = token.slice(-4);
  return `${prefix}${"x".repeat(Math.max(0, token.length - 8))}${suffix}`;
}