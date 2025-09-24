import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'csv-parse/sync';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read CSV file
const csvPath = path.join(__dirname, '../../crawl/japanese_vocabulary_50_lessons.csv');
const outputPath = path.join(__dirname, '../src/data/vocabulary.ts');

try {
  const csvContent = fs.readFileSync(csvPath, 'utf-8');

  // Parse CSV safely with support for quotes, commas, and newlines
  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  });

  const vocabularyItems = records.map((row) => {
    const lessonNum = parseInt(row.lesson) || 0;
    return {
      lesson: lessonNum,
      vocabulary: (row.vocabulary || '').toString(),
      kanji: (row.kanji || '').toString(),
      han_viet: (row.han_viet || '').toString(),
      meaning: (row.meaning || '').toString(),
      audio_url: (row.audio_url || '').toString()
    };
  });
  
  // Generate TypeScript file
  const tsContent = `// Japanese Vocabulary Data
export interface VocabularyItem {
  lesson: number;
  vocabulary: string;
  kanji: string;
  han_viet: string;
  meaning: string;
  audio_url: string;
}

// Vocabulary data converted from CSV
export const vocabularyData: VocabularyItem[] = ${JSON.stringify(vocabularyItems, null, 2)};

// Helper function to get vocabulary by lesson
export const getVocabularyByLesson = (lessonNumber: number): VocabularyItem[] => {
  return vocabularyData.filter(item => item.lesson === lessonNumber);
};

// Helper function to get all lessons
export const getAllLessons = (): number[] => {
  const lessons = new Set(vocabularyData.map(item => item.lesson));
  return Array.from(lessons).sort((a, b) => a - b);
};

// Helper function to get total vocabulary count
export const getTotalVocabularyCount = (): number => {
  return vocabularyData.length;
};

// Helper function to get vocabulary count by lesson
export const getVocabularyCountByLesson = (lessonNumber: number): number => {
  return vocabularyData.filter(item => item.lesson === lessonNumber).length;
};`;
  
  fs.writeFileSync(outputPath, tsContent, 'utf-8');
  
  console.log('✅ Successfully converted CSV to TypeScript!');
  console.log(`📊 Total vocabulary items: ${vocabularyItems.length}`);
  console.log(`📁 Output file: ${outputPath}`);
  
} catch (error) {
  console.error('❌ Error converting CSV:', error.message);
}
