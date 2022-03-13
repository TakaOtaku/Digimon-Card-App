import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {faMinus, faPlus} from "@fortawesome/free-solid-svg-icons";
import {Store} from "@ngrx/store";
import {Subject, takeUntil} from "rxjs";
import {ICard} from "../../../models";
import {changeCardCount, decreaseCardCount, increaseCardCount} from "../../../store/digimon.actions";
import {selectCardSize} from "../../../store/digimon.selectors";

@Component({
  selector: 'digimon-full-card',
  templateUrl: './full-card.component.html',
  styleUrls: ['./full-card.component.scss']
})
export class FullCardComponent implements OnInit, OnDestroy {
  @Input() card: ICard;
  @Input() count: number;
  @Input() collectionMode: boolean = true;
  @Input() scale: boolean = false;

  faPlus = faPlus;
  faMinus = faMinus;

  cardWidth = 5 + 'vmin';

  private onDestroy$ = new Subject();

  constructor(private store: Store) {
  }

  ngOnInit() {
    if (this.scale) {
      this.store.select(selectCardSize).pipe(takeUntil(this.onDestroy$))
        .subscribe(cardSize => this.cardWidth = cardSize + 'vmin');
    }
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
  }

  increaseCard(id: string) {
    this.store.dispatch(increaseCardCount({id}))
  }

  decreaseCard(id: string) {
    this.store.dispatch(decreaseCardCount({id}))
  }

  countChange(id: string) {
    this.store.dispatch(changeCardCount({id, count:this.count}))
  }

  getAA(): string {
    switch (this.card.color) {
      case 'Red':
        return 'assets/images/banner/ico_card_detail_red.png';
      case 'Blue':
        return 'assets/images/banner/ico_card_detail_blue.png';
      case 'Yellow':
        return 'assets/images/banner/ico_card_detail_yellow.png';
      case 'Green':
        return 'assets/images/banner/ico_card_detail_green.png';
      case 'Black':
        return 'assets/images/banner/ico_card_detail_black.png';
      case 'Purple':
        return 'assets/images/banner/ico_card_detail_purple.png';
      case 'White':
        return 'assets/images/banner/ico_card_detail_white.png';
      default:
        return '';
    }
  }
}
