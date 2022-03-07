import {Component, Input} from '@angular/core';
import {faMinus, faPlus} from "@fortawesome/free-solid-svg-icons";
import {Store} from "@ngrx/store";
import {ICard} from "../../models";

import * as CollectionActions from "../../store/actions/collection.actions";

@Component({
  selector: 'digimon-full-card',
  templateUrl: './full-card.component.html',
  styleUrls: ['./full-card.component.scss']
})
export class FullCardComponent {
  @Input() card: ICard;
  @Input() count: number;
  @Input() collectionMode: boolean|null = true;

  faPlus = faPlus;
  faMinus = faMinus;

  constructor(private store: Store) {}

  public increaseCard(id: string) {
    this.store.dispatch(CollectionActions.increaseCardCount({id}))
  }

  public decreaseCard(id: string) {
    this.store.dispatch(CollectionActions.decreaseCardCount({id}))
  }

  public countChange(id: string) {
    this.store.dispatch(CollectionActions.changeCardCount({id, count:this.count}))
  }

  public getBackground(): string {
    switch (this.count) {
      case 0:
        return '';
      case 1:
      case 2:
      case 3:
        return 'yellow'
      case 4:
        return 'green';
      case 5:
        return 'light-blue';
      default:
        return 'blue';
    }
  }
}
