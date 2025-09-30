import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAllProgressByLesson } from '../services/progress';
import { getAllLessons, getVocabularyByLesson, getVocabularyCountByLesson } from '../data/vocabulary';
import { Home } from 'lucide-react';

interface ProgressListProps {
  lesson: number;
  onBack?: () => void;
  onJumpTo?: (lesson: number, vocab: string) => void;
}

const ProgressList: React.FC<ProgressListProps> = ({ lesson, onBack, onJumpTo }) => {
  const { user } = useAuth();
  const [known, setKnown] = useState<string[]>([]);
  const [unknown, setUnknown] = useState<string[]>([]);
  const [tab, setTab] = useState<'known' | 'unknown'>('unknown');
  const [overview, setOverview] = useState<{ lesson: number; known: number; unknown: number; total: number }[]>([]);
  const [viewingLesson, setViewingLesson] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!user) return;
      const byLesson = await getAllProgressByLesson(user.uid);
      // Build overview
      const lessons = getAllLessons();
      const ov = lessons.map((ls) => {
        const vocab = getVocabularyByLesson(ls).map(v => v.vocabulary);
        const lists = byLesson[ls] || { known: new Set<string>(), unknown: new Set<string>() };
        const implicitUnknown = vocab.filter(v => !lists.known.has(v) && !lists.unknown.has(v));
        return {
          lesson: ls,
          known: lists.known.size,
          unknown: lists.unknown.size + implicitUnknown.length,
          total: getVocabularyCountByLesson(ls)
        };
      });
      if (!cancelled) setOverview(ov);
      if (cancelled) return;
      const current = lesson;
      const vocab = getVocabularyByLesson(current).map(v => v.vocabulary);
      const lists = byLesson[current] || { known: new Set<string>(), unknown: new Set<string>() };
      const unknownList = vocab.filter(v => !lists.known.has(v) && !lists.unknown.has(v));
      setKnown(Array.from(lists.known));
      setUnknown([...Array.from(lists.unknown), ...unknownList]);
      setViewingLesson(null); // start with overview view
    })();
    return () => { cancelled = true; };
  }, [user, lesson]);

  const current = tab === 'known' ? known : unknown;

  return (
    <div className="max-w-3xl mx-auto p-5">
      <div className="mb-3">
        <button
          onClick={() => onBack && onBack()}
          className="inline-flex items-center gap-2 bg-gray-200 text-text border border-border px-3 py-2 rounded-md hover:bg-gray-300"
        >
          <Home size={16} /> Trang chủ
        </button>
      </div>
      {viewingLesson === null ? (
        <>
          <h2 className="m-0 text-lg">Tiến độ theo bài</h2>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {overview.map((ov) => (
              <button
                key={ov.lesson}
                className="text-left border rounded-md p-3 transition bg-card text-text border-border hover:bg-gray-50 hover:shadow-sm cursor-pointer active:scale-[0.98]"
                onClick={() => setViewingLesson(ov.lesson)}
              >
                <div className="text-sm font-semibold">Bài {ov.lesson}</div>
                <div className="text-xs text-muted">Tổng: {ov.total}</div>
                <div className="text-xs mt-1">Thuộc: <span className="font-semibold">{ov.known}</span></div>
                <div className="text-xs">Chưa thuộc: <span className="font-semibold">{ov.unknown}</span></div>
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <h2 className="m-0 text-lg">Bài {viewingLesson}</h2>
            <button
              className="text-xs border border-border rounded px-2 py-1 bg-card text-text hover:bg-gray-50"
              onClick={() => setViewingLesson(null)}
            >Quay lại danh sách bài</button>
          </div>
          <div className="mt-3 inline-flex items-center gap-2">
            <button className={`px-3 py-1 border rounded ${tab==='unknown'?'bg-gray-900 text-white':'bg-card text-text border-border'}`} onClick={()=>setTab('unknown')}>Chưa thuộc ({unknown.length})</button>
            <button className={`px-3 py-1 border rounded ${tab==='known'?'bg-gray-900 text-white':'bg-card text-text border-border'}`} onClick={()=>setTab('known')}>Thuộc ({known.length})</button>
          </div>
          <ul className="mt-4 m-0 p-0 list-none grid grid-cols-1 sm:grid-cols-2 gap-2">
            {current.map((v)=> (
              <li
                key={v}
                className="border border-border rounded px-3 py-2 bg-card text-text text-sm cursor-pointer hover:bg-gray-50 active:scale-[0.99]"
                onClick={() => onJumpTo && onJumpTo(viewingLesson, v)}
              >
                {v}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default ProgressList;


