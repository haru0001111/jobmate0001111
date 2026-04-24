import type { JobTask } from '@/types';
import {
  createTaskInStore,
  deleteTaskInStore,
  readTaskFromStore,
  readTasksFromStore,
  updateTaskInStore,
} from './task-store';
import {
  createTaskInFirestore,
  deleteTaskInFirestore,
  readTaskFromFirestore,
  readTasksFromFirestore,
  updateTaskInFirestore,
} from './firestore/task-firestore';
import { getDataProviderMode } from './provider';
import { getCurrentUser } from '@/lib/auth/current-user';

export async function getTasks(filters?: { companyId?: string; onlyOpen?: boolean }, userId?: string): Promise<JobTask[]> {
  const user = userId ? { id: userId } : await getCurrentUser();
  if (getDataProviderMode() === 'firestore') {
    try {
      return (await readTasksFromFirestore(filters)).filter((item) => !item.userId || item.userId === user.id);
    } catch {
      const items = (await readTasksFromStore()).map((item) => ({ ...item, userId: item.userId ?? user.id }));
      return applyTaskFilters(items, filters);
    }
  }

  const items = (await readTasksFromStore()).map((item) => ({ ...item, userId: item.userId ?? user.id }));
  return applyTaskFilters(items, filters);
}

export async function getTask(id: string, userId?: string): Promise<JobTask | undefined> {
  const user = userId ? { id: userId } : await getCurrentUser();
  if (getDataProviderMode() === 'firestore') {
    try {
      const item = await readTaskFromFirestore(id);
      return item && (!item.userId || item.userId === user.id) ? item : undefined;
    } catch {
      return readTaskFromStore(id);
    }
  }
  return readTaskFromStore(id);
}

export async function createTask(input: Omit<JobTask, 'id'>, userId?: string) {
  const user = userId ? { id: userId } : await getCurrentUser();
  if (getDataProviderMode() === 'firestore') {
    try {
      return await createTaskInFirestore({ ...input, userId: user.id });
    } catch {
      return createTaskInStore({ ...input, userId: user.id });
    }
  }
  return createTaskInStore({ ...input, userId: user.id });
}

export async function updateTask(id: string, patch: Partial<JobTask>, userId?: string) {
  const user = userId ? { id: userId } : await getCurrentUser();
  if (getDataProviderMode() === 'firestore') {
    try {
      return await updateTaskInFirestore(id, { ...patch, userId: user.id });
    } catch {
      return updateTaskInStore(id, { ...patch, userId: user.id });
    }
  }
  return updateTaskInStore(id, { ...patch, userId: user.id });
}

export async function deleteTask(id: string, _userId?: string) {
  if (getDataProviderMode() === 'firestore') {
    try {
      return await deleteTaskInFirestore(id);
    } catch {
      return deleteTaskInStore(id);
    }
  }
  return deleteTaskInStore(id);
}

function applyTaskFilters(items: JobTask[], filters?: { companyId?: string; onlyOpen?: boolean }) {
  let next = items;
  if (filters?.companyId) {
    next = next.filter((item) => item.companyId === filters.companyId);
  }
  if (filters?.onlyOpen) {
    next = next.filter((item) => !item.done);
  }
  return next.sort((a, b) => (a.dueAt ?? '').localeCompare(b.dueAt ?? ''));
}
