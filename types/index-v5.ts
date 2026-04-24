export type CompanyStage = 'interest' | 'applied' | 'es' | 'test' | 'interview' | 'offer' | 'rejected';
export type EventType = '説明会' | 'ES締切' | '適性検査' | '面接' | '最終面接' | 'その他';
export type EssayCategory = 'gakuchika' | 'self_pr' | 'motivation' | 'strengths' | 'other';

export interface CompanyPortal {
  portalUrl?: string;
  recruitingUrl?: string;
  loginId?: string;
  loginIdLabel?: string;
  loginMemo?: string;
  passwordStored?: boolean;
  lastCheckedAt?: string;
  nextCheckAt?: string;
}

export interface Company {
  id: string;
  userId?: string;
  name: string;
  industry?: string;
  website?: string;
  jobType?: string;
  location?: string;
  salary?: string;
  deadline?: string;
  description?: string;
  selectionFlow?: string[];
  testType?: string;
  stage: CompanyStage;
  memo?: string;
  portal?: CompanyPortal;
  createdAt: string;
  updatedAt?: string;
}

export interface JobEvent {
  id: string;
  userId?: string;
  companyId?: string;
  title: string;
  type: EventType;
  startAt: string;
  endAt?: string;
  note?: string;
  reminderMinutes?: number[];
}

export interface JobTask {
  id: string;
  userId?: string;
  companyId?: string;
  title: string;
  dueAt?: string;
  done: boolean;
}

export interface EssayEntry {
  id: string;
  userId?: string;
  companyId?: string;
  category: EssayCategory;
  question: string;
  answerLong: string;
  answer400?: string;
  answer300?: string;
  answer200?: string;
  answer100?: string;
  tags: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface PromptMatchLog {
  id: string;
  userId?: string;
  pageUrl: string;
  detectedQuestion: string;
  suggestedEssayIds: string[];
  selectedEssayId?: string;
  insertedAt?: string;
  createdAt: string;
}
