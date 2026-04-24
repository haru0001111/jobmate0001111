import { NextRequest, NextResponse } from 'next/server';
import { getCompany, updateCompany } from '@/lib/server/company-service';
import { requireRequestUser } from '@/lib/server/auth/require-user';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireRequestUser(request);
    const { id } = await params;
    const company = await getCompany(id, user.id);

    if (!company) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ item: company, auth: user.source });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireRequestUser(request);
    const { id } = await params;
    const body = await request.json();
    const company = await updateCompany(id, body, user.id);

    if (!company) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: '保存しました。認証済み userId ベースで保存します。',
      item: company,
      auth: user.source,
    });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
