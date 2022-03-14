import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {Store} from "@ngrx/store";
import {ToastrService} from "ngx-toastr";
import {first, Subject} from "rxjs";
import {ICard, ICountCard} from "../../../models";
import {addToCollection} from "../../../store/digimon.actions";
import {selectAllCards} from "../../../store/digimon.selectors";

@Component({
  selector: 'digimon-import-collection',
  templateUrl: './import-collection.component.html',
  styleUrls: ['./import-collection.component.css']
})
export class ImportCollectionComponent implements OnInit, OnDestroy {
  importPlaceholder = "" +
    "Paste Collection here\n" +
    "\n" +
    " Format:\n" +
    "   Qty Id\n";
  collectionText = '';
  private digimonCards: ICard[] = [];
  private destroy$ = new Subject();

  constructor(
    private store: Store,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<ImportCollectionComponent>
  ) {
  }

  ngOnInit() {
    this.store.select(selectAllCards).pipe(first()).subscribe(cards => this.digimonCards = cards);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  importCollection() {
    if (this.collectionText === '') {
      return;
    }

    let result: string[] = this.collectionText.split("\n");
    const collectionCards: ICountCard[] = [];
    result.forEach(line => {
      const card: ICountCard | null = this.parseLine(line);
      if (card) {
        collectionCards.push(card);
      }
    });

    this.store.dispatch(addToCollection({collectionCards}));
    this.toastr.success('A new collection was imported.', 'Collection Imported')
    this.dialogRef.close();
  }

  private parseLine(line: string): ICountCard | null {
    line = line.replace('\t', ' ');
    const lineSplit: string[] = line.replace(/  +/g, ' ').split(" ");
    const cardLine: number = +lineSplit[0] >>> 0;
    if (cardLine > 0) {
      if (!this.digimonCards.find(card => card.id === lineSplit[1])) {
        return null;
      }
      return {count: cardLine, id: lineSplit[1]} as ICountCard;
    }
    return null;
  }
}
