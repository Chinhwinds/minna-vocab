import React, { useState } from 'react';
import './App.css';
import { Home } from 'lucide-react';
import { AuthProvider } from './context/AuthContext';
import AuthButton from './components/AuthButton';
import { useAuth } from './context/AuthContext';
import { saveProgress } from './services/progress';
import Toggle from './components/Toggle';
import Flashcard from './components/Flashcard';
import LessonSelector from './components/LessonSelector';
import Statistics from './components/Statistics';
import { getVocabularyByLesson } from './data/vocabulary';

function App() {
  const { user } = useAuth();
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isStudying, setIsStudying] = useState(false);
  const [studyMode, setStudyMode] = useState<'normal' | 'memorize'>('normal');

  const currentVocabulary = selectedLesson ? getVocabularyByLesson(selectedLesson) : [];
  const currentCard = currentVocabulary[currentCardIndex];

  const handleLessonSelect = (lesson: number) => {
    setSelectedLesson(lesson);
    setCurrentCardIndex(0);
    setIsStudying(false);
  };


  const handleNext = () => {
    setCurrentCardIndex((i) => {
      const last = currentVocabulary.length - 1;
      return i < last ? i + 1 : last;
    });
  };

  const handlePrevious = () => {
    setCurrentCardIndex((i) => (i > 0 ? i - 1 : 0));
  };

  const backToLessonSelection = () => {
    setIsStudying(false);
    setCurrentCardIndex(0);
  };

  return (
    <AuthProvider>
    <div className="app">
      <header className="border-b border-border bg-surface text-text">
        <div className="max-w-3xl mx-auto px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl">🇯🇵</span>
            <h1 className="m-0 text-lg font-bold">Japanese Flashcard</h1>
          </div>
          <div className="inline-flex items-center gap-3">
            <AuthButton />
            {isStudying && (
            <button 
              onClick={backToLessonSelection}
              className="inline-flex items-center gap-2 bg-gray-200 text-text border border-border px-3 py-2 rounded-md hover:bg-gray-300"
            >
              <Home size={16} /> Trang chủ
            </button>
            )}
          </div>
        </div>
      </header>

      <main className="bg-surface min-h-[calc(100vh-64px)] transition-colors">
        {!isStudying ? (
          <div className="max-w-3xl mx-auto p-5">
            <LessonSelector 
              selectedLesson={selectedLesson}
              onLessonSelect={(lesson) => {
                handleLessonSelect(lesson);
                // Auto-enter study mode
                setIsStudying(true);
              }}
            />
            
            <Statistics currentLesson={selectedLesson} />
            
            {/* Auto start: removed manual start button */}
          </div>
        ) : (
          <div className="max-w-3xl mx-auto p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="m-0 text-lg text-text">Bài {selectedLesson}</h2>
              <span className="text-xs text-muted">{currentCardIndex + 1} / {currentVocabulary.length}</span>
            </div>

            {/* Toggle study mode */}
            <div className="mb-3">
              <Toggle
                checked={studyMode === 'memorize'}
                onChange={(checked) => setStudyMode(checked ? 'memorize' : 'normal')}
                leftLabel="Thường"
                rightLabel="Ghi nhớ"
              />
              <div className="text-xs text-muted mt-1">
                Chế độ: <span className="font-semibold">{studyMode === 'normal' ? 'Thường (←/→, Space)' : 'Ghi nhớ (A=Thuộc, S=Chưa thuộc, ←/→, Space)'}</span>
              </div>
            </div>

           
            
            {currentCard && (
              <Flashcard
                key={`${selectedLesson}-${currentCardIndex}`}
                vocabulary={currentCard}
                onNext={handleNext}
                onPrevious={handlePrevious}
                currentIndex={currentCardIndex}
                totalCards={currentVocabulary.length}
                studyMode={studyMode}
                onMarkKnown={async () => {
                  if (!user) return;
                  await saveProgress(
                    user.uid,
                    currentCard.lesson,
                    currentCard.vocabulary,
                    'known'
                  );
                  handleNext();
                }}
                onMarkUnknown={async () => {
                  if (!user) return;
                  await saveProgress(
                    user.uid,
                    currentCard.lesson,
                    currentCard.vocabulary,
                    'unknown'
                  );
                  handleNext();
                }}
              />
            )}
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>📚 Dữ liệu từ Minna no Nihongo - 50 bài học, {currentVocabulary.length > 0 ? currentVocabulary.length : '1,564'} từ vựng</p>
      </footer>
    </div>
    </AuthProvider>
  );
}

export default App;