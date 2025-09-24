import React from 'react';
import { getAllLessons, getVocabularyCountByLesson } from '../data/vocabulary';
import './LessonSelector.css';

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
    <div className="lesson-selector">
      <h2>Chọn Bài Học</h2>
      <div className="lesson-grid">
        {lessons.map(lesson => {
          const count = getVocabularyCountByLesson(lesson);
          const isSelected = selectedLesson === lesson;
          
          return (
            <button
              key={lesson}
              className={`lesson-card ${isSelected ? 'selected' : ''}`}
              onClick={() => onLessonSelect(lesson)}
            >
              <div className="lesson-number">Bài {lesson}</div>
              <div className="lesson-count">{count} từ vựng</div>
            </button>
          );
        })}
      </div>
      
      {selectedLesson && (
        <div className="selected-lesson-info">
          <h3>Bài {selectedLesson} - {getVocabularyCountByLesson(selectedLesson)} từ vựng</h3>
          <p>Bắt đầu học từ vựng của bài này!</p>
        </div>
      )}
    </div>
  );
};

export default LessonSelector;
