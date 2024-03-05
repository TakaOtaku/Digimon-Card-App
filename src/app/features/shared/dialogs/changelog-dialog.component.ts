import { Component } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { PanelModule } from 'primeng/panel';

@Component({
  selector: 'digimon-changelog-dialog',
  template: `
    <div>
      <p-panel header="Version 4.1" [toggleable]="true" [collapsed]="false">
        <h1 class="font-bold text-lg underline">Features</h1>
        <ul class="list-disc p-5">
          <li>Added this Changelog Button and Dialog.</li>
          <li>
            When you select Stamp you won't get Pre-Release Cards anymore as
            they have a separate Option.
          </li>
          <li>
            If you select Multi-Color, and two colors you only get Multi-Cards
            that match all colors, e.g. Multi + Red + Purple will filter all
            cards with 2 Colors that are Red and Purple.
          </li>
        </ul>

        <p-divider></p-divider>

        <h1 class="font-bold text-lg underline">Bugfixes</h1>
        <ul class="list-disc p-5"></ul>

        <p-divider></p-divider>

        <h1 class="font-bold text-lg underline">Technical</h1>
        <ul class="list-disc p-5">
          <li>
            Moved away from NGRX Store to a Signal Store, which should improve
            loading and maintainability.
          </li>
          <li>
            Improved the script which updates the community decks each day.
          </li>
          <li>
            Improved the filter functions in preparation to the query search.
          </li>
        </ul>

        <ng-template pTemplate="footer">
          <div
            class="flex flex-wrap align-middle justify-content-between gap-3">
            <span class="ml-auto p-text-secondary">Updated 03.03.2024</span>
          </div>
        </ng-template>
      </p-panel>
    </div>
  `,
  standalone: true,
  imports: [DividerModule, PanelModule],
})
export class ChangelogDialogComponent {}
