import type { Company, JobEvent, JobTask } from '@/types';

const now = new Date().toISOString();

export const companies: Company[] = [
  {
    id: 'c1',
    name: 'OpenAI Japan',
    industry: 'AI / SaaS',
    website: 'https://example.com/openai-japan',
    jobType: 'ソフトウェアエンジニア',
    location: '東京',
    salary: '年俸制・経験に応じて決定',
    deadline: '2026-04-30T23:59:00+09:00',
    description: '生成AIプロダクトの企画・開発。英語でのコミュニケーションあり。',
    selectionFlow: ['エントリー', 'ES提出', '適性検査', '一次面接', '最終面接'],
    testType: 'SPI',
    stage: 'interview',
    memo: 'AI系、志望度高',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'c2',
    name: 'Sample Consulting',
    industry: 'コンサルティング',
    website: 'https://example.com/sample-consulting',
    jobType: 'ビジネスコンサルタント',
    location: '東京 / 大阪',
    salary: '月給 32万円〜',
    deadline: '2026-04-27T23:59:00+09:00',
    description: '戦略・業務改革案件を担当。ケース面接あり。',
    selectionFlow: ['エントリー', 'ES提出', 'Webテスト', 'ケース面接', '最終面接'],
    testType: 'TG-WEB',
    stage: 'es',
    memo: 'ES再利用候補',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'c3',
    name: 'Future Retail',
    industry: '小売 / EC',
    website: 'https://example.com/future-retail',
    jobType: 'プロダクト企画',
    location: '東京',
    salary: '月給 28万円〜',
    deadline: '2026-05-03T23:59:00+09:00',
    description: 'OMO戦略・EC改善に関わるポジション。',
    selectionFlow: ['エントリー', 'ES提出', '適性検査', '一次面接', '二次面接', '最終面接'],
    testType: '玉手箱',
    stage: 'test',
    memo: '適性検査あり',
    createdAt: now,
    updatedAt: now,
  },
];

export const events: JobEvent[] = [
  { id: 'e1', companyId: 'c1', title: '一次面接', type: '面接', startAt: '2026-04-25T14:00:00+09:00', note: '志望動機と研究内容', reminderMinutes: [1440, 60] },
  { id: 'e2', companyId: 'c2', title: 'ES締切', type: 'ES締切', startAt: '2026-04-27T23:59:00+09:00', note: 'ガクチカ見直し', reminderMinutes: [1440, 120] },
  { id: 'e3', companyId: 'c3', title: 'Web適性検査', type: '適性検査', startAt: '2026-04-29T20:00:00+09:00', note: '受験URL確認', reminderMinutes: [1440, 30] },
  { id: 'e4', companyId: 'c1', title: '最終面接候補日', type: '最終面接', startAt: '2026-05-02T10:00:00+09:00', note: '役員面接を想定', reminderMinutes: [1440] },
];

export const tasks: JobTask[] = [
  { id: 't1', companyId: 'c2', title: '自己PRを300字版に直す', dueAt: '2026-04-24T18:00:00+09:00', done: false },
  { id: 't2', companyId: 'c1', title: 'OpenAI Japanの逆質問を3つ用意', dueAt: '2026-04-24T21:00:00+09:00', done: false },
  { id: 't3', companyId: 'c3', title: '証明写真データ確認', dueAt: '2026-04-26T12:00:00+09:00', done: true },
  { id: 't4', companyId: 'c1', title: '最終面接向けに事業理解メモを更新', dueAt: '2026-04-30T20:00:00+09:00', done: false },
];
