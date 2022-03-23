import {Component, OnDestroy} from '@angular/core';
import {Store} from "@ngrx/store";
import {Subject, takeUntil} from "rxjs";
import {changeCardSize} from "../../store/digimon.actions";
import {selectCardSize} from "../../store/digimon.selectors";

@Component({
  selector: 'digimon-slider',
  templateUrl: './slider.component.html'
})
export class SliderComponent implements OnDestroy {
  cardSize = 40;

  private onDestroy$ = new Subject();

  constructor(public store: Store) {
    this.store.select(selectCardSize).pipe(takeUntil(this.onDestroy$))
      .subscribe(cardSize => this.cardSize = cardSize)
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
  }

  cardSizeChange() {
    this.store.dispatch(changeCardSize({cardSize: this.cardSize}));
  }

  increaseCardSize() {
    this.cardSize = this.cardSize + 5 >= 100 ? 100 : this.cardSize + 5;
    this.store.dispatch(changeCardSize({cardSize: this.cardSize}))
  }

  decreaseCardSize() {
    this.cardSize = this.cardSize - 5 <= 0 ? 0 : this.cardSize - 5;
    this.store.dispatch(changeCardSize({cardSize: this.cardSize}))
  }
}
