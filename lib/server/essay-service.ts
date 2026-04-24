import type { EssayEntry } from '@/types';
import {
  createEssayInStore,
  deleteEssayInStore,
  readEssayFromStore,
  readEssaysFromStore,
  updateEssayInStore,
} from './essay-store';
import { createEssayInFirestore, deleteEssayInFirestore, readEssayFromFirestore, readEssaysFromFirestore, updateEssayInFirestore } from './firestore/essay-firestore';
import { getDataProviderMode } from './provider';
import { getCurrentUser } from '@/lib/auth/current-user';

export async function getEssays(filters?: { companyId?: string }, userId?: string): Promise<EssayEntry[]> {
  const user = userId ? { id: userId } : await getCurrentUser();
  if (getDataProviderMode() === 'firestore') {
    try {
      return (await readEssaysFromFirestore(filters)).filter((item) => !item.userId || item.userId === user.id);
    } catch {
      const items = (await readEssaysFromStore()).map((item) => ({ ...item, userId: item.userId ?? user.id }));
      return filters?.companyId ? items.filter((item) => item.companyId === filters.companyId) : items;
    }
  }

  const items = (await readEssaysFromStore()).map((item) => ({ ...item, userId: item.userId ?? user.id }));
  if (filters?.companyId) {
    return items.filter((item) => item.companyId === filters.companyId);
  }
  return items;
}

export async function getEssay(id: string, userId?: string): Promise<EssayEntry | undefined> {
  const user = userId ? { id: userId } : await getCurrentUser();
  if (getDataProviderMode() === 'firestore') {
    try {
      const item = await readEssayFromFirestore(id);
      return item && (!item.userId || item.userId === user.id) ? item : undefined;
    } catch {
      return readEssayFromStore(id);
    }
  }
  return readEssayFromStore(id);
}

export async function createEssay(input: Omit<EssayEntry, 'id' | 'createdAt' | 'updatedAt'>, userId?: string) {
  const user = userId ? { id: userId } : await getCurrentUser();
  if (getDataProviderMode() === 'firestore') {
    try {
      return await createEssayInFirestore({ ...input, userId: user.id });
    } catch {
      return createEssayInStore({ ...input, userId: user.id });
    }
  }
  return createEssayInStore({ ...input, userId: user.id });
}

export async function updateEssay(id: string, patch: Partial<EssayEntry>, userId?: string) {
  const user = userId ? { id: userId } : await getCurrentUser();
  if (getDataProviderMode() === 'firestore') {
    try {
      return await updateEssayInFirestore(id, { ...patch, userId: user.id });
    } catch {
      return updateEssayInStore(id, { ...patch, userId: user.id });
    }
  }
  return updateEssayInStore(id, { ...patch, userId: user.id });
}

export async function deleteEssay(id: string, _userId?: string) {
  if (getDataProviderMode() === 'firestore') {
    try {
      return await deleteEssayInFirestore(id);
    } catch {
      return deleteEssayInStore(id);
    }
  }
  return deleteEssayInStore(id);
}
