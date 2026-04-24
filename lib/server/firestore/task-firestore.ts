import { getFirestoreDb } from '@/lib/server/firestore-admin-lite';
import type { JobTask } from '@/types';

const COLLECTION = 'tasks';

export async function readTasksFromFirestore(filters?: { companyId?: string; onlyOpen?: boolean }): Promise<JobTask[]> {
  const db = getFirestoreDb();
  let query: FirebaseFirestore.Query = db.collection(COLLECTION);

  if (filters?.companyId) {
    query = query.where('companyId', '==', filters.companyId);
  }

  const snapshot = await query.get();
  let items = snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Omit<JobTask, 'id'>) }));

  if (filters?.onlyOpen) {
    items = items.filter((item) => !item.done);
  }

  return items.sort((a, b) => (a.dueAt ?? '').localeCompare(b.dueAt ?? ''));
}

export async function readTaskFromFirestore(id: string): Promise<JobTask | undefined> {
  const db = getFirestoreDb();
  const doc = await db.collection(COLLECTION).doc(id).get();
  if (!doc.exists) return undefined;
  return { id: doc.id, ...(doc.data() as Omit<JobTask, 'id'>) };
}

export async function createTaskInFirestore(input: Omit<JobTask, 'id'>): Promise<JobTask> {
  const db = getFirestoreDb();
  const ref = db.collection(COLLECTION).doc();
  await ref.set(input);
  return { id: ref.id, ...input };
}

export async function updateTaskInFirestore(id: string, patch: Partial<JobTask>): Promise<JobTask | undefined> {
  const db = getFirestoreDb();
  const ref = db.collection(COLLECTION).doc(id);
  const existing = await ref.get();
  if (!existing.exists) return undefined;
  await ref.set(patch, { merge: true });
  const next = await ref.get();
  return { id: next.id, ...(next.data() as Omit<JobTask, 'id'>) };
}

export async function deleteTaskInFirestore(id: string) {
  const db = getFirestoreDb();
  const ref = db.collection(COLLECTION).doc(id);
  const existing = await ref.get();
  if (!existing.exists) return false;
  await ref.delete();
  return true;
}
