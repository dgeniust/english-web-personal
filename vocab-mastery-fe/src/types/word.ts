// types/word.ts

import type { PaginationParams } from "./pagination";

// 1. Enum loại từ
export const WordType = {
  NOUN: "noun",
  VERB: "verb",
  ADJECTIVE: "adjective",
  ADVERB: "adverb",
  PRONOUN: "pronoun",
  PREPOSITION: "preposition",
  CONJUNCTION: "conjunction",
  INTERJECTION: "interjection",
  PHRASE: "phrase",
  OTHER: "other",
} as const;
export type WordType = (typeof WordType)[keyof typeof WordType];
// 2. Entity Model đại diện cho Word trả về từ backend (JSON)
export interface Word {
  _id: string;
  userId: string;
  deckIds: string[];
  term: string;
  meaning: string;
  englishMeaning?: string;
  type: WordType;
  ipa?: string;
  audioUrl?: string;
  tags: string[];
  repetition: number;
  interval: number;
  efactor: number;
  nextReviewDate: string; // ISO Date string từ JSON API
  createdAt: string; // ISO Date string
  synonymGroupId?: string;
  textSynonyms: string[];
  __v?: number;
}

// 3. DTO gửi lên khi tạo từ mới (dựa theo payload cURL)
export interface CreateWordDto {
  term: string;
  meaning: string;
  type: WordType | string;
  tags?: string[];
  inputSynonyms?: string[];
  deckIds?: string[];
  englishMeaning?: string;
  ipa?: string;
  audioUrl?: string;
}
export interface CreateWordResponse {
  message: string;
  word: Word;
}
export interface WordsResponse {
  id: string;
  term: string;
  meaning: string;
  type: WordType;
  tags: string[];
  nextReviewDate: string;
  englishMeaning?: string;
  ipa?: string;
  audioUrl?: string;
}
export interface GetAllWordsResponse {
  pagination: PaginationParams;
  data: WordsResponse[];
}
