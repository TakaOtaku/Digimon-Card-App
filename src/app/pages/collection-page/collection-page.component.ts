import { Component, OnDestroy, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { Subject, takeUntil } from "rxjs";
import { selectMobileCollectionView } from "../../store/digimon.selectors";

@Component({
  selector: 'digimon-collection-page',
  templateUrl: './collection-page.component.html',
})
export class CollectionPageComponent implements OnInit, OnDestroy {
  mobileCollectionView = false;

  private onDestroy$ = new Subject();
  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store
      .select(selectMobileCollectionView)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(
        (mobileCollectionView) =>
          (this.mobileCollectionView = mobileCollectionView)
      );
  }

  ngOnDestroy(): void {
    this.onDestroy$.next(true);
  }
}
