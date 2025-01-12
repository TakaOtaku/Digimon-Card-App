import { Component } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { PanelModule } from 'primeng/panel';

@Component({
  selector: 'digimon-changelog-dialog',
  template: `
    <div>
      <p-panel header="Version 4.1.7" [toggleable]="true" [collapsed]="false">
        <h1 class="font-bold text-lg underline">Feature</h1>
        <ul class="list-disc p-5">
          <li>
            Added support for the new Linked Cards.
          </li>
          <li>
            The Wiki changed where rules are displayed, so they now have a seperate field (Thanks to danweber and SilverDew-sg for offering a Solution on Github)
          </li>
        </ul>
        <div class="flex flex-wrap align-middle justify-content-between gap-3">
          <span class="ml-auto p-text-secondary">Updated 12.01.2025</span>
        </div>
      </p-panel>
      <p-panel header="Version 4.1.6" [toggleable]="true" [collapsed]="true">
        <h1 class="font-bold text-lg underline">Feature</h1>
        <ul class="list-disc p-5">
          <li>
            Added Special Rare and Rare Pull Version. If you have a filter for
            versions set in your settings you have to set them for those as
            well.
          </li>
        </ul>
        <div class="flex flex-wrap align-middle justify-content-between gap-3">
          <span class="ml-auto p-text-secondary">Updated 03.10.2024</span>
        </div>
      </p-panel>
      <p-panel header="Version 4.1.5" [toggleable]="true" [collapsed]="true">
        <h1 class="font-bold text-lg underline">Bugfixes</h1>
        <ul class="list-disc p-5">
          <li>Fixed Collection Export not working</li>
        </ul>
        <div class="flex flex-wrap align-middle justify-content-between gap-3">
          <span class="ml-auto p-text-secondary">Updated 13.08.2024</span>
        </div>
      </p-panel>
      <p-panel header="Version 4.1.4" [toggleable]="true" [collapsed]="true">
        <h1 class="font-bold text-lg underline">Features</h1>
        <ul class="list-disc p-5">
          <li>
            Better readabilty for image export, by reducing the count-text size.
            (Thanks to not-tomo for fixing it)
          </li>
          <li>
            Image Export is now sorted by level. (Thanks to not-tomo for fixing
            it)
          </li>
          <li>
            When the card-view is collapesed, the cards arent as big and its
            better to view all of them.
          </li>
          <li>
            Reduced the size of the Main-Deck Header and Side Deck Header.
          </li>
          <li>Added the newest products</li>
          <li>
            Added a string which displays the current amount of cards displayed.
            (Thanks to Joker for requesting the feature)
          </li>
        </ul>

        <p-divider></p-divider>

        <h1 class="font-bold text-lg underline">Bugfixes</h1>
        <ul class="list-disc p-5">
          <li>
            Fixed Card Count not being updated on change. (Thanks to not-tomo
            for fixing it)
          </li>
        </ul>
        <div class="flex flex-wrap align-middle justify-content-between gap-3">
          <span class="ml-auto p-text-secondary">Updated 01.07.2024</span>
        </div>
      </p-panel>
      <p-panel header="Version 4.1.3" [toggleable]="true" [collapsed]="true">
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
