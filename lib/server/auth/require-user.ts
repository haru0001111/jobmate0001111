import type { NextRequest } from "next/server";
import { getFirebaseAdminAuth, isFirebaseAdminConfigured } from "./firebase-admin";

export type RequestUser = {
  id: string;
  email?: string;
  source: 'verified_token' | 'dev_fallback';
};

function readBearerToken(request: NextRequest) {
  const header = request.headers.get('authorization') || request.headers.get('Authorization');
  if (!header) return null;
  const [scheme, token] = header.split(' ');
  if (scheme?.toLowerCase() !== 'bearer' || !token) return null;
  return token;
}

export async function requireRequestUser(request: NextRequest): Promise<RequestUser> {
  const token = readBearerToken(request);

  if (token && isFirebaseAdminConfigured()) {
    const decoded = await getFirebaseAdminAuth().verifyIdToken(token);
    return {
      id: decoded.uid,
      email: decoded.email,
      source: 'verified_token',
    };
  }

  if (process.env.NODE_ENV !== 'production') {
    return { id: 'demo-user', source: 'dev_fallback' };
  }

  throw new Error('unauthorized');
}
