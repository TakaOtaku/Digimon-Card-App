import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {saveAs} from 'file-saver';
import {ConfirmationService, MenuItem, MessageService, PrimeNGConfig,} from 'primeng/api';
import {first, Subject, takeUntil} from 'rxjs';
import {ICard, ICountCard, ISave, IUser} from '../../../../models';
import {AuthService} from '../../../service/auth.service';
import {DatabaseService} from '../../../service/database.service';
import {addToCollection, loadSave, setSave,} from '../../../store/digimon.actions';
import {selectAllCards, selectCollection, selectSave, selectSettings,} from '../../../store/digimon.selectors';
import {emptySettings} from '../../../store/reducers/save.reducer';
import {GroupedSets} from '../filter/filter-side-box/filterData';

@Component({
  selector: 'digimon-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit, OnDestroy {
  save = '';
  iSave: ISave;

  items: MenuItem[];

  display = false;
  importDisplay = false;
  exportDialog = false;
  collectionDisplay = false;
  settingsDialog = false;
  creditsDisplay = false;

  importPlaceholder =
    '' + 'Paste Collection here\n' + '\n' + ' Format:\n' + '   Qty Id\n';
  collectionText = '';

  digimonCards: ICard[] = [];
  collection: ICountCard[] = [];

  collectionCount = 1;

  preRelease = true;
  aa = true;
  stamped = true;
  showHideOptions = [
    {label: 'Show', value: true},
    {label: 'Hide', value: false},
  ];

  userStats = true;

  sortOrder = ['Color', 'Level'];
  sortOrderFilter = new FormControl();

  user: IUser | null;

  mobile = false;

  collectedCards = true;
  groupedSets = GroupedSets;
  sets: string[];
  goal = 4;
  rarities: string[] = [];
  versions: string[] = [];

  private onDestroy$ = new Subject();

  constructor(
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig,
    private router: Router,
    private confirmationService: ConfirmationService,
    private db: DatabaseService,
    public authService: AuthService,
    private store: Store
  ) {}

  ngOnInit() {
    this.update();
    this.store
      .select(selectSave)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((save) => {
        this.iSave = save;
        this.sortOrderFilter.setValue(save.settings?.sortDeckOrder ?? 'Level', {
          emitEvent: false,
        });
        this.save = JSON.stringify(save, undefined, 4);
      });
    this.store
      .select(selectAllCards)
      .pipe(first())
      .subscribe((cards) => (this.digimonCards = cards));
    this.store
      .select(selectCollection)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((collection) => (this.collection = collection));
    this.store
      .select(selectSettings)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((settings) => {
        this.preRelease = settings.showPreRelease;
        this.aa = settings.showAACards;
        this.stamped = settings.showStampedCards;
        this.collectionCount = settings.collectionMinimum;
      });

    this.user = this.authService.userData;
    this.authService.authChange.subscribe(() => {
      this.update();
      this.user = this.authService.userData;
    });

    this.primengConfig.ripple = true;
    this.onResize();
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    let screenWidth = window.innerWidth;
    this.mobile = screenWidth <= 1024;
  }

  update() {
    const user = this.authService.userData?.displayName ?? 'Unknown';
    const userMenu = {
      label: 'User: ' + user,
      items: [
        {
          label: 'Home',
          icon: 'pi pi-pencil',
          command: () => this.router.navigateByUrl(''),
        },
        {
          label: 'Profile',
          icon: 'pi pi-database',
          command: () => this.router.navigateByUrl(''),
        },
        {
          label: 'Community Decks',
          icon: 'pi pi-database',
          command: () => this.router.navigateByUrl('/community'),
        },
      ],
    };

    const settingsMenu = {
      label: 'Settings',
      items: [
        {
          label: this.authService.isLoggedIn ? 'Logout' : 'Login',
          icon: 'pi pi-google',
          command: () => {
            this.authService.isLoggedIn
              ? this.authService.LogOut()
              : this.login();
          },
        },
        {
          label: 'Import/Export',
          icon: 'pi pi-upload',
          command: () => (this.display = !this.display),
        },
        {
          label: 'Settings',
          icon: 'pi pi-cog',
          command: () => (this.settingsDialog = true),
        },
        {
          label: 'Credits',
          icon: 'pi pi-file',
          command: () => (this.creditsDisplay = true),
        },
      ],
    };

    const externalMenu = {
      label: 'External',
      items: [
        {
          label: 'What I work on',
          icon: 'pi pi-history',
          url: 'https://github.com/users/TakaOtaku/projects/1/views/1?layout=board',
        },
        {
          label: 'Feature/Bug Request',
          icon: 'pi pi-plus',
          url: 'https://github.com/TakaOtaku/Digimon-Card-App/issues',
        },
        {
          label: 'Help the Site!',
          icon: 'pi pi-paypal',
          url: 'https://www.paypal.com/donate/?hosted_button_id=DHQVT7GQ72J98',
        },
      ],
    };

    this.items = [userMenu, settingsMenu, externalMenu];
  }

  exportSave(): void {
    let blob = new Blob([this.save], { type: 'text/json' });
    saveAs(blob, 'digimon-card-collector.json');
  }

  handleFileInput(input: any) {
    let fileReader = new FileReader();
    fileReader.onload = () => {
      try {
        let save: any = JSON.parse(fileReader.result as string);
        save = this.db.checkSaveValidity(save, null);
        this.store.dispatch(loadSave({ save }));
        this.messageService.add({
          severity: 'success',
          summary: 'Save loaded!',
          detail: 'The save was loaded successfully!',
        });
      } catch (e) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Save Error!',
          detail: 'The save was not loaded!',
        });
      }
    };
    fileReader.readAsText(input.files[0]);
  }

  deleteSave(event: Event) {
    this.confirmationService.confirm({
      target: event!.target!,
      message: 'You are about to permanently delete your save. Are you sure?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.store.dispatch(
          setSave({
            save: {
              collection: [],
              decks: [],
              settings: emptySettings,
            },
          })
        );
        this.display = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Save cleared!',
          detail: 'The save was cleared successfully!',
        });
      },
      reject: () => {},
    });
  }

  login() {
    this.authService.GoogleAuth();
  }

  saveSettings() {
    const save = {
      ...this.iSave,
      settings: {
        ...this.iSave.settings,
        collectionMinimum: this.collectionCount,
        showPreRelease: this.preRelease,
        showAACards: this.aa,
        showStampedCards: this.stamped,
        sortDeckOrder: this.sortOrderFilter.value,
        showUserStats: this.userStats
      },
    };

    this.store.dispatch(setSave({ save }));

    this.settingsDialog = false;
  }

  importCollection() {
    if (this.collectionText === '') return;

    let result: string[] = this.collectionText.split('\n');
    const collectionCards: ICountCard[] = [];
    result.forEach((line) => {
      const card: ICountCard | null = this.parseLine(line);
      if (card) {
        collectionCards.push(card);
      }
    });

    this.store.dispatch(addToCollection({ collectionCards }));
    this.importDisplay = false;
    this.messageService.add({
      severity: 'success',
      summary: 'Collection Imported!',
      detail: 'The collection was imported successfully!',
    });
  }

  changeRarity(rarity: string) {
    if (this.rarities.includes(rarity)) {
      this.rarities = this.rarities.filter((value) => value !== rarity);
    } else {
      this.rarities = [...new Set(this.rarities), rarity];
    }
  }

  changeVersion(version: string) {
    if (this.versions.includes(version)) {
      this.versions = this.versions.filter((value) => value !== version);
    } else {
      this.versions = [...new Set(this.versions), version];
    }
  }

  exportCollection() {
    const exportCards = this.getSetCards().sort((a, b) =>
      a.id.localeCompare(b.id)
    );

    if (exportCards.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'No cards found!',
        detail: 'No cards, that match your filter were found!',
      });
      return;
    }

    const header = Object.keys(exportCards[0]);

    let csv = exportCards.map((row) =>
      // @ts-ignore
      header.map((fieldName) => JSON.stringify(row[fieldName])).join(',')
    );
    csv.unshift(header.join(','));
    let csvArray = csv.join('\r\n');

    let blob = new Blob([csvArray], { type: 'text/csv' });
    saveAs(blob, 'digimon-card-app.csv');
  }

  private getSetCards(): ICountCard[] {
    // If no filter is selected filter all cards
    let returnCards: ICountCard[] = [];
    let allCards: ICard[] = this.setupAllCards();
    let collection: ICountCard[] = this.setupCollection();

    if (this.collectedCards) {
      collection
        .filter((card) => !card.id.includes('P-'))
        .forEach((collectionCard) => returnCards.push(collectionCard));
    } else {
      allCards
        .filter((card) => !card.id.includes('P-'))
        .forEach((card) => {
          const foundCard = collection.find(
            (collectionCard) => collectionCard.id === card.id
          );
          if (foundCard) {
            if (this.goal - foundCard.count > 0) {
              returnCards.push({
                id: foundCard.id,
                count: this.goal - foundCard.count,
              } as ICountCard);
            }
          } else {
            returnCards.push({ id: card.id, count: this.goal } as ICountCard);
          }
        });
    }

    return returnCards;
  }

  private setupAllCards(): ICard[] {
    let setFiltered: ICard[] = this.sets.length === 0 ? this.digimonCards : [];
    this.sets.forEach((filter) => {
      setFiltered = [
        ...new Set([
          ...setFiltered,
          ...this.digimonCards.filter(
            (cards) => cards['id'].split('-')[0] === filter
          ),
        ]),
      ];
    });

    let raritiesFiltered: ICard[] = [];
    this.rarities.forEach((filter) => {
      raritiesFiltered = [
        ...new Set([
          ...raritiesFiltered,
          ...setFiltered.filter((cards) => cards['rarity'] === filter),
        ]),
      ];
    });

    let versionsFiltered: ICard[] = [];
    this.versions.forEach((filter) => {
      versionsFiltered = [
        ...new Set([
          ...versionsFiltered,
          ...raritiesFiltered.filter((cards) => cards['version'] === filter),
        ]),
      ];
    });

    return versionsFiltered;
  }

  private setupCollection(): ICountCard[] {
    let setFiltered: ICountCard[] =
      this.sets.length === 0 ? this.collection : [];
    this.sets.forEach((filter) => {
      setFiltered = [
        ...new Set([
          ...setFiltered,
          ...this.collection.filter(
            (cards) => cards['id'].split('-')[0] === filter
          ),
        ]),
      ];
    });

    if (this.rarities.length === 0) {
      return setFiltered;
    }

    let collectionCardsForRarity: ICountCard[] = [];
    setFiltered.forEach((collectionCard) => {
      const foundCard = this.digimonCards.find(
        (card) => card.id === collectionCard.id
      );

      if (this.rarities.includes(foundCard!.rarity)) {
        collectionCardsForRarity.push(collectionCard);
      }
    });

    if (this.versions.length === 0) {
      return collectionCardsForRarity;
    }

    let collectionCardsForVersion: ICountCard[] = [];
    collectionCardsForRarity.forEach((collectionCard) => {
      const foundCard = this.digimonCards.find(
        (card) => card.id === collectionCard.id
      );

      if (this.versions.includes(foundCard!.version)) {
        collectionCardsForVersion.push(collectionCard);
      }
    });

    return collectionCardsForVersion;
  }

  private parseLine(line: string): ICountCard | null {
    line = line.replace('\t', ' ');
    const lineSplit: string[] = line.replace(/  +/g, ' ').split(' ');
    const cardLine: number = +lineSplit[0] >>> 0;
    if (cardLine > 0) {
      if (!this.digimonCards.find((card) => card.id === lineSplit[1])) {
        return null;
      }
      return { count: cardLine, id: lineSplit[1] } as ICountCard;
    }
    return null;
  }
}
