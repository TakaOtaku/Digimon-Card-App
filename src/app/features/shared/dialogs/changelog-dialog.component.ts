import { Component } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { PanelModule } from 'primeng/panel';

@Component({
  selector: 'digimon-changelog-dialog',
  template: `
    <div>
      <p-panel header="Version 5.0.0" [toggleable]="true" [collapsed]="false">
        <h1 class="font-bold text-lg underline">Features</h1>
        <ul class="list-disc p-5">
          <li>Added Advanced Search functionality with comprehensive filter options</li>
          <li>Introduced new MongoDB backend service with pagination support</li>
          <li>Added Migration Tool for seamless data migration from legacy backend</li>
          <li>Enhanced deck filtering with search capabilities across multiple fields</li>
          <li>Added new pagination component for better deck browsing experience</li>
        </ul>
        <h1 class="font-bold text-lg underline">Technical</h1>
        <ul class="list-disc p-5">
          <li>Migrated from legacy MySQL backend to MongoDB backend</li>
          <li>Removed deprecated services (CardMarket, Database)</li>
          <li>Enhanced Filter Store with advanced search support</li>
          <li>Improved code organization by removing unused tournament deck features</li>
          <li>Added comprehensive migration services for data transfer</li>
          <li>Updated service architecture with MongoBackendService</li>
        </ul>
        <h1 class="font-bold text-lg underline">Removed</h1>
        <ul class="list-disc p-5">
          <li>Removed Tournament Deck submission functionality</li>
          <li>Removed CardMarket pricing integration</li>
          <li>Removed legacy pricing and card market features</li>
          <li>Cleaned up unused interfaces and deprecated code</li>
        </ul>
        <div class="flex flex-wrap align-middle justify-content-between gap-3">
          <span class="ml-auto p-text-secondary">Updated 02.10.2025</span>
        </div>
      </p-panel>
      <p-panel header="Version 4.2.3" [toggleable]="true" [collapsed]="true">
        <h1 class="font-bold text-lg underline">Feature</h1>
        <ul class="list-disc p-5">
          <li>Export Deck Dialog allows all variations</li>
          <li>Added BT23 and LM07</li>
        </ul>
        <h1 class="font-bold text-lg underline">Bugfixes</h1>
        <ul class="list-disc p-5">
          <li>Tierlist was not working</li>
        </ul>
        <div class="flex flex-wrap align-middle justify-content-between gap-3">
          <span class="ml-auto p-text-secondary">Updated 09.06.2025</span>
        </div>
      </p-panel>
      <p-panel header="Version 4.2.2" [toggleable]="true" [collapsed]="true">
        <h1 class="font-bold text-lg underline">Bugfixes</h1>
        <ul class="list-disc p-5">
          <li>Filter Sidebox closing on any click</li>
          <li>Padding on View-Card Dialog was missing, the border was also wrong</li>
          <li>Filter Reset Buttons did not work</li>
          <li>Tooltips were completely white</li>
        </ul>
        <div class="flex flex-wrap align-middle justify-content-between gap-3">
          <span class="ml-auto p-text-secondary">Updated 09.06.2025</span>
        </div>
      </p-panel>
      <p-panel header="Version 4.2.1" [toggleable]="true" [collapsed]="true">
        <h1 class="font-bold text-lg underline">Feature</h1>
        <ul class="list-disc p-5">
          <li>Added a "Delete all Decks" Button for the Players that want to start fresh each Meta.</li>
          <li>Improved the Way you can select the Default Filter in the Settings Dialog</li>
        </ul>
        <h1 class="font-bold text-lg underline">Bugfixes</h1>
        <ul class="list-disc p-5">
          <li>Fixed a bug with the Table Display of your Player Decks</li>
          <li>Fixed a bug where Test Hands couldn't show duplicates.</li>
          <li>Fixed some errors with older decks and players</li>
          <li>Eater and Eyesmon Scatter Mode allow 50 Cards in a Deck</li>
        </ul>
        <div class="flex flex-wrap align-middle justify-content-between gap-3">
          <span class="ml-auto p-text-secondary">Updated 21.05.2025</span>
        </div>
      </p-panel>
      <p-panel header="Version 4.2.0" [toggleable]="true" [collapsed]="true">
        <h1 class="font-bold text-lg underline">Feature</h1>
        <ul class="list-disc p-5">
          <li>Updated all Packages to the newest Version.</li>
          <li>Because of the Update a few styles changed, so I embraced it and made a few more changes.</li>
          <li>Added new Deck-Table expandable rows.</li>
          <li>Added new Keyword Assembly.</li>
          <li>Added all new Products</li>
          <li>Added new Tags for the new Sets</li>
          <li>Added new Page for Rulings</li>
        </ul>
        <h1 class="font-bold text-lg underline">Removed</h1>
        <ul class="list-disc p-5">
          <li>All Pricing Functionality, CardMarket, CardTrader and TCGPlayer don't allow API access.</li>
          <li>Sort by Count and Name, needs a rework to work again</li>
        </ul>
        <div class="flex flex-wrap align-middle justify-content-between gap-3">
          <span class="ml-auto p-text-secondary">Updated 19.05.2025</span>
        </div>
      </p-panel>
      <p-panel header="Version 4.1.9" [toggleable]="true" [collapsed]="true">
        <h1 class="font-bold text-lg underline">Feature</h1>
        <ul class="list-disc p-5">
          <li>Display rule and link field of cards in view mode.</li>
        </ul>
        <h1 class="font-bold text-lg underline">Removed</h1>
        <ul class="list-disc p-5">
          <li>Removed the Community Link, as it was not used. I may add a Rule Quiz or something similar in the future.</li>
        </ul>
        <div class="flex flex-wrap align-middle justify-content-between gap-3">
          <span class="ml-auto p-text-secondary">Updated 19.02.2025</span>
        </div>
      </p-panel>
      <p-panel header="Version 4.1.8" [toggleable]="true" [collapsed]="true">
        <h1 class="font-bold text-lg underline">Feature</h1>
        <ul class="list-disc p-5">
          <li>Added support for the new Linked Cards.</li>
          <li>
            The Wiki changed where rules are displayed, so they now have a seperate field (Thanks to danweber and SilverDew-sg for offering
            a Solution on Github)
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
            Added Special Rare and Rare Pull Version. If you have a filter for versions set in your settings you have to set them for those
            as well.
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
          <li>Better readabilty for image export, by reducing the count-text size. (Thanks to not-tomo for fixing it)</li>
          <li>Image Export is now sorted by level. (Thanks to not-tomo for fixing it)</li>
          <li>When the card-view is collapesed, the cards arent as big and its better to view all of them.</li>
          <li>Reduced the size of the Main-Deck Header and Side Deck Header.</li>
          <li>Added the newest products</li>
          <li>Added a string which displays the current amount of cards displayed. (Thanks to Joker for requesting the feature)</li>
        </ul>

        <p-divider></p-divider>

        <h1 class="font-bold text-lg underline">Bugfixes</h1>
        <ul class="list-disc p-5">
          <li>Fixed Card Count not being updated on change. (Thanks to not-tomo for fixing it)</li>
        </ul>
        <div class="flex flex-wrap align-middle justify-content-between gap-3">
          <span class="ml-auto p-text-secondary">Updated 01.07.2024</span>
        </div>
      </p-panel>
      <p-panel header="Version 4.1.3" [toggleable]="true" [collapsed]="true">
        <h1 class="font-bold text-lg underline">Bugfixes</h1>
        <ul class="list-disc p-5">
          <li>With the last change the multi-select filter didn't work as intended.</li>
        </ul>
        <div class="flex flex-wrap align-middle justify-content-between gap-3">
          <span class="ml-auto p-text-secondary">Updated 17.03.2024</span>
        </div>
      </p-panel>
      <p-panel header="Version 4.1.2" [toggleable]="true" [collapsed]="true">
        <h1 class="font-bold text-lg underline">Bugfixes</h1>
        <ul class="list-disc p-5">
          <li>Single Color Filter did not filter cards with more than one color.</li>
          <li>Couldn't filter in the Multi-Selects e.g. Attribute, Form or Type.</li>
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
            The new setting "Collection Filter Max" was undefined if the settings weren't saved, thats why cards above 5 were filtered out.
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
          <li>When you select Stamp you won't get Pre-Release Cards anymore as they have a separate Option.</li>
          <li>
            If you select Multi-Color, and two colors you only get Multi-Cards that match all colors, e.g. Multi + Red + Purple will filter
            all cards with 2 Colors that are Red and Purple.
          </li>
          <li>Added a way to set your default version filter, for all options.</li>
          <li>Added a Setting to define set your max for the "Number in Collection" filter</li>
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
          <li>Moved away from NGRX Store to a Signal Store, which should improve loading and maintainability.</li>
          <li>Improved the script which updates the community decks each day.</li>
          <li>Improved the filter functions in preparation to the query search.</li>
        </ul>

        <ng-template pTemplate="footer">
          <div class="flex flex-wrap align-middle justify-content-between gap-3">
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
