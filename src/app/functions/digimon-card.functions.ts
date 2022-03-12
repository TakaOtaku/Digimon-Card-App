import {
  BT01_03_1_0CardList,
  BT01_03_1_5CardList,
  BT04CardList,
  BT05CardList,
  BT06CardList,
  BT07CardList,
  EX01CardList,
  PromotionCardList,
  ST01CardList,
  ST02CardList,
  ST03CardList,
  ST04CardList,
  ST05CardList,
  ST06CardList,
  ST07CardList,
  ST08CardList
} from "../../assets/cardlists";
import {ICard} from "../models";

export function setupDigimonCards(): ICard[] {
  const allCards = PromotionCardList.concat(
    BT01_03_1_0CardList, BT01_03_1_5CardList,
    BT04CardList, BT05CardList,
    BT06CardList, BT07CardList,
    EX01CardList, ST01CardList,
    ST02CardList, ST03CardList,
    ST04CardList, ST05CardList,
    ST06CardList, ST07CardList,
    ST08CardList,
  );
  allCards.sort(function(a, b){
    if(a.cardNumber < b.cardNumber) { return -1; }
    if(a.cardNumber > b.cardNumber) { return 1; }
    return 0;
  })
  return allCards;
}
