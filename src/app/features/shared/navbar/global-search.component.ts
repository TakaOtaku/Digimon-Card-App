import { Component, computed, HostListener, inject, signal } from '@angular/core';
import { ImgFallbackDirective } from '@directives';
import { DigimonCard } from '@models';
import { DialogStore, DigimonCardStore } from '@store';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'digimon-global-search',
  template: `
    <button
      type="button"
      (click)="open()"
      aria-label="Search cards"
      class="flex items-center gap-2 h-10 px-3 rounded-lg border border-line bg-ink-2 text-muted hover:border-accent md:w-56 xl:w-72">
      <i class="pi pi-search"></i>
      <span class="hidden md:inline flex-1 text-left text-sm">Search cards</span>
      <kbd class="hidden md:inline font-mono text-xs border border-line rounded px-1">Ctrl K</kbd>
    </button>

    <p-dialog
      [(visible)]="visible"
      [modal]="true"
      [dismissableMask]="true"
      [showHeader]="false"
      [style]="{ width: '95vw', maxWidth: '36rem' }"
      (onShow)="input.focus()">
      <div class="flex flex-col gap-2 p-3 bg-ink-1">
        <label class="flex items-center gap-2 h-12 px-3 rounded-lg border border-accent bg-ink-2">
          <i class="pi pi-search text-muted"></i>
          <span class="sr-only">Search cards by name or number</span>
          <input
            #input
            type="search"
            placeholder="Card name or number, e.g. Agumon or BT1-010"
            class="flex-1 min-w-0 bg-transparent border-0 outline-none text-fg"
            [value]="query()"
            (input)="query.set($any($event.target).value)"
            (keydown.enter)="results()[0] && view(results()[0])" />
        </label>

        <ul class="m-0 p-0 list-none max-h-[60vh] overflow-y-auto">
          @for (card of results(); track card.id) {
            <li>
              <button type="button" (click)="view(card)" class="w-full flex items-center gap-3 p-2 rounded-lg text-left text-fg hover:bg-ink-2">
                <img [digimonImgFallback]="card.cardImage" alt="" class="w-10 rounded" />
                <span class="flex-1 min-w-0 truncate">{{ card.name.english }}</span>
                <span class="font-mono text-xs text-muted">{{ card.cardNumber }}</span>
              </button>
            </li>
          } @empty {
            @if (query().trim().length >= 2) {
              <li class="p-2 text-sm text-muted">No cards found.</li>
            }
          }
        </ul>
      </div>
    </p-dialog>
  `,
  standalone: true,
  imports: [DialogModule, ImgFallbackDirective],
})
export class GlobalSearchComponent {
  private digimonCardStore = inject(DigimonCardStore);
  private dialogStore = inject(DialogStore);

  visible = false;
  query = signal('');

  // One row per card number; alternate printings share it
  results = computed(() => {
    const q = this.query().trim().toLowerCase();
    if (q.length < 2) return [];
    const seen = new Set<string>();
    const found: DigimonCard[] = [];
    for (const card of this.digimonCardStore.cards()) {
      if (seen.has(card.cardNumber)) continue;
      if (card.cardNumber.toLowerCase().includes(q) || card.name.english.toLowerCase().includes(q)) {
        seen.add(card.cardNumber);
        found.push(card);
        if (found.length === 20) break;
      }
    }
    return found;
  });

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      this.open();
    }
  }

  open() {
    this.visible = true;
  }

  view(card: DigimonCard) {
    this.visible = false;
    this.dialogStore.updateViewCardDialog({ show: true, card, width: '50vw' });
  }
}
