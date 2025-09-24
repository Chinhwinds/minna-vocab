import React, { useState } from 'react';
import './App.css';
import Flashcard from './components/Flashcard';
import LessonSelector from './components/LessonSelector';
import Statistics from './components/Statistics';
import { getVocabularyByLesson } from './data/vocabulary';

function App() {
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isStudying, setIsStudying] = useState(false);

  const currentVocabulary = selectedLesson ? getVocabularyByLesson(selectedLesson) : [];
  const currentCard = currentVocabulary[currentCardIndex];

  const handleLessonSelect = (lesson: number) => {
    setSelectedLesson(lesson);
    setCurrentCardIndex(0);
    setIsStudying(false);
  };

  const startStudying = () => {
    if (selectedLesson && currentVocabulary.length > 0) {
      setIsStudying(true);
    }
  };

  const handleNext = () => {
    if (currentCardIndex < currentVocabulary.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    }
  };

  const backToLessonSelection = () => {
    setIsStudying(false);
    setCurrentCardIndex(0);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🇯🇵 Japanese Flashcard</h1>
        <p>Học từ vựng tiếng Nhật với Minna no Nihongo</p>
      </header>

      <main className="app-main">
        {!isStudying ? (
          <div className="study-setup">
            <LessonSelector 
              selectedLesson={selectedLesson}
              onLessonSelect={handleLessonSelect}
            />
            
            <Statistics currentLesson={selectedLesson} />
            
            {selectedLesson && currentVocabulary.length > 0 && (
              <div className="start-studying">
                <button 
                  className="start-button"
                  onClick={startStudying}
                >
                  🚀 Bắt đầu học Bài {selectedLesson}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="study-session">
            <div className="study-header">
              <button 
                className="back-button"
                onClick={backToLessonSelection}
              >
                ⬅️ Quay lại
              </button>
              <h2>Bài {selectedLesson}</h2>
            </div>
            
            {currentCard && (
              <Flashcard
                vocabulary={currentCard}
                onNext={handleNext}
                onPrevious={handlePrevious}
                currentIndex={currentCardIndex}
                totalCards={currentVocabulary.length}
              />
            )}
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>📚 Dữ liệu từ Minna no Nihongo - 50 bài học, {currentVocabulary.length > 0 ? currentVocabulary.length : '1,564'} từ vựng</p>
      </footer>
    </div>
  );
}

export default App;