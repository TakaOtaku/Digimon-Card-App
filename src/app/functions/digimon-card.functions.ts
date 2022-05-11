import {englishCards} from "../../assets/cardlists/eng/english";
import {japaneseCards} from "../../assets/cardlists/jap/japanese";
import preReleaseJSON from "../../assets/cardlists/preRelease.json";
import {ICard} from "../../models";
import {CARDSET} from "../../models/card-set.enum";

export function compareIDs(idA: string, idB: string): boolean {
  const aST = idA.includes('ST');
  const bST = idB.includes('ST');
  if(aST && bST) {
    const splitA = idA.split('-');
    const splitB = idB.split('-');

    const numberA: number = +splitA[0].substring(2) >>> 0;
    const numberB: number = +splitB[0].substring(2) >>> 0;

    return numberA === numberB ? splitA[1] === splitB[1] : false;
  }
  return idA === idB;
}

export function formatId(id: string): string {
  return id.replace('ST0', 'ST').split('_P')[0];
}

export function getPNG(cardSRC: string): string {
  let engRegExp = new RegExp('\\beng\\b');
  let japRegExp = new RegExp('\\bjap\\b');
  let preReleaseRegExp = new RegExp('\\bpre-release\\b');

  if(engRegExp.test(cardSRC)) {
    return cardSRC.replace(engRegExp, 'eng/png')
      .replace(new RegExp('\\b.jpg\\b'), '.png')
  } else if(japRegExp.test(cardSRC)) {
    return cardSRC.replace(japRegExp, 'jap/png')
      .replace(new RegExp('\\b.jpg\\b'), '.png')
  } else {
    return cardSRC.replace(preReleaseRegExp, 'pre-release/png')
      .replace(new RegExp('\\b.jpg\\b'), '.png')
  }
}

export function setupAllDigimonCards(): ICard[] {
  const allCards: ICard[] = setupDigimonCards(CARDSET.Both);

  allCards.sort(function(a, b){
    if(a.cardNumber < b.cardNumber) { return -1; }
    if(a.cardNumber > b.cardNumber) { return 1; }
    return 0;
  });
  return allCards;
}

export function setupDigimonCards(digimonSet: string): ICard[] {
  let allCards: ICard[] = [];
  if(digimonSet === CARDSET.English) {allCards = englishCards.concat(preReleaseJSON)}
  if(digimonSet === CARDSET.Japanese) {allCards = japaneseCards}
  if(digimonSet === CARDSET.Both) {
    allCards = englishCards.concat(preReleaseJSON);
    japaneseCards.forEach(japCard => {
      if(allCards.find(card => card.id === japCard.id)) {return}
      allCards.push(japCard);
    });
  }

  allCards.sort(function(a, b){
    const aSet = a.cardNumber.split('-');
    const bSet = b.cardNumber.split('-');

    const aNumber: number = +aSet[1] >>> 0;
    const bNumber: number = +bSet[1] >>> 0;
    return aSet[0].localeCompare(bSet[0]) || aNumber - bNumber;
  });
  return allCards;
}
