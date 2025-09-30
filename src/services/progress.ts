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
      map[data.vocabKey] = data.status as LearnStatus;
    }
  });
  return map;
}

export interface LessonStats {
  known: number;
  unknown: number;
}

export interface LessonWordLists {
  known: Set<string>;
  unknown: Set<string>;
}

export async function getAllProgressByLesson(
  userId: string
): Promise<Record<number, LessonWordLists>> {
  const { collection, getDocs } = await import('firebase/firestore');
  const colRef = collection(db, 'users', userId, 'progress');
  const snapshot = await getDocs(colRef);
  const byLesson: Record<number, LessonWordLists> = {};
  snapshot.forEach((d) => {
    const data = d.data() as Partial<ProgressRecord>;
    if (typeof data.lesson !== 'number' || typeof data.vocabKey !== 'string') return;
    if (!byLesson[data.lesson]) byLesson[data.lesson] = { known: new Set<string>(), unknown: new Set<string>() };
    if (data.status === 'known') byLesson[data.lesson].known.add(data.vocabKey);
    else if (data.status === 'unknown') byLesson[data.lesson].unknown.add(data.vocabKey);
  });
  return byLesson;
}

export async function getLessonStatsMap(
  userId: string
): Promise<Record<number, LessonStats>> {
  const byLesson = await getAllProgressByLesson(userId);
  const result: Record<number, LessonStats> = {};
  Object.entries(byLesson).forEach(([lessonStr, lists]) => {
    const lesson = Number(lessonStr);
    result[lesson] = { known: lists.known.size, unknown: lists.unknown.size };
  });
  return result;
}


