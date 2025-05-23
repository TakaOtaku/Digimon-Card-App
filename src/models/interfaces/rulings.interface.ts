export interface QuestionAnswer {
  question: string;
  answer: string;
}

export interface DigimonRulings {
  [cardId: string]: QuestionAnswer[];
}
