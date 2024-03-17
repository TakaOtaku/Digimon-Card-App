import { Component } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { PanelModule } from 'primeng/panel';

@Component({
  selector: 'digimon-changelog-dialog',
  template: `
    <div>
      <p-panel header="Version 4.1.3" [toggleable]="true" [collapsed]="false">
        <h1 class="font-bold text-lg underline">Bugfixes</h1>
        <ul class="list-disc p-5">
          <li>
            With the last change the multi-select filter didn't work as
            intended.
          </li>
        </ul>
        <div class="flex flex-wrap align-middle justify-content-between gap-3">
          <span class="ml-auto p-text-secondary">Updated 17.03.2024</span>
        </div>
      </p-panel>
      <p-panel header="Version 4.1.2" [toggleable]="true" [collapsed]="true">
        <h1 class="font-bold text-lg underline">Bugfixes</h1>
        <ul class="list-disc p-5">
          <li>
            Single Color Filter did not filter cards with more than one color.
          </li>
          <li>
            Couldn't filter in the Multi-Selects e.g. Attribute, Form or Type.
          </li>
        </ul>
        <div class="flex flex-wrap align-middle justify-content-between gap-3">
          <span class="ml-auto p-text-secondary">Updated 09.03.2024</span>
        </div>
      </p-panel>
      <p-panel header="Version 4.1.1" [toggleable]="true" [collapsed]="true">
        <h1 class="font-bold text-lg underline">Bugfixes</h1>
        <ul class="list-disc p-5">
          <li>When switching Collection Mode the Filter was resetting.</li>
          <li>
            The new setting "Collection Filter Max" was undefined if the
            settings weren't saved, thats why cards above 5 were filtered out.
          </li>
        </ul>
        <div class="flex flex-wrap align-middle justify-content-between gap-3">
          <span class="ml-auto p-text-secondary">Updated 08.03.2024</span>
        </div>
      </p-panel>
      <p-panel header="Version 4.1" [toggleable]="true" [collapsed]="true">
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
          <li>
            Added a way to set your default version filter, for all options.
          </li>
          <li>
            Added a Setting to define set your max for the "Number in
            Collection" filter
          </li>
          <li>Added a working Digivolution Cost Filter.</li>
        </ul>

        <p-divider></p-divider>

        <h1 class="font-bold text-lg underline">Bugfixes</h1>
        <ul class="list-disc p-5">
          <li>Saving an empty deck would crash the Profile Page.</li>
          <li>Updated the Mulligan Dialog to the new Mulligan.</li>
        </ul>

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
            <span class="ml-auto p-text-secondary">Updated 06.03.2024</span>
          </div>
        </ng-template>
      </p-panel>
    </div>
  `,
  standalone: true,
  imports: [DividerModule, PanelModule],
})
export class ChangelogDialogComponent {}
