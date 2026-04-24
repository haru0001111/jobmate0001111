import { promises as fs } from 'fs';
import path from 'path';
import { mockEssays as seedEssays } from '@/lib/mock-essays';
import type { EssayEntry } from '@/types';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'essays.json');

async function ensureStoreFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify(seedEssays, null, 2), 'utf8');
  }
}

export async function readEssaysFromStore(): Promise<EssayEntry[]> {
  await ensureStoreFile();
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf8');
    const parsed = JSON.parse(raw) as EssayEntry[];
    return Array.isArray(parsed) ? parsed : seedEssays;
  } catch {
    return seedEssays;
  }
}

export async function writeEssaysToStore(items: EssayEntry[]) {
  await ensureStoreFile();
  await fs.writeFile(DATA_FILE, JSON.stringify(items, null, 2), 'utf8');
}

export async function readEssayFromStore(id: string): Promise<EssayEntry | undefined> {
  const items = await readEssaysFromStore();
  return items.find((item) => item.id === id);
}

export async function createEssayInStore(input: Omit<EssayEntry, 'id' | 'createdAt' | 'updatedAt'>) {
  const items = await readEssaysFromStore();
  const now = new Date().toISOString();
  const next: EssayEntry = {
    ...input,
    id: `essay_${Date.now()}`,
    createdAt: now,
    updatedAt: now,
  };
  items.unshift(next);
  await writeEssaysToStore(items);
  return next;
}

export async function updateEssayInStore(id: string, patch: Partial<EssayEntry>) {
  const items = await readEssaysFromStore();
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return undefined;

  const current = items[index];
  const next: EssayEntry = {
    ...current,
    ...patch,
    tags: patch.tags ?? current.tags,
    updatedAt: new Date().toISOString(),
  };

  items[index] = next;
  await writeEssaysToStore(items);
  return next;
}

export async function deleteEssayInStore(id: string) {
  const items = await readEssaysFromStore();
  const next = items.filter((item) => item.id !== id);
  if (next.length === items.length) return false;
  await writeEssaysToStore(next);
  return true;
}
