import type { WordsResponse } from "./word";

export interface Deck {
  _id: string;
  userId: string;
  name: string;
  description: string;
  createdAt: string;
  __v: number;
}
export interface CollectionDetail {
  deck: Deck;
  totalWords: number;
  words: WordsResponse[];
}
