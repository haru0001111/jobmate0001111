import { NextRequest, NextResponse } from 'next/server';
import { getCompanies } from '@/lib/server/company-service';
import { requireRequestUser } from '@/lib/server/auth/require-user';

export async function GET(request: NextRequest) {
  try {
    const user = await requireRequestUser(request);
    const items = await getCompanies(user.id);
    return NextResponse.json({ items, auth: user.source });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
