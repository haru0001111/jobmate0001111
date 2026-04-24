import { NextRequest, NextResponse } from 'next/server';
import type { JobTask } from '@/types';
import { requireRequestUser } from '@/lib/server/auth/require-user';
import { createTask, getTasks } from '@/lib/server/task-service';

export async function GET(request: NextRequest) {
  try {
    const user = await requireRequestUser(request);
    const companyId = request.nextUrl.searchParams.get('companyId') ?? undefined;
    const onlyOpen = request.nextUrl.searchParams.get('onlyOpen') !== 'false';
    const items = await getTasks({ companyId, onlyOpen }, user.id);
    return NextResponse.json({ items, auth: user.source });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireRequestUser(request);
    const body = (await request.json()) as Partial<JobTask>;

    if (!body.title) {
      return NextResponse.json({ error: 'title は必須です' }, { status: 400 });
    }

    const item = await createTask({
      userId: body.userId,
      companyId: body.companyId,
      title: body.title,
      dueAt: body.dueAt,
      done: Boolean(body.done),
    }, user.id);

    return NextResponse.json({ message: 'タスクを保存しました', item, auth: user.source }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
