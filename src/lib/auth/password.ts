import * as crypto from "crypto";

// Simple password hashing functionality for demo purposes
// In production, use a proper library like bcrypt

export async function hash(password: string): Promise<string> {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

export async function compare(plainPassword: string, hashedPassword: string): Promise<boolean> {
  const [salt, storedHash] = hashedPassword.split(":");
  const hash = crypto.pbkdf2Sync(plainPassword, salt, 1000, 64, "sha512").toString("hex");
  return storedHash === hash;
}
