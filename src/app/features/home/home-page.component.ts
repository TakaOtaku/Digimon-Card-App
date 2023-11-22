import { HomeIntroComponent } from './components/home-intro.component';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'digimon-home-page',
  template: `
    <div class="relative flex h-[100vh] w-[calc(100vw-6.5rem)] flex-row overflow-y-scroll bg-gradient-to-b from-[#17212f] to-[#08528d]">
      <div class="mx-auto flex justify-center max-w-4xl flex-col">
        <digimon-home-intro class='px-5'></digimon-home-intro>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    HomeIntroComponent,
  ]
})
export class HomePageComponent {
  constructor(private meta: Meta, private title: Title) {
    this.makeGoogleFriendly();
  }

  private makeGoogleFriendly() {
    this.title.setTitle('Digimon Card Game - Home');

    this.meta.addTags([
      {
        name: 'description',
        content:
          'Digimoncard.App is a website to to keep track of your Digimon card collection, build great decks and keep you posted about the result of any major events.',
      },
      { name: 'author', content: 'TakaOtaku' },
      {
        name: 'keywords',
        content:
          'Digimon, decks, deck builder, collection,  tournament, TCG, community, friends, share',
      },
    ]);
  }
}
