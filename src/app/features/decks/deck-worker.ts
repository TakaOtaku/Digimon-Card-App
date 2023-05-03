import { ICountCard, IDeck } from '../../../models';
import { deckIsValid } from '../../functions/digimon-card.functions';

addEventListener('message', ({ data }) => {
  const decks: IDeck[] = data.decks
    .filter((deck: IDeck) => deck.tags.some((tag) => tag.name === 'BT12'))
    .filter((deck: IDeck) => deckIsValid(deck, data.allCards) === '')
    .filter((elem: IDeck, index: number, self: IDeck[]) => {
      return self.slice(index + 1).every((otherElem) => {
        return !arraysEqual(elem.cards, otherElem.cards);
      });
    });

  postMessage(decks);
});

function arraysEqual(a: ICountCard[], b: ICountCard[]): boolean {
  return a.length === b.length && a.every((val) => b.includes(val));
}
