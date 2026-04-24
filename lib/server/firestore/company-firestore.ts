import { collection, doc, getDoc, getDocs, orderBy, query, setDoc } from 'firebase/firestore';
import type { Company } from '@/types';
import { getFirestoreDb } from '../firestore-admin-lite';

const COLLECTION_NAME = 'companies';

function withId(id: string, data: Record<string, unknown>): Company {
  return {
    id,
    name: String(data.name ?? ''),
    ...({ status: String(data.status ?? 'interested') } as any),
    industry: data.industry ? String(data.industry) : undefined,
    website: data.website ? String(data.website) : undefined,
    jobType: data.jobType ? String(data.jobType) : undefined,
    location: data.location ? String(data.location) : undefined,
    salary: data.salary ? String(data.salary) : undefined,
    deadline: data.deadline ? String(data.deadline) : undefined,
    description: data.description ? String(data.description) : undefined,
    selectionFlow: Array.isArray(data.selectionFlow) ? data.selectionFlow.map(String) : [],
    testType: data.testType ? String(data.testType) : undefined,
    memo: data.memo ? String(data.memo) : undefined,
    portal: typeof data.portal === 'object' && data.portal ? (data.portal as Company['portal']) : undefined,
    createdAt: String(data.createdAt ?? new Date().toISOString()),
    updatedAt: String(data.updatedAt ?? new Date().toISOString()),
    userId: data.userId ? String(data.userId) : undefined,
  };
}

export async function readCompaniesFromFirestore(): Promise<Company[]> {
  const db = getFirestoreDb();
  const ref = collection(db, COLLECTION_NAME);
  const snapshot = await getDocs(query(ref, orderBy('updatedAt', 'desc')));
  return snapshot.docs.map((item) => withId(item.id, item.data()));
}

export async function readCompanyFromFirestore(id: string): Promise<Company | undefined> {
  const db = getFirestoreDb();
  const snapshot = await getDoc(doc(db, COLLECTION_NAME, id));
  if (!snapshot.exists()) return undefined;
  return withId(snapshot.id, snapshot.data());
}

export async function upsertCompanyInFirestore(id: string, patch: Partial<Company>): Promise<Company | undefined> {
  const current = await readCompanyFromFirestore(id);
  if (!current) return undefined;

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

  const db = getFirestoreDb();
  await setDoc(doc(db, COLLECTION_NAME, id), next, { merge: true });
  return next;
}
