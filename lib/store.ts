import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
} from 'firebase/firestore';
import { db } from './firebase';

const DEMO_USER_ID = 'demo-user';

function resolveArgs<T>(
  userIdOrInitial: string | T[],
  initialMaybe?: T[]
): { userId: string; initial: T[] } {
  if (typeof userIdOrInitial === 'string') {
    return {
      userId: userIdOrInitial,
      initial: initialMaybe ?? [],
    };
  }

  return {
    userId: DEMO_USER_ID,
    initial: userIdOrInitial ?? [],
  };
}

export async function loadItems<T>(
  key: string,
  userIdOrInitial: string | T[],
  initialMaybe?: T[]
): Promise<T[]> {
  const { userId, initial } = resolveArgs(userIdOrInitial, initialMaybe);

  const snap = await getDocs(collection(db, 'users', userId, key));
  const data = snap.docs.map((d) => d.data() as T);

  if (data.length === 0) {
    for (const item of initial as any[]) {
      await setDoc(doc(db, 'users', userId, key, item.id), item);
    }
    return initial;
  }

  return data;
}

export async function saveItem<T extends { id: string }>(
  key: string,
  userIdOrItem: string | T,
  itemOrCurrent?: T | T[],
  currentMaybe?: T[]
): Promise<T[]> {
  let userId = DEMO_USER_ID;
  let item: T;
  let current: T[] = [];

  if (typeof userIdOrItem === 'string') {
    userId = userIdOrItem;
    item = itemOrCurrent as T;
    current = currentMaybe ?? [];
  } else {
    item = userIdOrItem;
    current = (itemOrCurrent as T[]) ?? [];
  }

  await setDoc(doc(db, 'users', userId, key, item.id), item);
  return loadItems<T>(key, userId, current);
}

export async function removeItem<T extends { id: string }>(
  key: string,
  userIdOrId: string,
  idOrCurrent?: string | T[],
  currentMaybe?: T[]
): Promise<T[]> {
  let userId = DEMO_USER_ID;
  let id: string;
  let current: T[] = [];

  if (typeof idOrCurrent === 'string') {
    userId = userIdOrId;
    id = idOrCurrent;
    current = currentMaybe ?? [];
  } else {
    id = userIdOrId;
    current = idOrCurrent ?? [];
  }

  await deleteDoc(doc(db, 'users', userId, key, id));
  return loadItems<T>(key, userId, current);
}

export function getSaveMode() {
  return 'Firebase（ユーザー別）';
}