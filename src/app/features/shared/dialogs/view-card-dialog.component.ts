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
import { map, Subject, takeUntil } from 'rxjs';
import { englishCards } from '../../../../assets/cardlists/eng/english';
import { ICard, IDeck } from '../../../../models';
import { ColorMap } from '../../../../models/maps/color.map';
import { formatId } from '../../../functions/digimon-card.functions';
import {
  selectCollection,
  selectCollectionMode,
  selectDeck,
  selectFilteredCards,
} from '../../../store/digimon.selectors';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { NgStyle, NgIf, NgClass, AsyncPipe } from '@angular/common';

@Component({
  selector: 'digimon-view-card-dialog',
  template: `
    <div class="h-full w-full min-w-full max-w-full overflow-x-hidden md:w-[700px] md:min-w-[700px] md:max-w-[700px]">
      <div class="align-center min-h-10 mt-1 inline-flex w-full justify-between border-b border-slate-200" id="Header">
        <div
          class="align-center my-3 inline-flex h-full flex-grow flex-wrap justify-between gap-[.5rem] md:my-2 md:flex-nowrap">
          <p class="self-center font-bold text-gray-500" id="Card-Number">
            {{ card.cardNumber }}
          </p>
          <p class="self-center font-bold uppercase text-[#e2e4e6]" id="Card-Rarity">
            {{ card.rarity }}
          </p>
          <p class="self-center font-bold uppercase text-[#e2e4e6]" id="Card-Block">
            {{ card.block }}
          </p>
          <p [ngStyle]="{color}" class="text-black-outline-xs self-center font-bold" id="Card-Type">
            {{ card.cardType }}
          </p>
          <div
            *ngIf="card.cardType === 'Digimon' || card.cardType === 'Digi-Egg'"
            [ngStyle]="{backgroundColor}"
            class="inline-block rounded-full px-6 py-2.5 leading-tight shadow-md"
            id="Digimon-Lv">
            <p
              class="font-bold leading-[5px] text-[#e2e4e6]"
              [ngClass]="{ 'text-black': this.card.color === 'Yellow' }">
              {{ card.cardLv }}
            </p>
          </div>
          <p [ngStyle]="{color}" class="text-black-outline-xs hidden self-center font-bold lg:flex" id="Card-Version">
            {{ version }}
          </p>
          <p [ngStyle]="{color}" class="text-black-outline-xs self-center font-bold lg:hidden" id="Card-Version">
            {{ card.version }}
          </p>
        </div>
        <button
          (click)="this.onClose.next(false)"
          class="p-button-text ml-4 flex-shrink-0 md:ml-6"
          icon="pi pi-times"
          pButton
          pRipple
          type="button"></button>
      </div>

      <div class="flex flex-row">
        <button class="mr-1" (click)="previousCard()">
          <i class="fa-solid fa-circle-arrow-left text-[#e2e4e6]"></i>
        </button>
        <h1 [ngStyle]="{color}" class="text-black-outline-xs my-1 text-3xl font-black" id="Card-Name">
          {{ card.name }}
        </h1>
        <button
          (click)="openWiki()"
          class="p-button-text"
          icon="pi pi-question-circle"
          pButton
          pRipple
          type="button"></button>
        <button class="ml-1" (click)="nextCard()">
          <i class="fa-solid fa-circle-arrow-right text-[#e2e4e6]"></i>
        </button>
      </div>

      <div class="w-full flex-row md:flex" id="Image-Attributes">
        <div class="w-full md:w-1/2">
          <img
            [lazyLoad]="this.png"
            alt="{{ imageAlt }}"
            defaultImage="assets/images/digimon-card-back.webp"
            class="mx-auto my-5 max-w-[15rem] md:my-0 md:max-w-full" />
        </div>
        <div class="md:max-w-1/2 w-full self-center md:w-1/2 md:pl-2">
          <div
            *ngIf="inDeck()"
            class="my-0.5 flex w-full flex-row rounded-full border border-slate-200 backdrop-brightness-150"
            id="Digimon-Deck-Count">
            <p [ngStyle]="{color}" class="text-black-outline-xs ml-1.5 text-lg font-extrabold">In Deck</p>
            <p class="font-white ml-auto mr-1.5 font-bold leading-[1.7em]">{{ deckCount() }}x</p>
          </div>
          <div
            *ngIf="collectionMode$ | async"
            class="my-0.5 flex w-full flex-row rounded-full border border-slate-200 backdrop-brightness-150"
            id="Digimon-Deck-Count">
            <p [ngStyle]="{color}" class="text-black-outline-xs ml-1.5 text-lg font-extrabold">In Collection</p>
            <p
              *ngIf="collectionCard$ | async as collectionCard"
              class="font-white ml-auto mr-1.5 font-bold leading-[1.7em]">
              {{ collectionCard.count }}x
            </p>
          </div>
          <div
            *ngIf="card.form !== '-'"
            class="my-0.5 flex w-full flex-row rounded-full border border-slate-200 backdrop-brightness-150"
            id="Digimon-Form">
            <p [ngStyle]="{color}" class="text-black-outline-xs ml-1.5 text-lg font-extrabold">Form</p>
            <p class="font-white ml-auto mr-1.5 font-bold leading-[1.7em]">
              {{ card.form }}
            </p>
          </div>
          <div
            *ngIf="card.attribute !== '-'"
            class="my-0.5 flex w-full flex-row rounded-full border border-slate-200 backdrop-brightness-150"
            id="Digimon-Attribute">
            <p [ngStyle]="{color}" class="text-black-outline-xs ml-1.5 text-lg font-extrabold">Attribute</p>
            <p class="font-white ml-auto mr-1.5 font-bold leading-[1.7em]">
              {{ card.attribute }}
            </p>
          </div>
          <div
            *ngIf="card.type !== '-'"
            class="my-0.5 flex w-full flex-row rounded-full border border-slate-200 backdrop-brightness-150"
            id="Digimon-Type">
            <p [ngStyle]="{color}" class="text-black-outline-xs ml-1.5 text-lg font-extrabold">Type</p>
            <p class="font-white ml-auto mr-1.5 font-bold leading-[1.7em]">
              {{ card.type }}
            </p>
          </div>
          <div
            *ngIf="card.dp !== '-'"
            class="my-0.5 flex w-full flex-row rounded-full border border-slate-200 backdrop-brightness-150"
            id="Digimon-DP">
            <p [ngStyle]="{color}" class="text-black-outline-xs ml-1.5 text-lg font-extrabold">DP</p>
            <p class="font-white ml-auto mr-1.5 font-bold leading-[1.7em]">
              {{ card.dp }}
            </p>
          </div>
          <div
            *ngIf="card.playCost !== '-'"
            class="my-0.5 flex w-full flex-row rounded-full border border-slate-200 backdrop-brightness-150"
            id="Digimon-Play-Cost">
            <p [ngStyle]="{color}" class="text-black-outline-xs ml-1.5 text-lg font-extrabold">Play Cost</p>
            <p class="font-white ml-auto mr-1.5 font-bold leading-[1.7em]">
              {{ card.playCost }}
            </p>
          </div>
          <div
            *ngIf="card.digivolveCost1 !== '-'"
            class="my-0.5 flex w-full flex-row rounded-full border border-slate-200 backdrop-brightness-150"
            id="Digimon-Digivolve-Cost-1">
            <p [ngStyle]="{color}" class="text-black-outline-xs ml-1.5 text-lg font-extrabold">Digivolve Cost 1</p>
            <p class="font-white ml-auto mr-1.5 font-bold leading-[1.7em]">
              {{ card.digivolveCost1 }}
            </p>
          </div>
          <div
            *ngIf="card.digivolveCost2 !== '-'"
            class="my-0.5 flex w-full flex-row rounded-full border border-slate-200 backdrop-brightness-150"
            id="Digimon-Digivolve-Cost-2">
            <p [ngStyle]="{color}" class="text-black-outline-xs ml-1.5 text-lg font-extrabold">Digivolve Cost 2</p>
            <p class="font-white ml-auto mr-1.5 font-bold leading-[1.7em]">
              {{ card.digivolveCost2 }}
            </p>
          </div>
          <div
            *ngIf="card.specialDigivolve !== '-'"
            class="my-0.5 flex w-full flex-col rounded-full"
            id="Digimon-Special-Digivolve">
            <p [ngStyle]="{color}" class="text-black-outline-xs text-lg font-extrabold">Special Digivolve</p>
            <span
              class="font-white whitespace-pre-wrap font-bold leading-[1.7em]"
              [innerHTML]="replaceWithImageTags(card.specialDigivolve)">
            </span>
          </div>
          <div
            *ngIf="card.dnaDigivolve !== '-'"
            class="my-0.5 flex w-full flex-col rounded-full"
            id="Digimon-DNA-Digivolve">
            <p [ngStyle]="{color}" class="text-black-outline-xs text-lg font-extrabold">DNA Digivolve</p>
            <span
              class="font-white whitespace-pre-wrap font-bold leading-[1.7em]"
              [innerHTML]="replaceWithImageTags(card.dnaDigivolve)">
            </span>
          </div>
          <div *ngIf="card.digiXros !== '-'" class="my-0.5 flex w-full flex-col rounded-full" id="Digimon-DigiXros">
            <p [ngStyle]="{color}" class="text-black-outline-xs text-lg font-extrabold">DigiXros</p>
            <p
              class="font-white whitespace-pre-wrap font-bold leading-[1.7em]"
              [innerHTML]="replaceWithImageTags(card.digiXros)"></p>
          </div>
          <div
            *ngIf="card.aceEffect && card.aceEffect !== '-'"
            class="my-0.5 flex w-full flex-col rounded-full"
            id="Digimon-ACE">
            <p [ngStyle]="{color}" class="text-black-outline-xs text-lg font-extrabold">ACE</p>
            <span
              class="font-white whitespace-pre-wrap font-bold leading-[1.7em]"
              [innerHTML]="replaceWithImageTags(card.aceEffect)">
            </span>
          </div>
        </div>
      </div>

      <div class="my-4 max-w-full" id="Effects">
        <div *ngIf="card.effect !== '-'" class="flex flex-col" id="Digimon-Effect">
          <p [ngStyle]="{color}" class="text-black-outline-xs text-lg font-extrabold">Effect</p>
          <span class="font-white whitespace-pre-wrap font-bold" [innerHTML]="replaceWithImageTags(card.effect)"></span>
        </div>

        <div *ngIf="card.digivolveEffect !== '-'" class="flex flex-col" id="Digimon-Digivolve-Effect">
          <p [ngStyle]="{color}" class="text-black-outline-xs text-lg font-extrabold">Inherited effect</p>
          <span
            class="font-white whitespace-pre-wrap font-bold"
            [innerHTML]="replaceWithImageTags(card.digivolveEffect)"></span>
        </div>

        <div *ngIf="card.securityEffect !== '-'" class="flex flex-col" id="Security-Effect">
          <p [ngStyle]="{color}" class="text-black-outline-xs text-lg font-extrabold">Security effect</p>
          <div
            class="font-white flex flex-row whitespace-pre-wrap font-bold"
            [innerHTML]="replaceWithImageTags(card.securityEffect)"></div>
        </div>
      </div>

      <div *ngIf="card.restriction !== '-'" class="my-4 max-w-full" id="Restriction">
        <div class="flex flex-col" id="Card-Restriction">
          <p [ngStyle]="{color}" class="text-black-outline-xs text-lg font-extrabold">Restriction</p>
          <p class="font-white font-bold">{{ card.restriction }}</p>
        </div>
      </div>

      <div class="my-4 max-w-full" id="Notes">
        <div class="flex flex-col" id="Card-Notes">
          <p [ngStyle]="{color}" class="text-black-outline-xs text-lg font-extrabold">Notes</p>
          <p class="font-white font-bold">{{ card.notes }}</p>
        </div>
      </div>

      <div *ngIf="card.illustrator !== ''" class="my-4 max-w-full" id="Illustrator">
        <div class="flex flex-col" id="Card-Illustrator">
          <p [ngStyle]="{color}" class="text-black-outline-xs text-lg font-extrabold">Illustrator</p>
          <div class="flex flex-row">
            <p class="font-white font-bold">{{ card.illustrator }}</p>
            <button
              (click)="openWikiIllustrator()"
              class="p-button-text -mt-2"
              icon="pi pi-question-circle"
              pButton
              pRipple
              type="button"></button>
          </div>
        </div>
      </div>
    </div>
  `,
  standalone: true,
  imports: [NgStyle, NgIf, NgClass, ButtonModule, RippleModule, LazyLoadImageModule, AsyncPipe],
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

  collectionMode$ = this.store.select(selectCollectionMode);
  collectionCard$ = this.store
    .select(selectCollection)
    .pipe(map((cards) => cards.find((colCard) => colCard.id === this.card.id)));

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

      this.collectionCard$ = this.store
        .select(selectCollection)
        .pipe(map((cards) => cards.find((colCard) => colCard.id === this.card.id)));
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
      return cardSRC.replace(engRegExp, 'eng/png').replace(new RegExp('\\b.webp\\b'), '.png');
    } else if (japRegExp.test(cardSRC)) {
      return cardSRC.replace(japRegExp, 'jap/png').replace(new RegExp('\\b.webp\\b'), '.png');
    } else {
      return cardSRC.replace(preReleaseRegExp, 'pre-release/png').replace(new RegExp('\\b.webp\\b'), '.png');
    }
  }

  openWiki() {
    const wikiLink = 'https://digimoncardgame.fandom.com/wiki/' + formatId(this.card.id);
    window.open(wikiLink, '_blank');
  }

  openWikiIllustrator() {
    const wikiLink = 'https://digimoncardgame.fandom.com/wiki/' + this.card.illustrator;
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

  replaceWithImageTags(effect: string): string {
    let replacedText = effect.replace(
      '[All Turns]',
      '<img class="inline h-4" src="assets/images/keywords/all_turns.webp"/>'
    );
    replacedText = replacedText.replace(
      '＜Alliance＞',
      '<img class="inline h-4" src="assets/images/keywords/alliance.webp"/>'
    );
    replacedText = replacedText.replace(
      '＜Armor Purge＞',
      '<img class="inline h-4" src="assets/images/keywords/armor_purge.webp"/>'
    );
    replacedText = replacedText.replace(
      '＜Blitz＞',
      '<img class="inline h-4" src="assets/images/keywords/blitz.webp"/>'
    );
    replacedText = replacedText.replace(
      '＜Blocker＞',
      '<img class="inline h-4" src="assets/images/keywords/blocker.webp"/>'
    );
    replacedText = replacedText.replace(
      '＜Decoy [Bagra Army] traits＞',
      '<img class="inline h-4" src="assets/images/keywords/decoy_bagra_army.webp"/>'
    );
    replacedText = replacedText.replace(
      '＜Decoy (Black)＞',
      '<img class="inline h-4" src="assets/images/keywords/decoy_black.webp"/>'
    );
    replacedText = replacedText.replace(
      '＜Decoy (Black/White)＞',
      '<img class="inline h-4" src="assets/images/keywords/decoy_black_white.webp"/>'
    );
    replacedText = replacedText.replace(
      '＜Decoy [D-Brigade] traits＞',
      '<img class="inline h-4" src="assets/images/keywords/decoy_d-brigate.webp"/>'
    );
    replacedText = replacedText.replace(
      '＜Decoy (Red/Black)＞',
      '<img class="inline h-4" src="assets/images/keywords/decoy_red_black.webp"/>'
    );
    replacedText = replacedText.replace(
      '＜De-Digivolve  1＞',
      '<img class="inline h-4" src="assets/images/keywords/de-digivolve_1.webp"/>'
    );
    replacedText = replacedText.replace(
      '＜De-Digivolve  2＞',
      '<img class="inline h-4" src="assets/images/keywords/de-digivolve_2.webp"/>'
    );
    replacedText = replacedText.replace(
      '＜De-Digivolve  3＞',
      '<img class="inline h-4" src="assets/images/keywords/de-digivolve_3.webp"/>'
    );
    replacedText = replacedText.replace(
      '＜De-Digivolve  4＞',
      '<img class="inline h-4" src="assets/images/keywords/de-digivolve_4.webp"/>'
    );
    replacedText = replacedText.replace(
      '＜Delay＞',
      '<img class="inline h-4" src="assets/images/keywords/delay.webp"/>'
    );
    replacedText = replacedText.replace(
      '＜Delay＞',
      '<img class="inline h-4" src="assets/images/keywords/delay.webp"/>'
    );
    replacedText = replacedText.replace(
      '＜Digi-Burst＞',
      '<img class="inline h-4" src="assets/images/keywords/digi-burst_1.webp"/>'
    );
    replacedText = replacedText.replace(
      '＜Digi-Burst 1＞',
      '<img class="inline h-4" src="assets/images/keywords/digi-burst_1.webp"/>'
    );
    replacedText = replacedText.replace(
      '＜Digi-Burst 2＞',
      '<img class="inline h-4" src="assets/images/keywords/digi-burst_2.webp"/>'
    );
    replacedText = replacedText.replace(
      '＜Digi-Burst 3＞',
      '<img class="inline h-4" src="assets/images/keywords/digi-burst_3.webp"/>'
    );
    replacedText = replacedText.replace(
      '＜Digi-Burst 4＞',
      '<img class="inline h-4" src="assets/images/keywords/digi-burst_4.webp"/>'
    );
    replacedText = replacedText.replace(
      '＜Digi-Burst up to 4＞',
      '<img class="inline h-4" src="assets/images/keywords/digi-burst_up_to_4.webp"/>'
    );
    replacedText = replacedText.replace(
      '＜Digisorption -1＞',
      '<img class="inline h-4" src="assets/images/keywords/digisorption_-1.webp"/>'
    );
    replacedText = replacedText.replace(
      '＜Digisorption -2＞',
      '<img class="inline h-4" src="assets/images/keywords/digisorption_-2.webp"/>'
    );
    replacedText = replacedText.replace(
      '＜Digisorption -3＞',
      '<img class="inline h-4" src="assets/images/keywords/digisorption_-3.webp"/>'
    );
    replacedText = replacedText.replace(
      '＜Draw 1＞',
      '<img class="inline h-4" src="assets/images/keywords/draw_1.webp"/>'
    );
    replacedText = replacedText.replace(
      '＜Draw 2＞',
      '<img class="inline h-4" src="assets/images/keywords/draw_2.webp"/>'
    );
    replacedText = replacedText.replace(
      '＜Draw 3＞',
      '<img class="inline h-4" src="assets/images/keywords/draw_3.webp"/>'
    );
    replacedText = replacedText.replace(
      '[End of Attack]',
      '<img class="inline h-4" src="assets/images/keywords/end_of_attack.webp"/>'
    );
    replacedText = replacedText.replace(
      "[End of Opponent's Turn]",
      '<img class="inline h-4" src="assets/images/keywords/end_of_opponents_turn.webp"/>'
    );
    replacedText = replacedText.replace(
      '[End of your Turn]',
      '<img class="inline h-4" src="assets/images/keywords/end_of_your_turn.webp"/>'
    );
    replacedText = replacedText.replace(
      '＜Evade＞',
      '<img class="inline h-4" src="assets/images/keywords/delay.webp"/>'
    );
    replacedText = replacedText.replace('[Hand]', '<img class="inline h-4" src="assets/images/keywords/hand.webp"/>');
    replacedText = replacedText.replace('[Main]', '<img class="inline h-4" src="assets/images/keywords/main.webp"/>');
    replacedText = replacedText.replace(
      '＜Jamming＞',
      '<img class="inline h-4" src="assets/images/keywords/delay.webp"/>'
    );
    replacedText = replacedText.replace(
      '＜Material Save 1＞',
      '<img class="inline h-4" src="assets/images/keywords/material_save_1.webp"/>'
    );
    replacedText = replacedText.replace(
      '＜Material Save 2＞',
      '<img class="inline h-4" src="assets/images/keywords/material_save_2.webp"/>'
    );
    replacedText = replacedText.replace(
      '＜Material Save 3＞',
      '<img class="inline h-4" src="assets/images/keywords/material_save_3.webp"/>'
    );
    replacedText = replacedText.replace(
      '＜Material Save 4＞',
      '<img class="inline h-4" src="assets/images/keywords/material_save_4.webp"/>'
    );
    replacedText = replacedText.replace(
      '[On Deletion]',
      '<img class="inline h-4" src="assets/images/keywords/on_deletion.webp"/>'
    );
    replacedText = replacedText.replace(
      '[On Play]',
      '<img class="inline h-4" src="assets/images/keywords/on_play.webp"/>'
    );
    replacedText = replacedText.replace(
      '[Once Per Turn]',
      '<img class="inline h-4" src="assets/images/keywords/once_per_turn.webp"/>'
    );
    replacedText = replacedText.replace(
      "[Opponent's Turn]",
      '<img class="inline h-4" src="assets/images/keywords/opponents_turn.webp"/>'
    );
    replacedText = replacedText.replace(
      '＜Piercing＞',
      '<img class="inline h-4" src="assets/images/keywords/piercing.webp"/>'
    );
    replacedText = replacedText.replace('＜Raid＞', '<img class="inline h-4" src="assets/images/keywords/raid.webp"/>');
    replacedText = replacedText.replace(
      '＜Reboot＞',
      '<img class="inline h-4" src="assets/images/keywords/reboot.webp"/>'
    );
    replacedText = replacedText.replace(
      '＜Recovery +1 (Deck)＞',
      '<img class="inline h-4" src="assets/images/keywords/recovery_+1deck.webp"/>'
    );
    replacedText = replacedText.replace(
      '＜Recovery +2 (Deck)＞',
      '<img class="inline h-4" src="assets/images/keywords/recovery_+2deck.webp"/>'
    );
    replacedText = replacedText.replace(
      '＜Retaliation＞',
      '<img class="inline h-4" src="assets/images/keywords/retaliation.webp"/>'
    );
    replacedText = replacedText.replace('＜Rush＞', '<img class="inline h-4" src="assets/images/keywords/rush.webp"/>');
    replacedText = replacedText.replace('＜Save＞', '<img class="inline h-4" src="assets/images/keywords/save.webp"/>');
    replacedText = replacedText.replace(
      '[Security]',
      '<img class="inline h-4" src="assets/images/keywords/security.webp"/>'
    );
    replacedText = replacedText.replace(
      '＜Security Attack -1＞',
      '<img class="inline h-4" src="assets/images/keywords/security_attack_-1.webp"/>'
    );
    replacedText = replacedText.replace(
      '＜Security Attack +1＞',
      '<img class="inline h-4" src="assets/images/keywords/security_attack_+1.webp"/>'
    );
    replacedText = replacedText.replace(
      '＜Security Attack +2＞',
      '<img class="inline h-4" src="assets/images/keywords/security_attack_+2.webp"/>'
    );
    replacedText = replacedText.replace(
      '＜Security Attack -2＞',
      '<img class="inline h-4" src="assets/images/keywords/security_attack_-2.webp"/>'
    );
    replacedText = replacedText.replace(
      '＜Security Attack -3＞',
      '<img class="inline h-4" src="assets/images/keywords/security_attack_-_3.webp"/>'
    );
    replacedText = replacedText.replace(
      '[Start of your Main Phase]',
      '<img class="inline h-4" src="assets/images/keywords/start_of_your_main_phase.webp"/>'
    );
    replacedText = replacedText.replace(
      '[Start of your Turn]',
      '<img class="inline h-4" src="assets/images/keywords/start_of_your_turn.webp"/>'
    );
    replacedText = replacedText.replace('[Trash]', '<img class="inline h-4" src="assets/images/keywords/trash.webp"/>');
    replacedText = replacedText.replace(
      '[Twice per Turn]',
      '<img class="inline h-4" src="assets/images/keywords/twice_per_turn.webp"/>'
    );
    replacedText = replacedText.replace('[Unite]', '<img class="inline h-4" src="assets/images/keywords/unite.webp"/>');
    replacedText = replacedText.replace(
      '[When Digivolving]',
      '<img class="inline h-4" src="assets/images/keywords/when_digivolving.webp"/>'
    );
    replacedText = replacedText.replace(
      '[When Attacking]',
      '<img class="inline h-4" src="assets/images/keywords/when_attacking.webp"/>'
    );
    replacedText = replacedText.replace(
      '[Your Turn]',
      '<img class="inline h-4" src="assets/images/keywords/your_turn.webp"/>'
    );
    return replacedText;
  }
}
