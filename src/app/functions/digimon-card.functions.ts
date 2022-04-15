import {Actions} from "@ngrx/effects";
import {Store} from "@ngrx/store";
import englishJSON from "../../assets/cardlists/english.json";
import {ICard} from "../../models";
import {AuthService} from "../service/auth.service";
import {DatabaseService} from "../service/database.service";

export class DigimonCards {
  constructor(private store: Store,) {}

  public setupDigimonCards(): ICard[] {
    const allCards: ICard[] = englishJSON;

    allCards.sort(function(a, b){
      if(a.cardNumber < b.cardNumber) { return -1; }
      if(a.cardNumber > b.cardNumber) { return 1; }
      return 0;
    });
    return allCards;
  }
}

export function setupDigimonCards(): ICard[] {
  const allCards: ICard[] = englishJSON;

  allCards.sort(function(a, b){
    if(a.cardNumber < b.cardNumber) { return -1; }
    if(a.cardNumber > b.cardNumber) { return 1; }
    return 0;
  });
  return allCards;
}
