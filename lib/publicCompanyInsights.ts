import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

type PublicCompanyInsight = {
  id: string;
  companyName: string;
  salary?: string;
  holidays?: string;
  location?: string;
  benefits?: string;
  workStyle?: string;
  testType?: string;
  difficulty?: string;
  createdAt: number;
};

export async function savePublicCompanyInsight(input: {
  companyName: string;
  salary?: string;
  holidays?: string;
  location?: string;
  benefits?: string;
  workStyle?: string;
  testType?: string;
  difficulty?: string;
}) {
  if (!input.companyName.trim()) return;

  const insight: PublicCompanyInsight = {
    id: `insight-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    companyName: input.companyName.trim(),
    salary: input.salary || '',
    holidays: input.holidays || '',
    location: input.location || '',
    benefits: input.benefits || '',
    workStyle: input.workStyle || '',
    testType: input.testType || '',
    difficulty: input.difficulty || '',
    createdAt: Date.now(),
  };

  await setDoc(
    doc(collection(db, 'publicCompanyInsights'), insight.id),
    insight
  );
}