import type { EssayEntry } from '../types/index-v2';

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[\s\u3000]+/g, ' ')
    .replace(/[、。・,.;:!?（）()「」『』]/g, '')
    .trim();
}

function scoreQuestion(question: string, essay: EssayEntry): number {
  const q = normalize(question);
  const base = normalize(essay.question);
  let score = 0;

  if (!q || !base) return score;
  if (q === base) score += 100;
  if (q.includes(base) || base.includes(q)) score += 40;

  const keywords = ['学生時代', '自己pr', '志望動機', '強み', '弱み', '困難', '挑戦', 'チーム', 'リーダー'];
  for (const kw of keywords) {
    if (q.includes(kw) && base.includes(kw)) score += 10;
  }

  for (const tag of essay.tags) {
    const t = normalize(tag);
    if (t && q.includes(t)) score += 5;
  }

  return score;
}

export function findTopEssayMatches(question: string, essays: EssayEntry[], limit = 3): EssayEntry[] {
  return essays
    .map((essay) => ({ essay, score: scoreQuestion(question, essay) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.essay);
}
