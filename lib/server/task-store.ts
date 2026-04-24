import { promises as fs } from 'fs';
import path from 'path';
import { tasks as seedTasks } from '@/lib/mock-data';
import type { JobTask } from '@/types';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'tasks.json');

async function ensureStoreFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify(seedTasks, null, 2), 'utf8');
  }
}

export async function readTasksFromStore(): Promise<JobTask[]> {
  await ensureStoreFile();
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf8');
    const parsed = JSON.parse(raw) as JobTask[];
    return Array.isArray(parsed) ? parsed : seedTasks;
  } catch {
    return seedTasks;
  }
}

export async function writeTasksToStore(items: JobTask[]) {
  await ensureStoreFile();
  await fs.writeFile(DATA_FILE, JSON.stringify(items, null, 2), 'utf8');
}

export async function readTaskFromStore(id: string): Promise<JobTask | undefined> {
  const items = await readTasksFromStore();
  return items.find((item) => item.id === id);
}

export async function createTaskInStore(input: Omit<JobTask, 'id'>) {
  const items = await readTasksFromStore();
  const next: JobTask = {
    ...input,
    id: `task_${Date.now()}`,
  };
  items.unshift(next);
  await writeTasksToStore(items);
  return next;
}

export async function updateTaskInStore(id: string, patch: Partial<JobTask>) {
  const items = await readTasksFromStore();
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return undefined;

  const current = items[index];
  const next: JobTask = {
    ...current,
    ...patch,
  };

  items[index] = next;
  await writeTasksToStore(items);
  return next;
}

export async function deleteTaskInStore(id: string) {
  const items = await readTasksFromStore();
  const next = items.filter((item) => item.id !== id);
  if (next.length === items.length) return false;
  await writeTasksToStore(next);
  return true;
}
