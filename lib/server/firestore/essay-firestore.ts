import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, setDoc, where } from 'firebase/firestore';
import type { EssayEntry } from '@/types';
import { getFirestoreDb } from '../firestore-admin-lite';

const COLLECTION_NAME = 'essays';

function withId(id: string, data: Record<string, unknown>): EssayEntry {
  return {
    id,
    userId: data.userId ? String(data.userId) : 'demo-user',
    companyId: data.companyId ? String(data.companyId) : undefined,
    category: (data.category as EssayEntry['category']) ?? 'other',
    question: String(data.question ?? ''),
    answerLong: String(data.answerLong ?? ''),
    answer400: data.answer400 ? String(data.answer400) : undefined,
    answer300: data.answer300 ? String(data.answer300) : undefined,
    answer200: data.answer200 ? String(data.answer200) : undefined,
    answer100: data.answer100 ? String(data.answer100) : undefined,
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    createdAt: String(data.createdAt ?? new Date().toISOString()),
    updatedAt: String(data.updatedAt ?? new Date().toISOString()),
  };
}

export async function readEssaysFromFirestore(filters?: { companyId?: string }): Promise<EssayEntry[]> {
  const db = getFirestoreDb();
  const ref = collection(db, COLLECTION_NAME);

  const q = filters?.companyId
    ? query(ref, where('companyId', '==', filters.companyId), orderBy('updatedAt', 'desc'))
    : query(ref, orderBy('updatedAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((item) => withId(item.id, item.data()));
}

export async function readEssayFromFirestore(id: string): Promise<EssayEntry | undefined> {
  const db = getFirestoreDb();
  const snapshot = await getDoc(doc(db, COLLECTION_NAME, id));
  if (!snapshot.exists()) return undefined;
  return withId(snapshot.id, snapshot.data());
}

export async function createEssayInFirestore(input: Omit<EssayEntry, 'id' | 'createdAt' | 'updatedAt'>) {
  const db = getFirestoreDb();
  const now = new Date().toISOString();
  const payload = {
    ...input,
    createdAt: now,
    updatedAt: now,
  };
  const created = await addDoc(collection(db, COLLECTION_NAME), payload);
  return withId(created.id, payload as unknown as Record<string, unknown>);
}

export async function updateEssayInFirestore(id: string, patch: Partial<EssayEntry>) {
  const current = await readEssayFromFirestore(id);
  if (!current) return undefined;

  const next: EssayEntry = {
    ...current,
    ...patch,
    tags: patch.tags ?? current.tags,
    updatedAt: new Date().toISOString(),
  };

  const db = getFirestoreDb();
  await setDoc(doc(db, COLLECTION_NAME, id), next, { merge: true });
  return next;
}

export async function deleteEssayInFirestore(id: string) {
  const existing = await readEssayFromFirestore(id);
  if (!existing) return false;
  const db = getFirestoreDb();
  await deleteDoc(doc(db, COLLECTION_NAME, id));
  return true;
}
