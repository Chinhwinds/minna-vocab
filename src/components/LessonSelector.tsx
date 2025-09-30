import React from 'react';
import { getAllLessons, getVocabularyCountByLesson } from '../data/vocabulary';
import { BookOpen } from 'lucide-react';

interface LessonSelectorProps {
  selectedLesson: number | null;
  onLessonSelect: (lesson: number) => void;
}

const LessonSelector: React.FC<LessonSelectorProps> = ({
  selectedLesson,
  onLessonSelect
}) => {
  const lessons = getAllLessons();

  return (
    <div>
      <h2 className="text-text text-xl font-semibold mb-4 flex items-center gap-2">
        <BookOpen size={18} /> Chọn Bài Học
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {lessons.map(lesson => {
          const count = getVocabularyCountByLesson(lesson);
          const isSelected = selectedLesson === lesson;
          
          return (
            <button
              key={lesson}
              className={`text-left border rounded-md p-3 transition cursor-pointer active:scale-[0.98] ${isSelected ? 'bg-gray-900 text-white border-gray-900' : 'bg-card text-text border-border hover:bg-gray-50 hover:shadow-sm'}`}
              onClick={() => onLessonSelect(lesson)}
            >
              <div className="text-sm font-semibold">Bài {lesson}</div>
              <div className="text-xs text-muted">{count} từ vựng</div>
            </button>
          );
        })}
      </div>
      
      {selectedLesson && (
        <div className="mt-4 border border-border rounded-md p-3 bg-card">
          <h3 className="m-0 text-text font-semibold text-sm">Bài {selectedLesson} - {getVocabularyCountByLesson(selectedLesson)} từ vựng</h3>
          <p className="text-xs text-muted m-0">Bắt đầu học từ vựng của bài này!</p>
        </div>
      )}
    </div>
  );
};

export default LessonSelector;
