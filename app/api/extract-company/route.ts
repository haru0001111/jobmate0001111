import { NextResponse } from 'next/server';

function stripHtml(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .slice(0, 12000);
}

function extractJson(text: string) {
  const cleaned = text.replace(/```json|```/g, '').trim();
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('AIの返答がJSONではありません');
  return JSON.parse(cleaned.slice(start, end + 1));
}

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OPENAI_API_KEY が未設定です' }, { status: 500 });
    }

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'URLが必要です' }, { status: 400 });
    }

    const pageRes = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
    });

    if (!pageRes.ok) {
      return NextResponse.json(
        { error: `採用ページを取得できませんでした: ${pageRes.status}` },
        { status: 400 }
      );
    }

    const html = await pageRes.text();
    const text = stripHtml(html);

    if (text.length < 100) {
      return NextResponse.json(
        { error: 'ページ本文が短すぎます。ログイン必須ページかもしれません。' },
        { status: 400 }
      );
    }

    const aiRes = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-5.5',
        input: [
          {
            role: 'user',
            content: `
以下の採用ページ本文から、募集要項と選考フローを抽出してください。
必ずJSONのみで返してください。

{
  "jobDescription": "職種・勤務地・給与・応募条件・締切などを箇条書き",
  "selectionFlow": "選考フローを順番に箇条書き"
}

本文:
${text}
            `,
          },
        ],
      }),
    });

    const aiData = await aiRes.json();

    if (!aiRes.ok) {
      return NextResponse.json(
        { error: aiData.error?.message || `OpenAI APIエラー: ${aiRes.status}` },
        { status: 500 }
      );
    }

    const output =
      aiData.output_text ||
      aiData.output?.flatMap((o: any) => o.content || [])
        ?.map((c: any) => c.text || '')
        ?.join('') ||
      '';

    const parsed = extractJson(output);

    return NextResponse.json({
      jobDescription: parsed.jobDescription || '',
      selectionFlow: parsed.selectionFlow || '',
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : '不明なエラー';
    return NextResponse.json(
      { error: `自動抽出に失敗しました: ${message}` },
      { status: 500 }
    );
  }
}