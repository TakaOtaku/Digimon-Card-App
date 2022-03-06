import {Component, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {CookieService} from "ngx-cookie-service";
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
} from "../assets/cardlists";
import {ISave} from "./models";
import {setDigimonCards, setSave} from "./store/digimon.actions";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    private cookies: CookieService,
    private store: Store
  ) {
    this.setDigimonCards();
  }

  public ngOnInit(): void {
    if (this.cookies.check('Digimon-Card-Collector')) {
      const cookie = this.cookies.get('Digimon-Card-Collector');
      const save: ISave = JSON.parse(cookie);
      this.store.dispatch(setSave({save}));
    }
  }

  private setDigimonCards(): void {
    const digimonCards = PromotionCardList.concat(
      BT01_03_1_0CardList,
      BT01_03_1_5CardList,
      BT04CardList,
      BT05CardList,
      BT06CardList,
      BT07CardList,
      EX01CardList,
      ST01CardList,
      ST02CardList,
      ST03CardList,
      ST04CardList,
      ST05CardList,
      ST06CardList,
      ST07CardList,
      ST08CardList
    );
    digimonCards.sort(function(a, b){
      if(a.cardNumber < b.cardNumber) { return -1; }
      if(a.cardNumber > b.cardNumber) { return 1; }
      return 0;
    })
    this.store.dispatch(setDigimonCards({ digimonCards }));
  }
}
