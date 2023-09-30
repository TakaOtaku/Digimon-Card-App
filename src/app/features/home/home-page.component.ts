import { HomeIntroComponent } from './components/home-intro.component';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { EventCalendarComponent } from './components/event-calendar.component';
import { FAQComponent } from './components/faq.component';
import { SiteLinksComponent } from './components/site-links.component';
import { TierlistComponent } from './components/tierlist.component';

@Component({
  selector: 'digimon-home-page',
  template: `
    <div
      class="flex h-[calc(100vh-50px)] w-full flex-row overflow-y-scroll bg-gradient-to-b from-[#17212f] to-[#08528d] px-1">
      <div class="mx-auto flex w-full max-w-6xl flex-col">
        <digimon-home-intro></digimon-home-intro>

        <div class="my-4 w-full border-b border-slate-100"></div>

        <digimon-site-links></digimon-site-links>

        <div class="my-4 w-full border-b border-slate-100"></div>

        <digimon-tierlist></digimon-tierlist>

        <div class="my-4 w-full border-b border-slate-100"></div>

        <digimon-event-calendar></digimon-event-calendar>

        <div class="my-4 w-full border-b border-slate-100"></div>

        <digimon-faq></digimon-faq>

        <div class="h-10 min-h-[2rem]"></div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    HomeIntroComponent,
    SiteLinksComponent,
    EventCalendarComponent,
    FAQComponent,
    TierlistComponent,
  ],
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
