import {Component, OnDestroy, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {saveAs} from "file-saver";
import {ConfirmationService, MenuItem, MessageService, PrimeNGConfig} from "primeng/api";
import {first, Subject, takeUntil} from "rxjs";
import {SITES} from 'src/app/pages/main-page/main-page.component';
import {ICard, ICountCard, ISave} from "../../../models";
import {AuthService} from "../../service/auth.service";
import {DatabaseService} from "../../service/database.service";
import {
  addToCollection,
  changeCollectionMinimum,
  changeCollectionMode,
  changeShowVersion,
  loadSave,
  setSave,
  setSite
} from "../../store/digimon.actions";
import {
  selectAllCards,
  selectCollection,
  selectCollectionMinimum,
  selectCollectionMode,
  selectSave,
  selectShowAACards,
  selectShowPreRelease,
  selectShowStampedCards
} from "../../store/digimon.selectors";
import {emptySettings} from "../../store/reducers/save.reducer";

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
  collectionDisplay = false;
  settingsDialog = false;

  importPlaceholder = "" +
    "Paste Collection here\n" +
    "\n" +
    " Format:\n" +
    "   Qty Id\n";
  collectionText = '';

  digimonCards: ICard[] = [];
  collection: ICountCard[] = [];

  collectionCount = 1;

  preRelease = true;
  aa = true;
  stamped = true;
  showHideOptions = [{label: 'Show', value: true}, {label: 'Hide', value: false}];

  private onDestroy$ = new Subject();

  constructor(
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig,
    private confirmationService: ConfirmationService,
    private db: DatabaseService,
    public authService: AuthService,
    private store: Store
  ) {
    this.store.select(selectCollectionMode).pipe(takeUntil(this.onDestroy$))
      .subscribe(collectionMode => {
        this.collectionMode = collectionMode
        this.update();
      });
    this.store.select(selectSave).pipe(takeUntil(this.onDestroy$))
      .subscribe((save) => this.save = JSON.stringify(save, undefined, 4));
    this.authService.authChange.subscribe(() => this.update());
  }

  ngOnInit() {
    this.store.select(selectAllCards).pipe(first())
      .subscribe(cards => this.digimonCards = cards);
    this.store.select(selectCollection).pipe(takeUntil(this.onDestroy$))
      .subscribe(collection => this.collection = collection);
    this.store.select(selectCollectionMinimum).pipe(takeUntil(this.onDestroy$))
      .subscribe(minimum => this.collectionCount = minimum);
    this.store.select(selectShowPreRelease).pipe(takeUntil(this.onDestroy$))
      .subscribe(show => this.preRelease = show);
    this.store.select(selectShowAACards).pipe(takeUntil(this.onDestroy$))
      .subscribe(show => this.aa = show);
    this.store.select(selectShowStampedCards).pipe(takeUntil(this.onDestroy$))
      .subscribe(show => this.stamped = show);

    this.primengConfig.ripple = true;
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
  }

  update() {
    const user = this.authService.userData?.displayName ?? 'Unknown';
    this.items = [
      {
        label: 'User: ' + user,
        items: [
          {
            label: 'Collection',
            icon: 'pi pi-book',
            command: () => {this.switchSite(0);}
          },
          {
            label: 'Collection Stats',
            icon: 'pi pi-book',
            command: () => this.collectionDisplay = true
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
        label: 'Community',
        items: [
          {
            label: 'Community Decks',
            icon: 'pi pi-database',
            command: () => {this.switchSite(3);}
          }
        ]
      },
      {
        label: 'Settings',
        items: [
          {
            label: this.authService.isLoggedIn ? 'Logout' : 'Login',
            icon: 'pi pi-google',
            command: () => {
              this.authService.isLoggedIn ?
                this.authService.LogOut() :
                this.login();
            }
          },
          {
            label: 'Collection Mode',
            icon: this.collectionMode ? 'pi pi-circle-fill' : 'pi pi-circle',
            command: () => this.changeCM()
          },
          {
            label: 'Advanced Settings',
            icon: 'pi pi-cog',
            command: () => this.settingsDialog = true
          }
        ]
      },
      {
        label: 'External',
        items: [
          {
            label: 'What I work on',
            icon: 'pi pi-history',
            url: 'https://trello.com/b/LZA0rGZ4/digimon-card-game-app'
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
    this.messageService.add({severity:'info', summary:'Collection Mode', detail:'Collection Mode was changed!'});
  }

  exportSave(): void {
    let blob = new Blob([this.save], {type: 'text/json'})
    saveAs(blob, "digimon-card-collector.json");
  }

  handleFileInput(input: any) {
    let fileReader = new FileReader();
    fileReader.onload = () => {
      try {
        let save: any = JSON.parse(fileReader.result as string);
        save = this.db.checkSaveValidity(save, null);
        this.store.dispatch(loadSave({save}));
        this.messageService.add({severity:'success', summary:'Save loaded!', detail:'The save was loaded successfully!'});
      } catch (e) {
        this.messageService.add({severity:'warn', summary:'Save Error!', detail:'The save was not loaded!'});
      }
    }
    fileReader.readAsText(input.files[0]);
  }

  deleteSave(event: Event) {
    this.confirmationService.confirm({
      target: event!.target!,
      message: 'You are about to permanently delete your save. Are you sure?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.store.dispatch(setSave({
          save: {
            collection: [],
            decks: [],
            settings: emptySettings
          }
        }));
        this.display = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Save cleared!',
          detail: 'The save was cleared successfully!'
        });
      },
      reject: () => {
      }
    });
  }

  login() {
    this.authService.GoogleAuth();
  }

  importCollection() {
    if (this.collectionText === '') return;

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
    this.messageService.add({severity:'success', summary:'Collection Imported!', detail:'The collection was imported successfully!'});
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

  saveSettings() {
    this.store.dispatch(changeCollectionMinimum({minimum: this.collectionCount}));
    this.store.dispatch(changeShowVersion({showPre: this.preRelease, showAA: this.aa, showStamp: this.stamped}));
    this.settingsDialog = false;
  }
}
