export interface SRSResult {
  interval: number;
  repetition: number;
  efactor: number;
  nextReviewDate: Date;
}

export const calculateNextReview = (
  grade: number,
  interval: number,
  repetition: number,
  efactor: number,
): SRSResult => {
  let nextInterval: number;
  let nextRepetition: number;
  let nextEfactor: number;

  if (grade >= 3) {
    if (repetition === 0) {
      nextInterval = 1;
    } else if (repetition === 1) {
      nextInterval = 6;
    } else {
      nextInterval = Math.round(interval * efactor);
    }
    nextRepetition = repetition + 1;
  } else {
    nextRepetition = 0;
    nextInterval = 1;
  }

  nextEfactor = efactor + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02));
  if (nextEfactor < 1.3) nextEfactor = 1.3;

  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + nextInterval);

  return {
    interval: nextInterval,
    repetition: nextRepetition,
    efactor: nextEfactor,
    nextReviewDate,
  };
};
