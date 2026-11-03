import { SeoService } from '@services';
import { PageComponent } from '../shared/page.component';
import { HomeIntroComponent } from './components/home-intro.component';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

@Component({
  selector: 'digimon-home-page',
  template: `
    <digimon-page>
      <digimon-home-intro
        class="w-full self-start"></digimon-home-intro>
    </digimon-page>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [HomeIntroComponent, PageComponent],
})
export class HomePageComponent {
  private seo = inject(SeoService);
  constructor() {
    this.makeGoogleFriendly();
  }

  private makeGoogleFriendly() {
    this.seo.set('Digimon TCG deck builder and collection tracker', 'Free Digimon Card Game deck builder, card database and collection tracker. Build, track and share decks.');
  }
}
