import React, { useState } from 'react';
import type { VocabularyItem } from '../data/vocabulary';
import './Flashcard.css';

interface FlashcardProps {
  vocabulary: VocabularyItem;
  onNext: () => void;
  onPrevious: () => void;
  currentIndex: number;
  totalCards: number;
}

const Flashcard: React.FC<FlashcardProps> = ({
  vocabulary,
  onNext,
  onPrevious,
  currentIndex,
  totalCards
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    setShowAnswer(!showAnswer);
  };

  const handleNext = () => {
    setIsFlipped(false);
    setShowAnswer(false);
    onNext();
  };

  const handlePrevious = () => {
    setIsFlipped(false);
    setShowAnswer(false);
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

  return (
    <div className="flashcard-container">
      <div className="flashcard-header">
        <span className="lesson-badge">Bài {vocabulary.lesson}</span>
        <span className="card-counter">{currentIndex + 1} / {totalCards}</span>
      </div>

      <div 
        className={`flashcard ${isFlipped ? 'flipped' : ''}`}
        onClick={handleFlip}
      >
        <div className="flashcard-front">
          <div className="vocabulary-text">
            <h2>{vocabulary.vocabulary}</h2>
            {vocabulary.kanji && (
              <p className="kanji">{vocabulary.kanji}</p>
            )}
            {vocabulary.han_viet && (
              <p className="han-viet">{vocabulary.han_viet}</p>
            )}
          </div>
          
          <div className="audio-section">
            <button 
              className="audio-button"
              onClick={(e) => {
                e.stopPropagation();
                playAudio();
              }}
              title="Phát âm"
            >
              🔊
            </button>
          </div>
          
          <div className="flip-hint">
            <p>Click để xem nghĩa</p>
          </div>
        </div>

        <div className="flashcard-back">
          <div className="meaning-text">
            <h3>Nghĩa:</h3>
            <p>{vocabulary.meaning}</p>
          </div>
          
          <div className="vocabulary-info">
            <p><strong>Từ vựng:</strong> {vocabulary.vocabulary}</p>
            {vocabulary.kanji && (
              <p><strong>Hán tự:</strong> {vocabulary.kanji}</p>
            )}
            {vocabulary.han_viet && (
              <p><strong>Âm Hán:</strong> {vocabulary.han_viet}</p>
            )}
          </div>
        </div>
      </div>

      <div className="flashcard-controls">
        <button 
          className="control-button prev-button"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
        >
          ⬅️ Trước
        </button>
        
        <button 
          className="control-button flip-button"
          onClick={handleFlip}
        >
          {isFlipped ? '🔄 Xem từ' : '💡 Xem nghĩa'}
        </button>
        
        <button 
          className="control-button next-button"
          onClick={handleNext}
          disabled={currentIndex === totalCards - 1}
        >
          Tiếp ➡️
        </button>
      </div>
    </div>
  );
};

export default Flashcard;
