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

export async function getProgressMap(
  userId: string,
  lesson: number
): Promise<Record<string, LearnStatus>> {
  // Lazy import to avoid adding unused bundle until needed
  const { collection, getDocs } = await import('firebase/firestore');
  const colRef = collection(db, 'users', userId, 'progress');
  const snapshot = await getDocs(colRef);
  const map: Record<string, LearnStatus> = {};
  snapshot.forEach((d) => {
    const data = d.data() as Partial<ProgressRecord>;
    if (data.lesson === lesson && typeof data.vocabKey === 'string' && (data.status === 'known' || data.status === 'unknown')) {
      map[data.vocabKey] = data.status;
    }
  });
  return map;
}


