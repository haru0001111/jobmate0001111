import { NextRequest, NextResponse } from 'next/server';
import type { JobEvent } from '@/types';
import { requireRequestUser } from '@/lib/server/auth/require-user';
import { createEvent, getEvents } from '@/lib/server/event-service';

export async function GET(request: NextRequest) {
  try {
    const user = await requireRequestUser(request);
    const companyId = request.nextUrl.searchParams.get('companyId') ?? undefined;
    const onlyUpcoming = request.nextUrl.searchParams.get('onlyUpcoming') === 'true';
    const items = await getEvents({ companyId, onlyUpcoming }, user.id);
    return NextResponse.json({ items, auth: user.source });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireRequestUser(request);
    const body = (await request.json()) as Partial<JobEvent>;

    if (!body.title || !body.type || !body.startAt) {
      return NextResponse.json({ error: 'title, type, startAt は必須です' }, { status: 400 });
    }

    const item = await createEvent({
      userId: body.userId,
      companyId: body.companyId,
      title: body.title,
      type: body.type,
      startAt: body.startAt,
      endAt: body.endAt,
      note: body.note,
      reminderMinutes: Array.isArray(body.reminderMinutes) ? body.reminderMinutes : [],
    }, user.id);

    return NextResponse.json({ message: '予定を保存しました', item, auth: user.source }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
