import type { IWord, WordType } from "../models/Word.js";

export interface WordResponseDto {
  id: string;
  term: string;
  meaning: string;
  type: WordType;
  englishMeaning?: string | undefined;
  ipa?: string | undefined;
  audioUrl?: string | undefined;
  tags: string[];
  nextReviewDate: Date;
}

export const toWordResponseDto = (word: IWord): WordResponseDto => {
  const dto: WordResponseDto = {
    id: word._id.toString(),
    term: word.term,
    meaning: word.meaning,
    tags: word.tags,
    nextReviewDate: word.nextReviewDate,
    type: word.type,
  };
  if (word.englishMeaning !== undefined)
    dto.englishMeaning = word.englishMeaning;
  if (word.type !== undefined) dto.type = word.type;
  if (word.ipa !== undefined) dto.ipa = word.ipa;
  if (word.audioUrl !== undefined) dto.audioUrl = word.audioUrl;
  return dto;
};
