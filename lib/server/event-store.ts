import { promises as fs } from 'fs';
import path from 'path';
import { events as seedEvents } from '@/lib/mock-data';
import type { JobEvent } from '@/types';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'events.json');

async function ensureStoreFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify(seedEvents, null, 2), 'utf8');
  }
}

export async function readEventsFromStore(): Promise<JobEvent[]> {
  await ensureStoreFile();
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf8');
    const parsed = JSON.parse(raw) as JobEvent[];
    return Array.isArray(parsed) ? parsed : seedEvents;
  } catch {
    return seedEvents;
  }
}

export async function writeEventsToStore(items: JobEvent[]) {
  await ensureStoreFile();
  await fs.writeFile(DATA_FILE, JSON.stringify(items, null, 2), 'utf8');
}

export async function readEventFromStore(id: string): Promise<JobEvent | undefined> {
  const items = await readEventsFromStore();
  return items.find((item) => item.id === id);
}

export async function createEventInStore(input: Omit<JobEvent, 'id'>) {
  const items = await readEventsFromStore();
  const next: JobEvent = {
    ...input,
    id: `event_${Date.now()}`,
  };
  items.unshift(next);
  await writeEventsToStore(items);
  return next;
}

export async function updateEventInStore(id: string, patch: Partial<JobEvent>) {
  const items = await readEventsFromStore();
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return undefined;

  const current = items[index];
  const next: JobEvent = {
    ...current,
    ...patch,
    reminderMinutes: patch.reminderMinutes ?? current.reminderMinutes,
  };

  items[index] = next;
  await writeEventsToStore(items);
  return next;
}

export async function deleteEventInStore(id: string) {
  const items = await readEventsFromStore();
  const next = items.filter((item) => item.id !== id);
  if (next.length === items.length) return false;
  await writeEventsToStore(next);
  return true;
}
