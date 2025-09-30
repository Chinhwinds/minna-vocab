import React, { useEffect, useState } from 'react';
import type { VocabularyItem } from '../data/vocabulary';

import { Volume2, RotateCw, Eye, ArrowLeft, ArrowRight } from 'lucide-react';

interface FlashcardProps {
  vocabulary: VocabularyItem;
  onNext: () => void;
  onPrevious: () => void;
  currentIndex: number;
  totalCards: number;
  onMarkKnown?: () => void;
  onMarkUnknown?: () => void;
  studyMode?: 'normal' | 'memorize';
  autoPronounce?: boolean;
}

const Flashcard: React.FC<FlashcardProps> = ({
  vocabulary,
  onNext,
  onPrevious,
  currentIndex,
  totalCards,
  onMarkKnown,
  onMarkUnknown,
  studyMode = 'normal',
  autoPronounce = false
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [fadeKey, setFadeKey] = useState(0);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    setIsFlipped(false);
    onNext();
  };

  const handlePrevious = () => {
    setIsFlipped(false);
    onPrevious();
  };

  const playAudio = () => {
    if (vocabulary.audio_url) {
      const audio = new Audio(vocabulary.audio_url);
      audio.play().catch(error => {
        console.log('Audio playback failed:', error);
      });
    }
  };

  // Auto pronounce when new vocabulary shows
  useEffect(() => {
    setIsFlipped(false);
    setFadeKey(k => k + 1);
    if (autoPronounce) {
      playAudio();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vocabulary.vocabulary]);


  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
  
      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped(p => !p);
        return;
      }
  
      // Memorize trước
      if (studyMode === 'memorize') {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          onMarkKnown && onMarkKnown();
          return;
        }
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          onMarkUnknown && onMarkUnknown();
          return;
        }
      }
  
      // Normal sau
      if (studyMode === 'normal') {
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          setIsFlipped(false);
          onNext();
          return;
        }
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          setIsFlipped(false);
          onPrevious();
          return;
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [studyMode, onMarkKnown, onMarkUnknown, onNext, onPrevious]);
  return (
    <div className="max-w-xl mx-auto" role="group" aria-label="Flashcard" tabIndex={0}>
      <div className="flex items-center justify-between mb-3">
        <span className="inline-flex items-center text-xs px-2 py-1 rounded-md border border-border bg-card text-muted">Bài {vocabulary.lesson}</span>
        <span className="text-xs text-muted">{currentIndex + 1} / {totalCards}</span>
      </div>

      <div key={fadeKey} className="perspective transition-opacity duration-300 ease-out opacity-100">
        <div
          className={`relative h-80 sm:h-96 w-full preserve-3d transition-transform duration-500 ${isFlipped ? 'rotate-y-180' : 'rotate-y-0'}`}
          onClick={handleFlip}
        >
          <div className="absolute inset-0 backface-hidden border border-border rounded-xl bg-card shadow-sm p-6 flex flex-col items-center justify-center text-center">
            <div className="mb-4">
              <div className="text-4xl font-bold text-text">{vocabulary.vocabulary}</div>
              {vocabulary.kanji && (
                <div className="mt-2 text-2xl font-semibold text-gray-900">{vocabulary.kanji}</div>
              )}
              {vocabulary.han_viet && (
                <div className="mt-1 text-sm text-muted">{vocabulary.han_viet}</div>
              )}
            </div>
            <button
              className="inline-flex items-center gap-2 border border-border rounded-full px-4 py-2 text-text bg-surface hover:bg-gray-100"
              onClick={(e) => { e.stopPropagation(); playAudio(); }}
              aria-label="Phát âm"
            >
              <Volume2 size={18} /> Phát âm
            </button>
            <div className="mt-4 text-xs text-muted">Nhấp để xem nghĩa</div>
          </div>

          <div className="absolute inset-0 backface-hidden rotate-y-180 border border-border rounded-xl bg-card shadow-sm p-6 flex flex-col items-center justify-center text-center">
            <div className="w-full max-w-md">
              <div className="text-sm text-muted mb-2">Nghĩa</div>
              <div className="text-lg text-text">{vocabulary.meaning}</div>
              <div className="mt-4 text-left text-sm text-text space-y-1">
                <div><span className="font-semibold">Từ vựng:</span> {vocabulary.vocabulary}</div>
                {vocabulary.kanji && (<div><span className="font-semibold">Hán tự:</span> {vocabulary.kanji}</div>)}
                {vocabulary.han_viet && (<div><span className="font-semibold">Âm Hán:</span> {vocabulary.han_viet}</div>)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2">
        {studyMode === 'normal' ? (
          <>
            <button 
              type="button"
              className="inline-flex items-center gap-2 border border-border rounded-md px-4 py-2 bg-card text-text hover:bg-gray-50 disabled:opacity-50"
              onClick={(e) => { e.stopPropagation(); handlePrevious(); }}
              disabled={currentIndex === 0}
              aria-label="Trước"
            >
              <ArrowLeft size={16} /> Trước
            </button>
            <button 
              type="button"
              className="inline-flex items-center gap-2 border border-border rounded-md px-4 py-2 bg-gray-900 text-white hover:opacity-90"
              onClick={(e) => { e.stopPropagation(); handleFlip(); }}
              aria-label={isFlipped ? 'Xem từ' : 'Xem nghĩa'}
            >
              <RotateCw size={16} /> {isFlipped ? 'Xem từ' : 'Xem nghĩa'}
            </button>
            <button 
              type="button"
              className="inline-flex items-center gap-2 border border-border rounded-md px-4 py-2 bg-card text-text hover:bg-gray-50 disabled:opacity-50"
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
              disabled={currentIndex === totalCards - 1}
              aria-label="Tiếp"
            >
              Tiếp <ArrowRight size={16} />
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 border border-border rounded-md px-4 py-2 bg-card text-text hover:bg-gray-50"
              onClick={(e) => { e.stopPropagation(); onMarkUnknown && onMarkUnknown(); }}
              aria-label="Chưa thuộc (S)"
            >
              Chưa thuộc (S)
            </button>
            <button 
              type="button"
              className="inline-flex items-center gap-2 border border-border rounded-md px-4 py-2 bg-gray-900 text-white hover:opacity-90"
              onClick={(e) => { e.stopPropagation(); handleFlip(); }}
              aria-label={isFlipped ? 'Xem từ' : 'Xem nghĩa'}
            >
              <RotateCw size={16} /> {isFlipped ? 'Xem từ' : 'Xem nghĩa'}
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 border border-border rounded-md px-4 py-2 bg-gray-900 text-white hover:opacity-90"
              onClick={(e) => { e.stopPropagation(); onMarkKnown && onMarkKnown(); }}
              aria-label="Thuộc (A)"
            >
              Thuộc (A)
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Flashcard;
