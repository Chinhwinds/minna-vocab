import React, { useState } from 'react';
import Flashcard from '../components/Flashcard';
import { getVocabularyByLesson } from '../data/vocabulary';
import '../App.css';

const TestFlashcard: React.FC = () => {
  const lessonNumber = 1;
  const items = getVocabularyByLesson(lessonNumber);
  const [index, setIndex] = useState(0);
  const current = items[index];

  return (
    <div className="app">
      <header className="app-header">
        <h1>🇯🇵 Test Flashcard</h1>
        <p>Bài {lessonNumber} — {items.length} từ vựng</p>
      </header>
      <main className="app-main">
        {items.length === 0 ? (
          <div style={{ textAlign: 'center', background: '#fff', padding: 16, borderRadius: 12 }}>
            Không có dữ liệu. Hãy chạy script convert CSV.
          </div>
        ) : (
          <Flashcard
            vocabulary={current}
            onNext={() => setIndex(i => Math.min(i + 1, items.length - 1))}
            onPrevious={() => setIndex(i => Math.max(i - 1, 0))}
            currentIndex={index}
            totalCards={items.length}
          />
        )}
        {items.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 16 }}>
            <button className="back-button" onClick={() => setIndex(i => Math.max(i - 1, 0))}>⬅️ Trước</button>
            <button className="back-button" onClick={() => setIndex(i => Math.min(i + 1, items.length - 1))}>Tiếp ➡️</button>
          </div>
        )}
      </main>
      <footer className="app-footer">
        <p>Trang test flashcard — không cần chọn bài</p>
      </footer>
    </div>
  );
};

export default TestFlashcard;





