import englishJSON from "../../assets/cardlists/english.json";
import {ICard} from "../../models";

export function setupDigimonCards(): ICard[] {
  const allCards: ICard[] = englishJSON;

  allCards.sort(function(a, b){
    if(a.cardNumber < b.cardNumber) { return -1; }
    if(a.cardNumber > b.cardNumber) { return 1; }
    return 0;
  })
  return allCards;
}
