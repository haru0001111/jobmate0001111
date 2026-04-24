import { promises as fs } from 'fs';
import path from 'path';
import { companies as seedCompanies } from '@/lib/mock-data-v5';
import type { Company } from '@/types';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'companies.json');

async function ensureStoreFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify(seedCompanies, null, 2), 'utf8');
  }
}

export async function readCompaniesFromStore(): Promise<Company[]> {
  await ensureStoreFile();
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf8');
    const parsed = JSON.parse(raw) as Company[];
    return Array.isArray(parsed) ? parsed : seedCompanies;
  } catch {
    return seedCompanies;
  }
}

export async function readCompanyFromStore(id: string): Promise<Company | undefined> {
  const items = await readCompaniesFromStore();
  return items.find((item) => item.id === id);
}

export async function writeCompaniesToStore(items: Company[]) {
  await ensureStoreFile();
  await fs.writeFile(DATA_FILE, JSON.stringify(items, null, 2), 'utf8');
}

export async function upsertCompanyInStore(id: string, patch: Partial<Company>) {
  const items = await readCompaniesFromStore();
  const index = items.findIndex((item) => item.id === id);

  if (index === -1) {
    return undefined;
  }

  const current = items[index];
  const next: Company = {
    ...current,
    ...patch,
    portal: {
      ...current.portal,
      ...patch.portal,
    },
    selectionFlow: patch.selectionFlow ?? current.selectionFlow ?? [],
    updatedAt: new Date().toISOString(),
  };

  items[index] = next;
  await writeCompaniesToStore(items);
  return next;
}
