/// <reference lib="webworker" />

import { ICountCard, IDeck } from '../models';
import { deckIsValid } from './functions/digimon-card.functions';

addEventListener('message', ({ data }) => {
  const { decks, allCards } = data;

  const filteredDecks = decks.filter((deck: IDeck) => deckIsValid(deck, allCards) === '').sort((a: IDeck, b: IDeck) => new Date(b.date).getTime() - new Date(a.date).getTime());

  postMessage(filteredDecks);
});

function arraysEqual(a: ICountCard[], b: ICountCard[]): boolean {
  return a.length === b.length && a.every((val) => b.includes(val));
}
