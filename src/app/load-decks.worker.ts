/// <reference lib="webworker" />

import { IDeck } from '../models';
import { deckIsValid } from './functions/digimon-card.functions';

addEventListener('message', ({ data }) => {
  const { decks, allCards } = data;

  const filteredDecks = decks
    .filter((deck: IDeck) => deckIsValid(deck, allCards) === '')
    .sort(
      (a: IDeck, b: IDeck) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );

  postMessage(filteredDecks);
});
