import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ColorList } from '@models';
import { setColors, setTags } from '@functions';
import { ObscenityPipe } from '../../../pipes/obscenity.pipe';
import { TextareaModule } from 'primeng/textarea';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ChipModule } from 'primeng/chip';
import { NgFor, NgClass } from '@angular/common';
import { DigimonCardStore } from '@store';
import { WebsiteStore } from '@store';

@Component({
  selector: 'digimon-deck-metadata',
  template: `
    <div class="mb-2 flex w-full flex-wrap items-center gap-2 px-3 pt-2">
      <label class="min-w-0 flex-[1_1_16rem]">
        <span class="sr-only">Deck name</span>
        <input
          [ngModel]="this.obscenity.transform(this.title())"
          (ngModelChange)="updateTitle($event)"
          placeholder="Untitled deck"
          class="h-11 w-full rounded-lg border border-transparent bg-transparent px-2 font-display text-2xl font-bold text-fg outline-none hover:border-line focus:border-accent"
          type="text" />
      </label>
      <div class="flex flex-wrap gap-1">
        <p-chip class="text-white" *ngFor="let tag of tags()" label="{{ tag.name }}"></p-chip>
      </div>
    </div>

    <div class="mx-3 flex items-stretch gap-2">
      <span class="min-w-0 flex-[2_1_0]">
        <textarea
          [ngModel]="this.obscenity.transform(this.description())"
          (ngModelChange)="updateDescription($event)"
          placeholder="Description (optional)"
          rows="2"
          class="h-14 w-full resize-none overflow-hidden md:h-[66px]"
          pInputTextarea></textarea>
      </span>
      <div class="flex h-14 min-w-0 flex-[1_1_0] flex-row justify-center overflow-hidden rounded-lg border border-line md:h-[66px]">
        <div
          *ngFor="let deckBox of colors"
          class="h-full min-w-0 flex-1"
          [ngClass]="{
            'primary-background': selectedColor().name === deckBox.name,
            'bg-ink-1': selectedColor().name !== deckBox.name,
          }">
          <img [src]="deckBox.img" [alt]="deckBox.name + ' deck box'" class="h-full w-full object-contain" />
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgFor, ChipModule, FormsModule, InputTextModule, TextareaModule, NgClass],
})
export class DeckMetadataComponent {
  websiteStore = inject(WebsiteStore);
  digimonCardStore = inject(DigimonCardStore);

  title = computed(() => this.websiteStore.deck().title);
  description = computed(() => this.websiteStore.deck().description);
  tags = computed(() => setTags(this.websiteStore.deck(), this.digimonCardStore.cards()));
  selectedColor = computed(() => setColors(this.websiteStore.deck(), this.digimonCardStore.cards()));

  colors = ColorList;
  obscenity = new ObscenityPipe();

  updateTitle(title: string) {
    this.websiteStore.updateDeckTitle(title);
  }
  updateDescription(description: string) {
    this.websiteStore.updateDeckDescription(description);
  }
}
