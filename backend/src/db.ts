/**
 * Ultra-light JSON "database".
 *
 * Stores every collection as a JSON file under backend/data/. This keeps the
 * backend dependency-free (no Postgres/Mongo to install) so it runs anywhere
 * with just Node. Swap this module for a real ORM (Prisma, TypeORM) later
 * without touching the route handlers — they only use the helpers below.
 */
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(__dirname, '..', 'data');

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function fileFor(collection: string): string {
  return path.join(DATA_DIR, `${collection}.json`);
}

/** Read an entire collection. Returns [] if it does not exist yet. */
export function readCollection<T = any>(collection: string): T[] {
  ensureDir();
  const file = fileFor(collection);
  if (!fs.existsSync(file)) return [];
  try {
    const raw = fs.readFileSync(file, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/** Overwrite an entire collection. */
export function writeCollection<T = any>(collection: string, rows: T[]): void {
  ensureDir();
  fs.writeFileSync(fileFor(collection), JSON.stringify(rows, null, 2), 'utf-8');
}

/** Seed a collection only if it has no file yet (first run). */
export function seedIfEmpty<T = any>(collection: string, rows: T[]): void {
  ensureDir();
  const file = fileFor(collection);
  if (!fs.existsSync(file)) {
    writeCollection(collection, rows);
  }
}

/** Generate a unique id. */
export function genId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}

/** Current ISO timestamp helper. */
export function nowIso(): string {
  return new Date().toISOString();
}
