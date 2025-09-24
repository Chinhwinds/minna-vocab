import React from 'react';
import { getAllLessons, getTotalVocabularyCount, getVocabularyCountByLesson } from '../data/vocabulary';
import './Statistics.css';

interface StatisticsProps {
  currentLesson: number | null;
}

const Statistics: React.FC<StatisticsProps> = ({ currentLesson }) => {
  const totalLessons = getAllLessons().length;
  const totalVocabulary = getTotalVocabularyCount();
  const currentLessonCount = currentLesson ? getVocabularyCountByLesson(currentLesson) : 0;

  return (
    <div className="statistics">
      <h3>📊 Thống Kê</h3>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <div className="stat-number">{totalLessons}</div>
            <div className="stat-label">Tổng số bài học</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🔤</div>
          <div className="stat-content">
            <div className="stat-number">{totalVocabulary}</div>
            <div className="stat-label">Tổng từ vựng</div>
          </div>
        </div>
        
        {currentLesson && (
          <div className="stat-card current">
            <div className="stat-icon">📖</div>
            <div className="stat-content">
              <div className="stat-number">{currentLessonCount}</div>
              <div className="stat-label">Từ vựng bài {currentLesson}</div>
            </div>
          </div>
        )}
      </div>
      
      <div className="progress-info">
        {currentLesson && (
          <div className="lesson-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ 
                  width: `${(currentLessonCount / totalVocabulary) * 100}%` 
                }}
              ></div>
            </div>
            <p>Bài {currentLesson}: {currentLessonCount}/{totalVocabulary} từ vựng</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Statistics;
