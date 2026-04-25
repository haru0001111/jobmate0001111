import { NextResponse } from 'next/server';

// HTMLから余計なタグを削除
function stripHtml(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .slice(0, 15000); // 長すぎ防止
}

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'URLが必要です' }, { status: 400 });
    }

    // 🔽 採用ページを取得
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 JobMateBot',
      },
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'ページ取得に失敗' }, { status: 400 });
    }

    const html = await res.text();
    const text = stripHtml(html);

    // 🔽 OpenAIに送る
    const aiRes = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-5.5',
        input: `
以下は企業の採用ページの内容です。
募集要項と選考フローを日本語で整理してください。

必ずJSON形式で返してください：

{
  "jobDescription": "箇条書きでまとめる",
  "selectionFlow": "選考の流れ"
}

本文:
${text}
        `,
      }),
    });

    const data = await aiRes.json();

    // レスポンス取り出し（安全対応）
    const output =
      data.output_text ||
      data.output?.flatMap((o: any) => o.content || [])
        ?.map((c: any) => c.text || '')
        ?.join('') ||
      '';

    // ```json 제거
    const cleaned = output.replace(/```json|```/g, '').trim();

    const parsed = JSON.parse(cleaned);

    return NextResponse.json(parsed);
  } catch (e) {
    return NextResponse.json(
      { error: '自動抽出に失敗しました' },
      { status: 500 }
    );
  }
}