import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { saveAs } from 'file-saver';
import {
  ConfirmationService,
  MenuItem,
  MessageService,
  PrimeNGConfig,
} from 'primeng/api';
import { first, Subject, takeUntil } from 'rxjs';
import { SITES } from 'src/app/pages/main-page/main-page.component';
import { ICard, ICountCard, ISave, IUser } from '../../../models';
import { AuthService } from '../../service/auth.service';
import { DatabaseService } from '../../service/database.service';
import {
  addToCollection,
  loadSave,
  setSave,
  setSite,
} from '../../store/digimon.actions';
import {
  selectAllCards,
  selectCollection,
  selectCollectionMinimum,
  selectSave,
  selectSettings,
  selectShowAACards,
  selectShowPreRelease,
  selectShowStampedCards,
} from '../../store/digimon.selectors';
import { emptySettings } from '../../store/reducers/save.reducer';

@Component({
  selector: 'digimon-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit, OnDestroy {
  SITES = SITES;

  save = '';
  iSave: ISave;

  items: MenuItem[];

  display = false;
  importDisplay = false;
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
    { label: 'Show', value: true },
    { label: 'Hide', value: false },
  ];

  sortOrder = ['Color', 'Level'];
  sortOrderFilter = new FormControl();

  user: IUser | null;

  mobile = false;

  private onDestroy$ = new Subject();

  constructor(
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig,
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
          command: () => {
            this.switchSite(SITES.DeckBuilder);
          },
        },
        {
          label: 'My Decks',
          icon: 'pi pi-database',
          command: () => {
            this.switchSite(SITES.Decks);
          },
        },
        {
          label: 'Community Decks',
          icon: 'pi pi-database',
          command: () => {
            this.switchSite(SITES.CommunityDecks);
          },
        },
        {
          label: 'Collection Stats',
          icon: 'pi pi-book',
          command: () => (this.collectionDisplay = true),
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
          label: 'Advanced Settings',
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

  switchSite(site: number) {
    this.store.dispatch(setSite({ site }));
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
        minimum: this.collectionCount,
        showPreRelease: this.preRelease,
        showAACards: this.aa,
        showStampedCards: this.stamped,
        sortDeckOrder: this.sortOrderFilter.value,
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
