import { auth } from '@/lib/firebase';

export async function getAuthHeaders(init?: HeadersInit): Promise<HeadersInit> {
  const headers = new Headers(init);
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    headers.set('Authorization', `Bearer ${token}`);
  }
  return headers;
}
