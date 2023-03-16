import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'digimon-collection-page',
  template: `
    <div class="bg-gradient-to-b from-[#17212f] to-[#08528d] ">
      <div class="hidden md:block">
        <digimon-collection-view
          [collectionOnly]="true"
          [deckView]="false"
        ></digimon-collection-view>
      </div>

      <div class="md:hidden">
        <digimon-filter-and-search></digimon-filter-and-search>
        <digimon-card-list
          [collectionOnly]="true"
          [showCount]="32"
        ></digimon-card-list>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionPageComponent implements OnInit {
  constructor(private meta: Meta, private title: Title) {}

  ngOnInit(): void {
    this.makeGoogleFriendly();
  }

  private makeGoogleFriendly() {
    this.title.setTitle('Digimon Card Game - Collection');

    this.meta.addTags([
      {
        name: 'description',
        content:
          'Keep track of your Collection of the new Digimon Card Game. Find missing cards, rulings, erratas and many more information easily.',
      },
      { name: 'author', content: 'TakaOtaku' },
      {
        name: 'keywords',
        content: 'Collection, Digimon, Card, Card, Game, rulings, erratas',
      },
    ]);
  }
}
