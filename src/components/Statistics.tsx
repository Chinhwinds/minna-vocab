import React from 'react';
import { getAllLessons, getTotalVocabularyCount, getVocabularyCountByLesson } from '../data/vocabulary';
import { BookOpen, Sigma, NotebookText, ListChecks } from 'lucide-react';

interface StatisticsProps {
  currentLesson: number | null;
  totalKnown?: number;
  totalUnknown?: number;
  lessonKnown?: number;
  lessonUnknown?: number;
  onViewLessonList?: (lesson: number, type: 'known' | 'unknown') => void;
}

const Statistics: React.FC<StatisticsProps> = ({ currentLesson, totalKnown, totalUnknown, lessonKnown, lessonUnknown, onViewLessonList }) => {
  const totalLessons = getAllLessons().length;
  const totalVocabulary = getTotalVocabularyCount();
  const currentLessonCount = currentLesson ? getVocabularyCountByLesson(currentLesson) : 0;

  return (
    <div className="border border-border rounded-md p-4 bg-card mt-4">
      <h3 className="m-0 text-text font-semibold mb-3 flex items-center gap-2">
        <Sigma size={18} /> Thống Kê
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
        <div className="rounded-md p-3 bg-surface border border-border flex items-center gap-3">
          <div className="text-text"><NotebookText /></div>
          <div>
            <div className="text-lg font-bold text-text leading-none">{totalLessons}</div>
            <div className="text-xs text-muted leading-none">Tổng số bài học</div>
          </div>
        </div>
        <div className="rounded-md p-3 bg-surface border border-border flex items-center gap-3">
          <div className="text-text"><BookOpen /></div>
          <div>
            <div className="text-lg font-bold text-text leading-none">{totalVocabulary}</div>
            <div className="text-xs text-muted leading-none">Tổng từ vựng</div>
          </div>
        </div>
        <div className="rounded-md p-3 bg-surface border border-border">
          <div className="text-xs text-muted">Toàn bộ</div>
          <div className="mt-1 text-sm text-text">Thuộc: <span className="font-semibold">{totalKnown ?? '-'}</span></div>
          <div className="text-sm text-text">Chưa thuộc: <span className="font-semibold">{totalUnknown ?? '-'}</span></div>
        </div>
        {currentLesson && (
          <div className="rounded-md p-3 bg-gray-900 text-white border border-gray-900 flex items-center gap-3">
            <div><BookOpen /></div>
            <div>
              <div className="text-lg font-bold leading-none">{currentLessonCount}</div>
              <div className="text-xs leading-none">Từ vựng bài {currentLesson}</div>
            </div>
          </div>
        )}
      </div>
      {currentLesson && (
        <div className="flex items-center justify-between mt-2">
          <div className="text-xs text-muted m-0">Bài {currentLesson}: {currentLessonCount}/{totalVocabulary} từ vựng</div>
          <div className="inline-flex items-center gap-2">
            <button
              className="text-xs inline-flex items-center gap-1 border border-border rounded px-2 py-1 bg-card text-text hover:bg-gray-50"
              onClick={() => onViewLessonList && onViewLessonList(currentLesson, 'unknown')}
            >
              <ListChecks size={12} /> Chưa thuộc ({lessonUnknown ?? '-'})
            </button>
            <button
              className="text-xs inline-flex items-center gap-1 border border-border rounded px-2 py-1 bg-card text-text hover:bg-gray-50"
              onClick={() => onViewLessonList && onViewLessonList(currentLesson, 'known')}
            >
              <ListChecks size={12} /> Thuộc ({lessonKnown ?? '-'})
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Statistics;
