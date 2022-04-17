import englishJSON from "../../assets/cardlists/english.json";
import japaneseJSON from "../../assets/cardlists/japanese.json";
import preReleaseJSON from "../../assets/cardlists/preRelease.json";
import {ICard} from "../../models";
import {CARDSET} from "../../models/card-set.enum";

export function setupAllDigimonCards(): ICard[] {
  const allCards: ICard[] = setupDigimonCards(CARDSET.BothOverwrite);

  allCards.sort(function(a, b){
    if(a.cardNumber < b.cardNumber) { return -1; }
    if(a.cardNumber > b.cardNumber) { return 1; }
    return 0;
  });
  return allCards;
}

export function setupDigimonCards(digimonSet: number): ICard[] {
  let allCards: ICard[] = [];
  if(digimonSet === CARDSET.English) {allCards = englishJSON.concat(preReleaseJSON)}
  if(digimonSet === CARDSET.Japanese) {allCards = japaneseJSON}
  if(digimonSet === CARDSET.Both) {allCards = englishJSON.concat(preReleaseJSON, japaneseJSON)}
  if(digimonSet === CARDSET.BothOverwrite) {
    allCards = englishJSON.concat(preReleaseJSON);
    japaneseJSON.forEach(japCard => {
      if(allCards.find(card => card.id === japCard.id)) {return}
      allCards.push(japCard);
    });
  }

  allCards.sort(function(a, b){
    if(a.cardNumber < b.cardNumber) { return -1; }
    if(a.cardNumber > b.cardNumber) { return 1; }
    return 0;
  });
  return allCards;
}
