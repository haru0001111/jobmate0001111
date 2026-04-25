import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
} from 'firebase/firestore';
import { db } from './firebase';

export async function loadItems<T>(
  key: string,
  userId: string,
  initial: T[] = []
): Promise<T[]> {
  if (!userId) {
    throw new Error('userId is required');
  }

  const snap = await getDocs(collection(db, 'users', userId, key));
  const data = snap.docs.map((d) => d.data() as T);

  if (data.length === 0 && initial.length > 0) {
    for (const item of initial as any[]) {
      await setDoc(doc(db, 'users', userId, key, item.id), item);
    }
    return initial;
  }

  return data;
}

export async function saveItem<T extends { id: string }>(
  key: string,
  userId: string,
  item: T
): Promise<T[]> {
  if (!userId) {
    throw new Error('userId is required');
  }

  await setDoc(doc(db, 'users', userId, key, item.id), item);
  return loadItems<T>(key, userId);
}

export async function removeItem<T extends { id: string }>(
  key: string,
  userId: string,
  id: string
): Promise<T[]> {
  if (!userId) {
    throw new Error('userId is required');
  }

  await deleteDoc(doc(db, 'users', userId, key, id));
  return loadItems<T>(key, userId);
}

export function getSaveMode() {
  return 'Firebase（ユーザー別）';
}