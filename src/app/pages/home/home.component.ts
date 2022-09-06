import { Component, EventEmitter, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthService } from '../../service/auth.service';
import { DatabaseService } from '../../service/database.service';
import { setDeck } from '../../store/digimon.actions';
import * as uuid from 'uuid';

@Component({
  selector: 'digimon-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  //region Accordions
  deckView = true;
  collectionView = true;
  showAccordionButtons = true;
  showStats = true;
  //endregion
  updateMainDeck = new EventEmitter<string>();

  private screenWidth: number;

  constructor(
    private route: ActivatedRoute,
    private store: Store,
    private databaseService: DatabaseService
  ) {
    route.params.subscribe((params) => {
      if (!params['id']) {
        return;
      }
      this.databaseService.loadDeck(params['id']).subscribe((deck) => {
        this.store.dispatch(
          setDeck({
            deck: { ...deck, id: uuid.v4(), rating: 0, ratingCount: 0 },
          })
        );
      });
    });
    this.onResize();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth < 768) {
      this.deckView = true;
      this.collectionView = false;

      this.showStats = true;

      this.showAccordionButtons = false;
    } else if (this.screenWidth >= 768 && this.screenWidth < 1024) {
      this.deckView = false;
      this.collectionView = true;

      this.showStats = false;

      this.showAccordionButtons = true;
    } else {
      this.deckView = true;
      this.collectionView = true;

      this.showStats = true;

      this.showAccordionButtons = true;
    }

    console.log(
      'Show Stats: ',
      this.showStats,
      'Show AccordionButtons: ',
      this.showAccordionButtons
    );
  }

  onCardClick(id: string) {
    this.updateMainDeck.emit(id);
  }

  changeView(view: string) {
    if (view === 'Deck') {
      this.deckView = !this.deckView;

      if (this.screenWidth >= 768 && this.screenWidth < 1024) {
        if (this.deckView && this.collectionView) {
          this.collectionView = false;
          this.showStats = true;
          return;
        }
      }

      if (!this.collectionView) {
        this.collectionView = true;
      }
    } else if (view === 'Collection') {
      this.collectionView = !this.collectionView;

      if (this.screenWidth >= 768 && this.screenWidth < 1024) {
        if (this.deckView && this.collectionView) {
          this.deckView = false;
          this.showStats = false;
          return;
        }
      }

      if (!this.deckView) {
        this.deckView = true;
      }
    }

    this.showStats = !(this.collectionView && !this.deckView);
  }
}
