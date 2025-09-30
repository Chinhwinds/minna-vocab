import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

export type LearnStatus = 'known' | 'unknown';

export interface ProgressRecord {
  userId: string;
  lesson: number;
  vocabKey: string;
  status: LearnStatus;
  updatedAt: any;
}

export async function saveProgress(
  userId: string,
  lesson: number,
  vocabKey: string,
  status: LearnStatus
): Promise<void> {
  const id = `${lesson}__${encodeURIComponent(vocabKey)}`;
  const ref = doc(db, 'users', userId, 'progress', id);
  await setDoc(
    ref,
    {
      userId,
      lesson,
      vocabKey,
      status,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}


