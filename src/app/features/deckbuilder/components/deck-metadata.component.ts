import {
  ChangeDetectionStrategy,
  Component,
  computed,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ColorList, IColor, ITag } from '../../../../models';
import { setColors, setTags } from '../../../functions';
import { ObscenityPipe } from '../../../pipes/obscenity.pipe';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ChipModule } from 'primeng/chip';
import { NgFor, NgClass, NgOptimizedImage } from '@angular/common';
import { DigimonCardStore } from '../../../store/digimon-card.store';
import { WebsiteStore } from '../../../store/website.store';

@Component({
  selector: 'digimon-deck-metadata',
  template: `
    <div class="mb-1 inline-flex w-full px-3">
      <div class="ml-auto mt-2 flex w-1/2 pr-2">
        <p-chip
          class="ml-auto"
          *ngFor="let tag of tags()"
          label="{{ tag.name }}"></p-chip>
      </div>

      <div class="mt-2 w-1/2 pl-1">
        <input
          [ngModel]="this.obscenity.transform(this.title())"
          (ngModelChange)="updateTitle($event)"
          placeholder="Deck Name:"
          class="h-8 w-full text-sm"
          pInputText
          type="text" />
      </div>
    </div>

    <div class="mx-3.5 inline-flex w-full">
      <span class="mr-2 w-full">
        <textarea
          [ngModel]="this.obscenity.transform(this.description())"
          (ngModelChange)="updateDescription($event)"
          placeholder="Description:"
          class="h-[40px] w-full overflow-hidden md:h-[66px]"
          pInputTextarea></textarea>
      </span>
      <div
        class="mr-6 flex h-[40px] w-full flex-row justify-center border border-[#304562] md:h-[66px]">
        <div
          *ngFor="let deckBox of colors"
          class="h-full w-full cursor-pointer"
          [ngClass]="{
            'primary-background': selectedColor().name === deckBox.name,
            'surface-ground': selectedColor().name !== deckBox.name
          }">
          <img [src]="deckBox.img" alt="Deckbox" class="h-full" />
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgFor,
    ChipModule,
    FormsModule,
    InputTextModule,
    InputTextareaModule,
    NgClass,
    NgOptimizedImage,
  ],
})
export class DeckMetadataComponent {
  websiteStore = inject(WebsiteStore);
  digimonCardStore = inject(DigimonCardStore);

  title = computed(() => this.websiteStore.deck().title);
  description = computed(() => this.websiteStore.deck().description);
  tags = computed(() =>
    setTags(this.websiteStore.deck(), this.digimonCardStore.cards()),
  );
  selectedColor = computed(() =>
    setColors(this.websiteStore.deck(), this.digimonCardStore.cards()),
  );

  colors = ColorList;
  obscenity = new ObscenityPipe();

  updateTitle(title: string) {
    this.websiteStore.updateDeckTitle(title);
  }
  updateDescription(description: string) {
    this.websiteStore.updateDeckDescription(description);
  }
}
