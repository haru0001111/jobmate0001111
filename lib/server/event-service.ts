import type { JobEvent } from '@/types';
import {
  createEventInStore,
  deleteEventInStore,
  readEventFromStore,
  readEventsFromStore,
  updateEventInStore,
} from './event-store';
import {
  createEventInFirestore,
  deleteEventInFirestore,
  readEventFromFirestore,
  readEventsFromFirestore,
  updateEventInFirestore,
} from './firestore/event-firestore';
import { getDataProviderMode } from './provider';
import { getCurrentUser } from '@/lib/auth/current-user';

export async function getEvents(filters?: { companyId?: string; onlyUpcoming?: boolean }, userId?: string): Promise<JobEvent[]> {
  const user = userId ? { id: userId } : await getCurrentUser();
  if (getDataProviderMode() === 'firestore') {
    try {
      return (await readEventsFromFirestore(filters)).filter((item) => !item.userId || item.userId === user.id);
    } catch {
      const items = (await readEventsFromStore()).map((item) => ({ ...item, userId: item.userId ?? user.id }));
      return applyEventFilters(items, filters);
    }
  }

  const items = (await readEventsFromStore()).map((item) => ({ ...item, userId: item.userId ?? user.id }));
  return applyEventFilters(items, filters);
}

export async function getEvent(id: string, userId?: string): Promise<JobEvent | undefined> {
  const user = userId ? { id: userId } : await getCurrentUser();
  if (getDataProviderMode() === 'firestore') {
    try {
      const item = await readEventFromFirestore(id);
      return item && (!item.userId || item.userId === user.id) ? item : undefined;
    } catch {
      return readEventFromStore(id);
    }
  }
  return readEventFromStore(id);
}

export async function createEvent(input: Omit<JobEvent, 'id'>, userId?: string) {
  const user = userId ? { id: userId } : await getCurrentUser();
  if (getDataProviderMode() === 'firestore') {
    try {
      return await createEventInFirestore({ ...input, userId: user.id });
    } catch {
      return createEventInStore({ ...input, userId: user.id });
    }
  }
  return createEventInStore({ ...input, userId: user.id });
}

export async function updateEvent(id: string, patch: Partial<JobEvent>, userId?: string) {
  const user = userId ? { id: userId } : await getCurrentUser();
  if (getDataProviderMode() === 'firestore') {
    try {
      return await updateEventInFirestore(id, { ...patch, userId: user.id });
    } catch {
      return updateEventInStore(id, { ...patch, userId: user.id });
    }
  }
  return updateEventInStore(id, { ...patch, userId: user.id });
}

export async function deleteEvent(id: string, _userId?: string) {
  if (getDataProviderMode() === 'firestore') {
    try {
      return await deleteEventInFirestore(id);
    } catch {
      return deleteEventInStore(id);
    }
  }
  return deleteEventInStore(id);
}

function applyEventFilters(items: JobEvent[], filters?: { companyId?: string; onlyUpcoming?: boolean }) {
  let next = items;
  if (filters?.companyId) {
    next = next.filter((item) => item.companyId === filters.companyId);
  }
  if (filters?.onlyUpcoming) {
    const now = Date.now();
    next = next.filter((item) => new Date(item.startAt).getTime() >= now);
  }
  return next.sort((a, b) => a.startAt.localeCompare(b.startAt));
}
