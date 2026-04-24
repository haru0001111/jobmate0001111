import type { Company } from '@/types';
import { readCompaniesFromStore, writeCompaniesToStore } from './company-store';

function ensureArray(value: unknown): Company[] {
  return Array.isArray(value) ? (value as Company[]) : [];
}

export async function getCompanies(userId: string): Promise<Company[]> {
  const companies = ensureArray(await readCompaniesFromStore());
  return companies
    .filter((item) => !item.userId || item.userId === userId)
    .map((item) => ({
      ...item,
      userId: item.userId ?? userId,
    }));
}

export async function getCompany(id: string, userId: string): Promise<Company | undefined> {
  const companies = ensureArray(await readCompaniesFromStore());
  return companies.find((item) => item.id === id && (!item.userId || item.userId === userId));
}

export async function createCompany(company: Company, userId: string): Promise<Company> {
  const companies = ensureArray(await readCompaniesFromStore());
  const next = { ...company, userId };
  companies.push(next);
  await writeCompaniesToStore(companies);
  return next;
}

export async function updateCompany(id: string, patch: Partial<Company>, userId: string): Promise<Company | undefined> {
  const companies = ensureArray(await readCompaniesFromStore());
  const index = companies.findIndex((item) => item.id === id && (!item.userId || item.userId === userId));
  if (index === -1) return undefined;

  companies[index] = {
    ...companies[index],
    ...patch,
    id,
    userId,
  };

  await writeCompaniesToStore(companies);
  return companies[index];
}

export async function deleteCompany(id: string, userId: string): Promise<boolean> {
  const companies = ensureArray(await readCompaniesFromStore());
  const next = companies.filter((item) => !(item.id === id && (!item.userId || item.userId === userId)));

  if (next.length === companies.length) return false;

  await writeCompaniesToStore(next);
  return true;
}