import React, { useMemo, useState, useEffect } from 'react';
import './App.css';
import { Home } from 'lucide-react';
// AuthProvider is mounted in main.tsx
import AuthButton from './components/AuthButton';
import { useAuth } from './context/AuthContext';
import { saveProgress, getProgressMap, type LearnStatus } from './services/progress';
import Toggle from './components/Toggle';
import Flashcard from './components/Flashcard';
import LessonSelector from './components/LessonSelector';
import Statistics from './components/Statistics';
import { getVocabularyByLesson } from './data/vocabulary';
import ProgressList from './pages/ProgressList';

function App() {
  const { user } = useAuth();
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isStudying, setIsStudying] = useState(false);
  const [studyMode, setStudyMode] = useState<'normal' | 'memorize'>('normal');
  const [isShuffle, setIsShuffle] = useState(false);
  const [autoPronounce, setAutoPronounce] = useState(false);
  const [isNavLocked, setIsNavLocked] = useState(false);
  const [progressMap, setProgressMap] = useState<Record<string, LearnStatus> | null>(null);
  const [showCongrats, setShowCongrats] = useState<string | null>(null);
  const [unknownOnly, setUnknownOnly] = useState(false);
  const [viewList, setViewList] = useState<{ lesson: number; type: 'known' | 'unknown' } | null>(null);

  const currentVocabulary = selectedLesson ? getVocabularyByLesson(selectedLesson) : [];
  const [progressReady, setProgressReady] = useState(false);
  const [sessionVocabulary, setSessionVocabulary] = useState<typeof currentVocabulary>([]);
  const currentCard = sessionVocabulary[currentCardIndex];

  // Stats
  const totalKnown = useMemo(() => {
    if (!progressMap) return undefined;
    return Object.values(progressMap).filter(s => s === 'known').length;
  }, [progressMap]);
  const totalUnknown = useMemo(() => {
    if (!progressMap) return undefined;
    return Object.values(progressMap).filter(s => s === 'unknown').length;
  }, [progressMap]);
  const lessonKnown = useMemo(() => {
    if (!progressMap || !selectedLesson) return undefined;
    // count within sessionVocabulary intersect map known
    return sessionVocabulary.filter(v => progressMap[v.vocabulary] === 'known').length;
  }, [progressMap, sessionVocabulary, selectedLesson]);
  const lessonUnknown = useMemo(() => {
    if (!progressMap || !selectedLesson) return undefined;
    return sessionVocabulary.filter(v => progressMap[v.vocabulary] !== 'known').length;
  }, [progressMap, sessionVocabulary, selectedLesson]);

  // Fetch progress once per lesson when entering memorize (and logged in)
  useEffect(() => {
    let isCancelled = false;
    async function run() {
      if (!user || !selectedLesson || studyMode !== 'memorize') {
        setProgressMap(null);
        setProgressReady(true);
        return;
      }
      const map = await getProgressMap(user.uid, selectedLesson);
      if (!isCancelled) {
        setProgressMap(map);
        setProgressReady(true);
      }
    }
    run();
    return () => { isCancelled = true; };
  }, [user, selectedLesson, studyMode]);

  // Build frozen per-session order after progress is ready or when options change
  useEffect(() => {
    if (!selectedLesson) { setSessionVocabulary([]); setCurrentCardIndex(0); return; }
    if (studyMode === 'memorize') {
      if (!progressReady) return; // wait for fetch resolution
      const base = currentVocabulary;
      const map = progressMap || {};
      const unknown = base.filter(v => map[v.vocabulary] !== 'known');
      const known = base.filter(v => map[v.vocabulary] === 'known');
      const shuffleInPlace = (arr: typeof base) => {
        for (let i = arr.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [arr[i], arr[j]] = [arr[j], arr[i]];
        }
      };
      if (isShuffle) { shuffleInPlace(unknown); shuffleInPlace(known); }
      const ordered = unknownOnly ? unknown : [...unknown, ...known];
      setSessionVocabulary(ordered);
      setCurrentCardIndex(0);
    } else {
      // normal mode
      if (!currentVocabulary.length) { setSessionVocabulary([]); setCurrentCardIndex(0); return; }
      if (!isShuffle) {
        setSessionVocabulary(currentVocabulary);
      } else {
        const shuffled = [...currentVocabulary];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        setSessionVocabulary(shuffled);
      }
      setCurrentCardIndex(0);
    }
  }, [selectedLesson, studyMode, isShuffle, unknownOnly, progressReady]);

  const handleLessonSelect = (lesson: number) => {
    setSelectedLesson(lesson);
    setCurrentCardIndex(0);
    setIsStudying(false);
  };


  const handleNext = () => {
    if (isNavLocked) return;
    setIsNavLocked(true);
    setTimeout(() => setIsNavLocked(false), 300);
    setCurrentCardIndex((i) => {
      const last = sessionVocabulary.length - 1;
      return i < last ? i + 1 : last;
    });
  };

  const handlePrevious = () => {
    if (isNavLocked) return;
    setIsNavLocked(true);
    setTimeout(() => setIsNavLocked(false), 300);
    setCurrentCardIndex((i) => (i > 0 ? i - 1 : 0));
  };

  const backToLessonSelection = () => {
    setIsStudying(false);
    setCurrentCardIndex(0);
  };

  return (
    <div className="app">
      <header className="border-b border-border bg-surface text-text">
        <div className="max-w-3xl mx-auto px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl">🇯🇵</span>
            <h1 className="m-0 text-lg font-bold">Japanese Flashcard</h1>
          </div>
          <div className="inline-flex items-center gap-3">
            <button
              onClick={() => setViewList({ lesson: selectedLesson ?? 1, type: 'unknown' })}
              className="inline-flex items-center gap-2 bg-gray-200 text-text border border-border px-3 py-2 rounded-md hover:bg-gray-300"
            >
              Tiến độ
            </button>
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
        {viewList ? (
          <ProgressList
            lesson={viewList.lesson}
            onBack={() => setViewList(null)}
            onJumpTo={(ls, vocab) => {
              setViewList(null);
              setSelectedLesson(ls);
              // ensure sessionVocabulary built with current options
              setIsStudying(true);
              setStudyMode('normal');
              // jump by finding index in current lesson's vocabulary (natural order)
              const list = getVocabularyByLesson(ls);
              const idx = list.findIndex(v => v.vocabulary === vocab);
              setSessionVocabulary(list);
              setCurrentCardIndex(idx >= 0 ? idx : 0);
            }}
          />
        ) : !isStudying ? (
          <div className="max-w-3xl mx-auto p-5">
            <LessonSelector 
              selectedLesson={selectedLesson}
              onLessonSelect={(lesson) => {
                handleLessonSelect(lesson);
                // Auto-enter study mode
                setIsStudying(true);
              }}
            />
            
            <Statistics
              currentLesson={selectedLesson}
              totalKnown={totalKnown}
              totalUnknown={totalUnknown}
              lessonKnown={lessonKnown}
              lessonUnknown={lessonUnknown}
              onViewLessonList={(lesson, type) => setViewList({ lesson, type })}
            />
            
            {/* Auto start: removed manual start button */}
          </div>
        ) : (
          <div className="max-w-3xl mx-auto p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="m-0 text-lg text-text">Bài {selectedLesson}</h2>
              <span className="text-xs text-muted">{currentCardIndex + 1} / {sessionVocabulary.length}</span>
            </div>

            {/* Toggle study mode */}
            <div className="mb-3">
              <Toggle
                checked={studyMode === 'memorize'}
                onChange={(checked) => {
                  if (checked && !user) {
                    alert('Bạn cần đăng nhập để dùng chế độ ghi nhớ.');
                    setStudyMode('normal');
                    return;
                  }
                  setStudyMode(checked ? 'memorize' : 'normal');
                  if (checked) {
                    setCurrentCardIndex(0);
                  }
                }}
                leftLabel="Thường"
                rightLabel="Ghi nhớ"
              />
              <div className="text-xs text-muted mt-1">
                Chế độ: <span className="font-semibold">{studyMode === 'normal' ? 'Thường (←/→, Space)' : 'Ghi nhớ (← Thuộc/ → Chưa thuộc, Space)'}</span>
              </div>
            </div>

            {/* Study options */}
            <div className="mb-4 flex flex-col sm:flex-row gap-3">
              <div className="flex items-center gap-2">
                <Toggle
                  checked={isShuffle}
                  onChange={(checked) => {
                    setIsShuffle(checked);
                    setCurrentCardIndex(0);
                  }}
                  leftLabel="Theo thứ tự"
                  rightLabel="Ngẫu nhiên"
                />
              </div>
              <div className="flex items-center gap-2">
                <Toggle
                  checked={autoPronounce}
                  onChange={(checked) => setAutoPronounce(checked)}
                  leftLabel="Tắt phát âm"
                  rightLabel="Tự phát âm"
                />
              </div>
              {studyMode === 'memorize' && (
                <div className="flex items-center gap-2">
                  <Toggle
                    checked={unknownOnly}
                    onChange={(checked) => { setUnknownOnly(checked); setCurrentCardIndex(0); }}
                    leftLabel="Tất cả"
                    rightLabel="Chỉ chưa thuộc"
                  />
                </div>
              )}
            </div>
            
            {currentCard && (
              <Flashcard
                key={`${selectedLesson}-${currentCardIndex}`}
                vocabulary={currentCard}
                onNext={handleNext}
                onPrevious={handlePrevious}
                currentIndex={currentCardIndex}
                totalCards={sessionVocabulary.length}
                studyMode={studyMode}
                autoPronounce={autoPronounce}
                onMarkKnown={async () => {
                  if (!user || !currentCard) return;
                  await saveProgress(
                    user.uid,
                    currentCard.lesson,
                    currentCard.vocabulary,
                    'known'
                  );
                  // update local map to keep ordering consistent without refetch
                  setProgressMap((prev) => {
                    if (!prev) return prev;
                    return { ...prev, [currentCard.vocabulary]: 'known' };
                  });
                  if (currentCardIndex >= sessionVocabulary.length - 1) {
                    setShowCongrats('Bạn đã hoàn thành chế độ ghi nhớ cho bài này!');
                  } else {
                    handleNext();
                  }
                }}
                onMarkUnknown={async () => {
                  if (!user || !currentCard) return;
                  await saveProgress(
                    user.uid,
                    currentCard.lesson,
                    currentCard.vocabulary,
                    'unknown'
                  );
                  setProgressMap((prev) => {
                    if (!prev) return prev;
                    return { ...prev, [currentCard.vocabulary]: 'unknown' };
                  });
                  if (currentCardIndex >= sessionVocabulary.length - 1) {
                    setShowCongrats('Bạn đã hoàn thành chế độ ghi nhớ cho bài này!');
                  } else {
                    handleNext();
                  }
                }}
              />
            )}
            {showCongrats && (
              <div className="fixed left-1/2 -translate-x-1/2 bottom-6 z-50 bg-green-600 text-white px-4 py-2 rounded-md shadow">
                {showCongrats}
                <button className="ml-3 underline" onClick={() => setShowCongrats(null)}>Đóng</button>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>📚 Dữ liệu từ Minna no Nihongo - 50 bài học, {sessionVocabulary.length > 0 ? sessionVocabulary.length : '1,564'} từ vựng</p>
      </footer>
    </div>
  );
}

export default App;