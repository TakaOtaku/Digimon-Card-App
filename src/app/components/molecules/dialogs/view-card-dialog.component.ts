import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { englishCards } from '../../../../assets/cardlists/eng/english';
import { ICard, IDeck } from '../../../../models';
import { ColorMap } from '../../../../models/maps/color.map';
import { formatId } from '../../../functions/digimon-card.functions';
import {
  selectDeck,
  selectFilteredCards,
} from '../../../store/digimon.selectors';

@Component({
  selector: 'digimon-view-card-dialog',
  template: `<div
    class="h-full w-full min-w-full max-w-full overflow-x-hidden md:w-[700px] md:min-w-[700px] md:max-w-[700px]"
  >
    <div
      class="align-center mt-1 inline-flex h-10 w-full justify-between border-b border-slate-200"
      id="Header"
    >
      <p class="self-center font-bold text-gray-500" id="Card-Number">
        {{ card.cardNumber }}
      </p>
      <p class="self-center font-bold uppercase text-white" id="Card-Rarity">
        {{ card.rarity }}
      </p>
      <p class="self-center font-bold uppercase text-white" id="Card-Block">
        {{ card.block }}
      </p>
      <p
        [ngStyle]="{color}"
        class="text-black-outline-xs self-center font-bold"
        id="Card-Type"
      >
        {{ card.cardType }}
      </p>
      <div
        *ngIf="card.cardType === 'Digimon' || card.cardType === 'Digi-Egg'"
        [ngStyle]="{backgroundColor}"
        class="my-2 inline-block rounded-full px-6 py-2.5 leading-tight shadow-md"
        id="Digimon-Lv"
      >
        <p class="font-bold leading-[5px] text-white">
          {{ card.cardLv }}
        </p>
      </div>
      <p
        [ngStyle]="{color}"
        class="text-black-outline-xs self-center font-bold"
        id="Card-Version"
      >
        {{ version }}
      </p>
      <button
        (click)="this.onClose.next(false)"
        class="p-button-text"
        icon="pi pi-times"
        pButton
        pRipple
        type="button"
      ></button>
    </div>

    <div class="flex flex-row">
      <button class="mr-1" (click)="previousCard()">
        <i class="fa-solid fa-circle-arrow-left text-white"></i>
      </button>
      <h1
        [ngStyle]="{color}"
        class="text-black-outline-xs my-1 text-3xl font-black"
        id="Card-Name"
      >
        {{ card.name }}
      </h1>
      <button
        (click)="openWiki()"
        class="p-button-text"
        icon="pi pi-question-circle"
        pButton
        pRipple
        type="button"
      ></button>
      <button class="ml-1" (click)="nextCard()">
        <i class="fa-solid fa-circle-arrow-right text-white"></i>
      </button>
    </div>

    <div class="flex w-full flex-row" id="Image-Attributes">
      <div class="w-1/2">
        <img
          [lazyLoad]="this.png"
          alt="{{ imageAlt }}"
          defaultImage="assets/images/digimon-card-back.webp"
        />
      </div>
      <div class="max-w-1/2 w-1/2 self-center pl-2">
        <div
          *ngIf="inDeck()"
          class="my-0.5 flex w-full flex-row rounded-full border border-slate-200 backdrop-brightness-150"
          id="Digimon-Deck-Count"
        >
          <p
            [ngStyle]="{color}"
            class="text-black-outline-xs ml-1.5 text-lg font-extrabold"
          >
            In Deck
          </p>
          <p class="font-white ml-auto mr-1.5 font-bold">{{ deckCount() }}x</p>
        </div>
        <div
          *ngIf="card.form !== '-'"
          class="my-0.5 flex w-full flex-row rounded-full border border-slate-200 backdrop-brightness-150"
          id="Digimon-Form"
        >
          <p
            [ngStyle]="{color}"
            class="text-black-outline-xs ml-1.5 text-lg font-extrabold"
          >
            Form
          </p>
          <p class="font-white ml-auto mr-1.5 font-bold">{{ card.form }}</p>
        </div>
        <div
          *ngIf="card.attribute !== '-'"
          class="my-0.5 flex w-full flex-row rounded-full border border-slate-200 backdrop-brightness-150"
          id="Digimon-Attribute"
        >
          <p
            [ngStyle]="{color}"
            class="text-black-outline-xs ml-1.5 text-lg font-extrabold"
          >
            Attribute
          </p>
          <p class="font-white ml-auto mr-1.5 text-lg font-bold">
            {{ card.attribute }}
          </p>
        </div>
        <div
          *ngIf="card.type !== '-'"
          class="my-0.5 flex w-full flex-row rounded-full border border-slate-200 backdrop-brightness-150"
          id="Digimon-Type"
        >
          <p
            [ngStyle]="{color}"
            class="text-black-outline-xs ml-1.5 text-lg font-extrabold"
          >
            Type
          </p>
          <p class="font-white ml-auto mr-1.5 font-bold">{{ card.type }}</p>
        </div>
        <div
          *ngIf="card.dp !== '-'"
          class="my-0.5 flex w-full flex-row rounded-full border border-slate-200 backdrop-brightness-150"
          id="Digimon-DP"
        >
          <p
            [ngStyle]="{color}"
            class="text-black-outline-xs ml-1.5 text-lg font-extrabold"
          >
            DP
          </p>
          <p class="font-white ml-auto mr-1.5 font-bold">{{ card.dp }}</p>
        </div>
        <div
          *ngIf="card.playCost !== '-'"
          class="my-0.5 flex w-full flex-row rounded-full border border-slate-200 backdrop-brightness-150"
          id="Digimon-Play-Cost"
        >
          <p
            [ngStyle]="{color}"
            class="text-black-outline-xs ml-1.5 text-lg font-extrabold"
          >
            Play Cost
          </p>
          <p class="font-white ml-auto mr-1.5 font-bold">{{ card.playCost }}</p>
        </div>
        <div
          *ngIf="card.digivolveCost1 !== '-'"
          class="my-0.5 flex w-full flex-row rounded-full border border-slate-200 backdrop-brightness-150"
          id="Digimon-Digivolve-Cost-1"
        >
          <p
            [ngStyle]="{color}"
            class="text-black-outline-xs ml-1.5 text-lg font-extrabold"
          >
            Digivolve Cost 1
          </p>
          <p class="font-white ml-auto mr-1.5 font-bold">
            {{ card.digivolveCost1 }}
          </p>
        </div>
        <div
          *ngIf="card.digivolveCost2 !== '-'"
          class="my-0.5 flex w-full flex-row rounded-full border border-slate-200 backdrop-brightness-150"
          id="Digimon-Digivolve-Cost-2"
        >
          <p
            [ngStyle]="{color}"
            class="text-black-outline-xs ml-1.5 text-lg font-extrabold"
          >
            Digivolve Cost 2
          </p>
          <p class="font-white ml-auto mr-1.5 font-bold">
            {{ card.digivolveCost2 }}
          </p>
        </div>
        <div
          *ngIf="card.specialDigivolve !== '-'"
          class="my-0.5 flex w-full flex-col rounded-full"
          id="Digimon-Special-Digivolve"
        >
          <p
            [ngStyle]="{color}"
            class="text-black-outline-xs text-lg font-extrabold"
          >
            Special Digivolve
          </p>
          <p class="font-white whitespace-pre-wrap font-bold">
            {{ card.specialDigivolve }}
          </p>
        </div>
        <div
          *ngIf="card.dnaDigivolve !== '-'"
          class="my-0.5 flex w-full flex-col rounded-full"
          id="Digimon-DNA-Digivolve"
        >
          <p
            [ngStyle]="{color}"
            class="text-black-outline-xs text-lg font-extrabold"
          >
            DNA Digivolve
          </p>
          <p class="font-white whitespace-pre-wrap font-bold">
            {{ card.dnaDigivolve }}
          </p>
        </div>
        <div
          *ngIf="card.digiXros !== '-'"
          class="my-0.5 flex w-full flex-col rounded-full"
          id="Digimon-DigiXros"
        >
          <p
            [ngStyle]="{color}"
            class="text-black-outline-xs text-lg font-extrabold"
          >
            DigiXros
          </p>
          <p class="font-white whitespace-pre-wrap font-bold">
            {{ card.digiXros }}
          </p>
        </div>
      </div>
    </div>

    <div class="max-w-full" id="Effects">
      <div
        *ngIf="card.effect !== '-'"
        class="flex flex-col"
        id="Digimon-Effect"
      >
        <p
          [ngStyle]="{color}"
          class="text-black-outline-xs text-lg font-extrabold"
        >
          Effect
        </p>
        <p class="font-white whitespace-pre-wrap font-bold">
          {{ card.effect }}
        </p>
      </div>
      <div
        *ngIf="card.digivolveEffect !== '-'"
        class="flex flex-col"
        id="Digimon-Digivolve-Effect"
      >
        <p
          [ngStyle]="{color}"
          class="text-black-outline-xs text-lg font-extrabold"
        >
          Inherited effect
        </p>
        <p class="font-white whitespace-pre-wrap font-bold">
          {{ card.digivolveEffect }}
        </p>
      </div>
      <div
        *ngIf="card.securityEffect !== '-'"
        class="flex flex-col"
        id="Security-Effect"
      >
        <p
          [ngStyle]="{color}"
          class="text-black-outline-xs text-lg font-extrabold"
        >
          Security effect
        </p>
        <p class="font-white whitespace-pre-wrap font-bold">
          {{ card.securityEffect }}
        </p>
      </div>
    </div>

    <div *ngIf="card.restriction !== '-'" class="max-w-full" id="Restriction">
      <div class="flex flex-col" id="Card-Restriction">
        <p
          [ngStyle]="{color}"
          class="text-black-outline-xs text-lg font-extrabold"
        >
          Restriction
        </p>
        <p class="font-white font-bold">{{ card.restriction }}</p>
      </div>
    </div>

    <div class="max-w-full" id="Notes">
      <div class="flex flex-col" id="Card-Notes">
        <p
          [ngStyle]="{color}"
          class="text-black-outline-xs text-lg font-extrabold"
        >
          Notes
        </p>
        <p class="font-white font-bold">{{ card.notes }}</p>
      </div>
    </div>

    <div *ngIf="card.illustrator !== ''" class="max-w-full" id="Illustrator">
      <div class="flex flex-col" id="Card-Illustrator">
        <p
          [ngStyle]="{color}"
          class="text-black-outline-xs text-lg font-extrabold"
        >
          Illustrator
        </p>
        <div class="flex flex-row">
          <p class="font-white font-bold">{{ card.illustrator }}</p>
          <button
            (click)="openWikiIllustrator()"
            class="p-button-text"
            icon="pi pi-question-circle"
            pButton
            pRipple
            type="button"
          ></button>
        </div>
      </div>
    </div>
  </div> `,
})
export class ViewCardDialogComponent implements OnInit, OnChanges, OnDestroy {
  @Input() show: boolean = false;
  @Input() card: ICard = englishCards[0];

