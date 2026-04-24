import { NextRequest, NextResponse } from 'next/server';
import { createEssay, getEssays } from '@/lib/server/essay-service';
import type { EssayEntry } from '@/types';
import { requireRequestUser } from '@/lib/server/auth/require-user';

export async function GET(request: NextRequest) {
  try {
    const user = await requireRequestUser(request);
    const companyId = request.nextUrl.searchParams.get('companyId') ?? undefined;
    const items = await getEssays({ companyId }, user.id);
    return NextResponse.json({ items, auth: user.source });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireRequestUser(request);
    const body = (await request.json()) as Partial<EssayEntry>;

    if (!body.question || !body.answerLong || !body.category) {
      return NextResponse.json({ error: 'question, answerLong, category は必須です' }, { status: 400 });
    }

    const item = await createEssay({
      userId: body.userId,
      companyId: body.companyId,
      category: body.category,
      question: body.question,
      answerLong: body.answerLong,
      answer400: body.answer400,
      answer300: body.answer300,
      answer200: body.answer200,
      answer100: body.answer100,
      tags: Array.isArray(body.tags) ? body.tags : [],
    }, user.id);

    return NextResponse.json({ message: 'ESを保存しました', item, auth: user.source }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
