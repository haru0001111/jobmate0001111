import { getFirestoreDb } from '@/lib/server/firestore-admin-lite';
import type { JobEvent } from '@/types';

const COLLECTION = 'events';

export async function readEventsFromFirestore(filters?: { companyId?: string; onlyUpcoming?: boolean }): Promise<JobEvent[]> {
  const db: any = getFirestoreDb();
  let query: any = db.collection(COLLECTION);

  if (filters?.companyId) {
    query = query.where('companyId', '==', filters.companyId);
  }

  const snapshot = await query.get();
  let items = snapshot.docs.map((doc: any) => ({
    id: doc.id,
    ...(doc.data() as Omit<JobEvent, 'id'>),
  }));

  if (filters?.onlyUpcoming) {
    const now = Date.now();
    items = items.filter((item: any) => new Date(item.startAt).getTime() >= now);
  }

  return items.sort((a: any, b: any) => a.startAt.localeCompare(b.startAt));
}

export async function readEventFromFirestore(id: string): Promise<JobEvent | undefined> {
  const db: any = getFirestoreDb(); // ← 修正
  const doc = await db.collection(COLLECTION).doc(id).get();
  if (!doc.exists) return undefined;
  return { id: doc.id, ...(doc.data() as Omit<JobEvent, 'id'>) };
}

export async function createEventInFirestore(input: Omit<JobEvent, 'id'>): Promise<JobEvent> {
  const db: any = getFirestoreDb(); // ← 修正
  const ref = db.collection(COLLECTION).doc();
  await ref.set(input);
  return { id: ref.id, ...input };
}

export async function updateEventInFirestore(id: string, patch: Partial<JobEvent>): Promise<JobEvent | undefined> {
  const db: any = getFirestoreDb();
  const ref = db.collection(COLLECTION).doc(id);
  const existing = await ref.get();
  if (!existing.exists) return undefined;
  await ref.set(patch, { merge: true });
  const next = await ref.get();
  return { id: next.id, ...(next.data() as Omit<JobEvent, 'id'>) };
}

export async function deleteEventInFirestore(id: string) {
  const db: any = getFirestoreDb(); // ← 修正
  const ref = db.collection(COLLECTION).doc(id);
  const existing = await ref.get();
  if (!existing.exists) return false;
  await ref.delete();
  return true;
}