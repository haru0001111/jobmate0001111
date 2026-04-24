import type { Company } from '@/types';

const STORAGE_KEY = 'jobmate.company-overrides.v1';

type CompanyOverrideMap = Record<string, Partial<Company>>;

export function mergeCompany(base: Company, override?: Partial<Company>): Company {
  return {
    ...base,
    ...override,
    portal: {
      ...base.portal,
      ...override?.portal,
    },
    selectionFlow: override?.selectionFlow ?? base.selectionFlow ?? [],
    updatedAt: override?.updatedAt ?? base.updatedAt,
  };
}

export function readCompanyOverrides(): CompanyOverrideMap {
  if (typeof window === 'undefined') return {};

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as CompanyOverrideMap;
  } catch {
    return {};
  }
}

export function readCompanyOverride(companyId: string): Partial<Company> | undefined {
  return readCompanyOverrides()[companyId];
}

export function writeCompanyOverride(companyId: string, value: Partial<Company>) {
  if (typeof window === 'undefined') return;
  const current = readCompanyOverrides();
  current[companyId] = value;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
}