  @Input() width?: string = '50vw';

  @Output() onClose = new EventEmitter<boolean>();

  allCards: ICard[] = [];

  png: string;
  imageAlt: string;

  color: string;
  backgroundColor: string;
  colorMap = ColorMap;

  version: string;
  versionMap = new Map<string, string>([
    ['Normal', 'Normal'],
    ['AA', 'Alternative Art'],
    ['Stamp', 'Stamped'],
  ]);

  type: string;

  deck: IDeck;

  private onDestroy$ = new Subject();

  constructor(private store: Store) {}

  ngOnInit() {
    if (this.card) {
      this.setupView(this.card);
    }
    this.store
      .select(selectDeck)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((deck) => (this.deck = deck));

    this.store
      .select(selectFilteredCards)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((cards) => (this.allCards = cards));
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes['card']) {
      const card: ICard = changes['card'].currentValue;
      this.setupView(card);
    }
  }

  setupView(card: ICard) {
    this.color = this.colorMap.get(card.color)!;
    this.backgroundColor = this.color;
    this.version = this.versionMap.get(card.version)!;
    this.png = card.cardImage;
    this.imageAlt = card.cardNumber + ' ' + card.name;
    this.type = card?.cardType;
  }

  getPNG(cardSRC: string): string {
    let engRegExp = new RegExp('\\beng\\b');
    let japRegExp = new RegExp('\\bjap\\b');
    let preReleaseRegExp = new RegExp('\\bpre-release\\b');

    if (engRegExp.test(cardSRC)) {
      return cardSRC
        .replace(engRegExp, 'eng/png')
        .replace(new RegExp('\\b.webp\\b'), '.png');
    } else if (japRegExp.test(cardSRC)) {
      return cardSRC
        .replace(japRegExp, 'jap/png')
        .replace(new RegExp('\\b.webp\\b'), '.png');
    } else {
      return cardSRC
        .replace(preReleaseRegExp, 'pre-release/png')
        .replace(new RegExp('\\b.webp\\b'), '.png');
    }
  }

  openWiki() {
    const wikiLink =
      'https://digimoncardgame.fandom.com/wiki/' + formatId(this.card.id);
    window.open(wikiLink, '_blank');
  }

  openWikiIllustrator() {
    const wikiLink =
      'https://digimoncardgame.fandom.com/wiki/' + this.card.illustrator;
    window.open(wikiLink, '_blank');
  }

  inDeck(): boolean {
    return !!this.deck.cards.find((card) => card.id === this.card.id);
  }

  deckCount(): number {
    const card = this.deck.cards.find((card) => card.id === this.card.id);
    return card?.count ?? 0;
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.key == 'ArrowRight') {
      this.nextCard();
    }
    if (event.key == 'ArrowLeft') {
      this.previousCard();
    }
  }

  previousCard() {
    const id = this.allCards.findIndex((card) => this.card.id === card.id);
    if (id === -1 || id === 0) {
      return;
    }
    const newCard = this.allCards[id - 1];
    if (!newCard) {
      return;
    }
    this.card = newCard;
    this.setupView(newCard);
  }

  nextCard() {
    const id = this.allCards.findIndex((card) => this.card.id === card.id);
    if (id === -1 || id === this.allCards.length + 1) {
      return;
    }
    const newCard = this.allCards[id + 1];
    if (!newCard) {
      return;
    }
    this.card = newCard;
    this.setupView(newCard);
  }
}
