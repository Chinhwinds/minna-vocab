import React from 'react';
import { getAllLessons, getTotalVocabularyCount, getVocabularyCountByLesson } from '../data/vocabulary';
import { BookOpen, Sigma, NotebookText } from 'lucide-react';

interface StatisticsProps {
  currentLesson: number | null;
}

const Statistics: React.FC<StatisticsProps> = ({ currentLesson }) => {
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
        <div>
          <div className="w-full h-2 bg-surface rounded-md overflow-hidden border border-border">
            <div 
              className="h-full bg-gray-900" 
              style={{ width: `${(currentLessonCount / totalVocabulary) * 100}%` }}
            />
          </div>
          <p className="text-xs text-muted mt-2 m-0">Bài {currentLesson}: {currentLessonCount}/{totalVocabulary} từ vựng</p>
        </div>
      )}
    </div>
  );
};

export default Statistics;
