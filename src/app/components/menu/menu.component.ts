import {Component, OnDestroy, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {saveAs} from "file-saver";
import {ConfirmationService, MenuItem, MessageService, PrimeNGConfig} from "primeng/api";
import {first, Subject, takeUntil} from "rxjs";
import {SITES} from 'src/app/pages/main-page/main-page.component';
import {ICard, ICountCard, ISave} from "../../../models";
import {addToCollection, changeCollectionMode, loadSave, setCollection, setSite} from "../../store/digimon.actions";
import {selectAllCards, selectCollectionMode, selectSave} from "../../store/digimon.selectors";

@Component({
  selector: 'digimon-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit, OnDestroy {
  SITES = SITES;

  save = '';

  collectionMode = true;

  items: MenuItem[];

  display = false;
  importDisplay = false;

  importPlaceholder = "" +
    "Paste Collection here\n" +
    "\n" +
    " Format:\n" +
    "   Qty Id\n";
  collectionText = '';
  private digimonCards: ICard[] = [];

  private onDestroy$ = new Subject();

  constructor(
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig,
    private confirmationService: ConfirmationService,
    private store: Store
  ) {
    this.store.select(selectCollectionMode).pipe(takeUntil(this.onDestroy$))
      .subscribe(collectionMode => {
        this.collectionMode = collectionMode
        this.update();
      });
    this.store.select(selectSave).pipe(takeUntil(this.onDestroy$))
      .subscribe((save) => {
        this.save = JSON.stringify(save, undefined, 4)
      });
  }

  ngOnInit() {
    this.store.select(selectAllCards).pipe(first())
      .subscribe(cards => this.digimonCards = cards);
    this.primengConfig.ripple = true;
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
  }

  update() {
    this.items = [
      {
        label: 'Pages',
        items: [
          {
            label: 'Collection',
            icon: 'pi pi-book',
            command: () => {this.switchSite(0);}
          },
          {
            label: 'Deckbuilder',
            icon: 'pi pi-pencil',
            command: () => {this.switchSite(2);}
          },
          {
            label: 'My Decks',
            icon: 'pi pi-database',
            command: () => {this.switchSite(1);}
          }
        ]
      },
      {
        label: 'Settings',
        items: [
          {
            label: 'Collection Mode',
            icon: this.collectionMode ? 'pi pi-circle-fill' : 'pi pi-circle',
            command: () => {this.changeCM();}
          },
          {
            label: 'Import/Export',
            icon: 'pi pi-cloud',
            command: () => {this.importDialog();}
          },
          {
            label: 'Help the Site!',
            icon: 'pi pi-paypal',
            url: 'https://www.paypal.com/donate/?hosted_button_id=DHQVT7GQ72J98'
          }
        ]
      }
    ];
  }

  switchSite(site: number) {
    this.store.dispatch(setSite({site}));
  }

  changeCM() {
    this.store.dispatch(changeCollectionMode({collectionMode: !this.collectionMode})) ;
  }

  importDialog() {
    this.display = true;
  }

  exportSave(): void {
    let blob = new Blob([this.save], {type: 'text/json'})
    saveAs(blob, "digimon-card-collector.json");
  }

  handleFileInput(input: any) {
    let fileReader = new FileReader();
    fileReader.onload = () => {
      try {
        const save: ISave = JSON.parse(fileReader.result as string);
        this.store.dispatch(loadSave({save}));
      } catch (e) {
      }
    }
    fileReader.readAsText(input.files[0]);
  }

  importCollectionDialog() {
    this.importDisplay = true;
  }

  deleteSave(event: Event) {
    this.confirmationService.confirm({
      target: event!.target!,
      message: 'You are about to permanently delete your collection. Are you sure?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.store.dispatch(setCollection({collection: []}));
        this.display = false;
      },
      reject: () => {}
    });
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
    this.importDisplay = false;
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
