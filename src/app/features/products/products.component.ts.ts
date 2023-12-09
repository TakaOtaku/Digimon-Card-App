import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  inject,
} from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';
import { DividerModule } from 'primeng/divider';
import { GalleriaModule } from 'primeng/galleria';
import { TooltipModule } from 'primeng/tooltip';
import { NgFor } from '@angular/common';
import { PageComponent } from '../shared/page.component';

@Component({
  selector: 'digimon-products',
  template: `
    <digimon-page>
      <div
        class="overflow-x-hidden flex self-baseline flex-col justify-center max-w-md md:max-w-4xl mx-auto">
        <div *ngFor="let product of products; let last = last">
          <h1
            class="text-shadow text-center mt-6 text-4xl font-black text-[#e2e4e6] underline xl:mt-2">
            {{ product.name }}
          </h1>
          <p-carousel
            [value]="product.items"
            [numVisible]="displayCount"
            [numScroll]="displayCount"
            [circular]="true"
            [autoplayInterval]="5000">
            <ng-template let-item pTemplate="item">
              <div
                class="border-1 surface-border border-round m-2 text-center py-5 px-3">
                <img
                  src="{{ item.image }}"
                  [alt]="item.name"
                  class="shadow-2 mx-auto h-60" />
                <div>
                  <h4 class="mb-1 text-black-outline text-white">
                    {{ item.name }}
                  </h4>
                  <div class="car-buttons mt-2">
                    <!--p-button type="button" styleClass="p-button p-button-rounded mr-2" icon="pi pi-info-circle"></p-button-->
                    <p-button
                      (click)="openLink(item.link)"
                      type="button"
                      styleClass="p-button-success p-button-rounded mr-2"
                      icon="pi pi-external-link"></p-button>
                  </div>
                </div>
              </div>
            </ng-template>
          </p-carousel>

          <p-divider *ngIf="!last"></p-divider>
        </div>
      </div>
    </digimon-page>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgFor,
    TooltipModule,
    LazyLoadImageModule,
    ButtonModule,
    CarouselModule,
    GalleriaModule,
    DividerModule,
    PageComponent,
  ],
})
export class ProductsComponent {
  starter = [
    {
      name: 'ST-1: Starter Deck Gaia Red',
      image: '../../assets/images/products/ST-1.webp',
      link: 'https://digimoncardgame.fandom.com/wiki/ST-1:_Starter_Deck_Gaia_Red',
    },
    {
      name: 'ST-2: Starter Deck Cocytus Blue',
      image: '../../assets/images/products/ST-2.webp',
      link: 'https://digimoncardgame.fandom.com/wiki/ST-2:_Starter_Deck_Cocytus_Blue',
    },
    {
      name: "ST-3: Starter Deck Heaven's Yellow",
      image: '../../assets/images/products/ST-3.webp',
      link: 'https://digimoncardgame.fandom.com/wiki/ST-3:_Starter_Deck_Heaven%27s_Yellow',
    },
    {
      name: 'ST-4: Starter Deck Giga Green',
      image: '../../assets/images/products/ST-4.webp',
      link: 'https://digimoncardgame.fandom.com/wiki/ST-4:_Starter_Deck_Giga_Green',
    },
    {
      name: 'ST-5: Starter Deck Machine Black',
      image: '../../assets/images/products/ST-5.webp',
      link: 'https://digimoncardgame.fandom.com/wiki/ST-5:_Starter_Deck_Machine_Black',
    },
    {
      name: 'ST-6: Starter Deck Venomous Violet',
      image: '../../assets/images/products/ST-6.webp',
      link: 'https://digimoncardgame.fandom.com/wiki/ST-6:_Starter_Deck_Venomous_Violet',
    },
    {
      name: 'ST-7: Starter Deck Gallantmon',
      image: '../../assets/images/products/ST-7.webp',
      link: 'https://digimoncardgame.fandom.com/wiki/ST-7:_Starter_Deck_Gallantmon',
    },
    {
      name: 'ST-8: Starter Deck UlforceVeedramon',
      image: '../../assets/images/products/ST-8.webp',
      link: 'https://digimoncardgame.fandom.com/wiki/ST-8:_Starter_Deck_UlforceVeedramon',
    },
    {
      name: 'ST-9: Starter Deck Ultimate Ancient Dragon',
      image: '../../assets/images/products/ST-9.webp',
      link: 'https://digimoncardgame.fandom.com/wiki/ST-9:_Starter_Deck_Ultimate_Ancient_Dragon',
    },
    {
      name: 'ST-10: Starter Deck Parallel World Tactician',
      image: '../../assets/images/products/ST-10.webp',
      link: 'https://digimoncardgame.fandom.com/wiki/ST-10:_Starter_Deck_Parallel_World_Tactician',
    },
    {
      name: 'ST-12: Starter Deck Jesmon',
      image: '../../assets/images/products/ST-12.webp',
      link: 'https://digimoncardgame.fandom.com/wiki/ST-12:_Starter_Deck_Jesmon',
    },
    {
      name: 'ST-13: Starter Deck RagnaLoardmon',
      image: '../../assets/images/products/ST-13.webp',
      link: 'https://digimoncardgame.fandom.com/wiki/ST-13:_Starter_Deck_RagnaLoardmon',
    },
    {
      name: 'ST-14: Advanced Deck Beelzemon',
      image: '../../assets/images/products/ST-14.webp',
      link: 'https://digimoncardgame.fandom.com/wiki/ST-14:_Advanced_Deck_Beelzemon',
    },
    {
      name: 'ST-15: Starter Deck Dragon of Courage',
      image: '../../assets/images/products/ST-15.webp',
      link: 'https://digimoncardgame.fandom.com/wiki/ST-14:_Advanced_Deck_Beelzemon',
    },
    {
      name: 'ST-16: Starter Deck Wolf of Friendship',
      image: '../../assets/images/products/ST-16.webp',
      link: 'https://digimoncardgame.fandom.com/wiki/ST-14:_Advanced_Deck_Beelzemon',
    },
  ];
  booster = [
    {
      name: 'BT01-03: Release Special Booster Ver.1.0',
      image:
        '../../assets/images/products/Special_Release_Booster_Pack_1.0.webp',
      link: 'https://digimoncardgame.fandom.com/wiki/BT01-03:_Release_Special_Booster_Ver.1.0',
    },
    {
      name: 'BT01-03: Release Special Booster Ver.1.5',
      image:
        '../../assets/images/products/Special_Release_Booster_Pack_1.5.webp',
      link: 'https://digimoncardgame.fandom.com/wiki/BT01-03:_Release_Special_Booster_Ver.1.5',
    },
    {
      name: 'BT-04: Booster Great Legend',
      image: '../../assets/images/products/BT-4.webp',
      link: 'https://digimoncardgame.fandom.com/wiki/BT-04:_Booster_Great_Legend',
    },
    {
      name: 'BT-05: Booster Battle Of Omni',
      image: '../../assets/images/products/BT-5.webp',
      link: 'https://digimoncardgame.fandom.com/wiki/BT-05:_Booster_Battle_Of_Omni',
    },
    {
      name: 'BT-06: Booster Double Diamond',
      image: '../../assets/images/products/BT-6.webp',
      link: 'https://digimoncardgame.fandom.com/wiki/BT-06:_Booster_Double_Diamond',
    },
    {
      name: 'EX-01: Theme Booster Classic Collection',
      image: '../../assets/images/products/EX-1.webp',
      link: 'https://digimoncardgame.fandom.com/wiki/EX-01:_Theme_Booster_Classic_Collection',
    },
    {
      name: 'BT-07: Booster Next Adventure',
      image: '../../assets/images/products/BT-7.webp',
      link: 'https://digimoncardgame.fandom.com/wiki/BT-07:_Booster_Next_Adventure',
    },
    {
      name: 'BT-08: Booster New Awakening',
      image: '../../assets/images/products/BT-8.webp',
      link: 'https://digimoncardgame.fandom.com/wiki/BT-08:_Booster_New_Awakening',
    },
    {
      name: 'EX-02: Theme Booster Digital Hazard',
      image: '../../assets/images/products/EX-2.webp',
      link: 'https://digimoncardgame.fandom.com/wiki/EX-02:_Theme_Booster_Digital_Hazard',
    },
    {
      name: 'BT-09: Booster X Record',
      image: '../../assets/images/products/BT-9.webp',
      link: 'https://digimoncardgame.fandom.com/wiki/BT-09:_Booster_X_Record',
    },
    {
      name: 'BT-10: Booster Xros Encounter',
      image: '../../assets/images/products/BT-10.webp',
      link: 'https://digimoncardgame.fandom.com/wiki/BT-10:_Booster_Xros_Encounter',
    },
    {
      name: 'EX-03: Theme Booster Draconic Roar',
      image: '../../assets/images/products/EX-3.webp',
      link: 'https://digimoncardgame.fandom.com/wiki/EX-03:_Theme_Booster_Draconic_Roar',
    },
    {
      name: 'BT-11: Booster Dimensional Phase',
      image: '../../assets/images/products/BT-11.webp',
      link: 'https://digimoncardgame.fandom.com/wiki/BT-11:_Booster_Dimensional_Phase',
    },
    {
      name: 'BT-12: Booster Across Time',
      image: '../../assets/images/products/BT-12.webp',
      link: 'https://digimoncardgame.fandom.com/wiki/BT-12:_Booster_Across_Time',
    },
    {
      name: 'EX-04: Theme Booster Alternative Being',
      image: '../../assets/images/products/EX-4.webp',
      link: 'https://digimoncardgame.fandom.com/wiki/EX-04:_Theme_Booster_Alternative_Being',
    },
    {
      name: 'RB-01: Reboot Booster Rising Wind',
      image: '../../assets/images/products/RB-1.webp',
      link: 'https://digimoncardgame.fandom.com/wiki/RB-01:_Reboot_Booster_Rising_Wind',
    },
  ];
  promo = [
    {
      name: 'Promotion Pack Ver 0.0',
      image: '../../assets/images/products/Promotion_Pack_Ver_0.0.webp',
      link: 'https://digimoncardgame.fandom.com/wiki/Promotion_Pack_Ver_0.0',
    },
    {
      name: 'Dash Pack Ver. 1.0',
      image: '../../assets/images/products/Dash_Pack_Ver_1.0.webp',
      link: 'https://digimoncardgame.fandom.com/wiki/Dash_Pack_Ver._1.0',
    },
    {
      name: 'Tamer Party',
      image: '../../assets/images/products/Tamer_Party_Event-01.webp',
      link: 'https://digimoncardgame.fandom.com/wiki/Tamer_Party',
    },
    {
      name: "PB-01: Tamer's Evolution Box",
      image: '../../assets/images/products/PB-01.webp',
      link: 'https://digimoncardgame.fandom.com/wiki/PB-01:_Tamer%27s_Evolution_Box',
    },
    {
      name: 'Official Tournament Pack Vol. 1',
      image: '../../assets/images/products/Official_Tournament_Pack_Vol.1.webp',
      link: 'https://digimoncardgame.fandom.com/wiki/Official_Tournament_Pack_Vol._1',
    },
    {
      name: 'Dash Pack Ver. 1.5',
      image: '../../assets/images/products/Dash_Pack_Ver._1.5.webp',
      link: 'https://digimoncardgame.fandom.com/wiki/Dash_Pack_Ver._1.5',
    },
    {
      name: 'Special Box Promotion Pack',
      image: '../../assets/images/products/Special_Box_Promotion_Pack.webp',
      link: 'https://digimoncardgame.fandom.com/wiki/Special_Box_Promotion_Pack',
    },
    {
      name: 'Special Release Memorial Pack',
      image: '../../assets/images/products/Special_Release_Memorial_Pack.webp',
      link: 'https://digimoncardgame.fandom.com/wiki/Special_Release_Memorial_Pack',
    },
    {
      name: "PB-02: Digimon Card Game Tamer's Set",
      image: '../../assets/images/products/PB-02.webp',
      link: 'https://digimoncardgame.fandom.com/wiki/PB-02:_Digimon_Card_Game_Tamer%27s_Set',
    },
    {
      name: 'PP01: Premium Pack Set 01',
      image: '../../assets/images/products/PP01.webp',
      link: 'https://digimoncardgame.fandom.com/wiki/PP01:_Premium_Pack_Set_01',
    },
    {
      name: 'Great Legend Pre-Release Promotion',
      image:
        '../../assets/images/products/Great_Legend_Pre-Release_Promotion_Pack.webp',
      link: 'https://digimoncardgame.fandom.com/wiki/Great_Legend_Pre-Release_Promotion',
    },
    {
      name: 'Great Dash Pack',
      image: '../../assets/images/products/Great_Dash_Pack.webp',
      link: 'https://digimoncardgame.fandom.com/wiki/Great_Dash_Pack',
    },
    {
      name: 'Tamer Party Vol.2',
      image: '../../assets/images/products/Tamer_Party_Event-02.webp',
      link: 'https://digimoncardgame.fandom.com/wiki/Tamer_Party_Vol.2',
    },
    {
      name: 'Official Tournament Pack Vol. 2',
      image: '../../assets/images/products/Official_Tournament_Pack_Vol.2.webp',
      link: 'https://digimoncardgame.fandom.com/wiki/Official_Tournament_Pack_Vol._2',
    },
    {
      name: 'Evolution Cup',
      image: '../../assets/images/products/Evolution_Cup.webp',
      link: 'https://digimoncardgame.fandom.com/wiki/Evolution_Cup',
    },
    {
      name: 'Event Pack',
      image: '../../assets/images/products/Evolution_Cup_Event_Pack.webp',
      link: 'https://digimoncardgame.fandom.com/wiki/Event_Pack',
    },
    {
      name: 'Battle of Omni Pre-Release Promotion',
      image:
        '../../assets/images/products/Battle_of_Omni_Pre-Release_Promotion_Pack.webp',
      link: 'https://digimoncardgame.fandom.com/wiki/Battle_of_Omni_Pre-Release_Promotion',
    },
    {
      name: 'PB-03: WarGreymon Playmat',
      image: '../../assets/images/products/PB-03.webp',
      link: 'https://digimoncardgame.fandom.com/wiki/PB-03:_WarGreymon_Playmat',
    },
    {
      name: 'Tamer Party Vol.3',
      image: '../../assets/images/products/Tamer_Party_Event-03.webp',
      link: 'https://digimoncardgame.fandom.com/wiki/Tamer_Party_Vol.3',
    },
    {
      name: 'DC-1 Grand Prix',
      image: '../../assets/images/products/DC-1_Grand_Prix.webp',
      link: 'https://digimoncardgame.fandom.com/wiki/DC-1_Grand_Prix',
    },
    {
      name: 'Double Diamond Pre-Release Promotion',
      image:
        '../../assets/images/products/Double_Diamond_Pre-Release_Promotion_Pack.webp',
      link: 'https://digimoncardgame.fandom.com/wiki/Double_Diamond_Pre-Release_Promotion',
    },
    {
      name: 'Double Diamond Dash Pack',
      image: '../../assets/images/products/Double_Diamond_Dash_Pack.webp',
      link: 'https://digimoncardgame.fandom.com/wiki/Double_Diamond_Dash_Pack',
    },
    {
      name: 'Official Tournament Pack Vol. 3',
      image: '../../assets/images/products/Official_Tournament_Pack_Vol.3.webp',
      link: 'https://digimoncardgame.fandom.com/wiki/Official_Tournament_Pack_Vol._3',
    },
    {
      name: 'Winner Pack Double Diamond',
      image: '../../assets/images/products/WinnerPackDoubleDiamond.webp',
      link: 'https://digimoncardgame.fandom.com/wiki/Winner_Pack_Double_Diamond',
    },
    {
      name: "PB-04: Digimon Card Game Tamer's Set 2",
      image: '../../assets/images/products/PB-04.webp',
      link: 'https://digimoncardgame.fandom.com/wiki/PB-04:_Digimon_Card_Game_Tamer%27s_Set_2',
    },
    {
      name: 'GB-01: Digimon Card Game Gift Box',
      image: '../../assets/images/products/EX-1-Giftbox.webp',
      link: 'https://digimoncardgame.fandom.com/wiki/GB-01:_Digimon_Card_Game_Gift_Box',
    },
    {
      name: 'Box Promotion Pack -Next Adventure-',
      image:
        '../../assets/images/products/Box_Promotion_Pack_-Next_Adventure-.webp',
      link: 'https://digimoncardgame.fandom.com/wiki/Box_Promotion_Pack_-Next_Adventure-',
    },
    {
      name: 'Tamer Party Vol.4',
      image: '../../assets/images/products/Tamer_Party_Event-04.webp',
      link: 'https://digimoncardgame.fandom.com/wiki/Tamer_Party_Vol.4',
    },
    {
      name: 'Official Tournament Pack Vol. 4',
      image: '../../assets/images/products/Official_Tournament_Pack_Vol.4.webp',
      link: 'https://digimoncardgame.fandom.com/wiki/Official_Tournament_Pack_Vol._4',
    },
    {
      name: 'Winner Pack Next Adventure',
      image: '../../assets/images/products/WinnerPackNextAdventure.webp',
      link: 'https://digimoncardgame.fandom.com/wiki/Winner_Pack_Next_Adventure',
    },
    {
      name: "PB-06: Tamer's Evolution Box 2",
      image: '../../assets/images/products/PB-06.webp',
      link: 'https://digimoncardgame.fandom.com/wiki/PB-06:_Tamer%27s_Evolution_Box_2',
    },
    {
      name: "PB-05: Digimon Card Game Tamer's Set 3",
      image: '../../assets/images/products/PB-05.webp',
      link: 'https://digimoncardgame.fandom.com/wiki/PB-05:_Digimon_Card_Game_Tamer%27s_Set_3',
    },
    {
      name: 'Official Tournament Pack Vol. 5',
      image: '../../assets/images/products/Official_Tournament_Pack_Vol.5.webp',
      link: 'https://digimoncardgame.fandom.com/wiki/Official_Tournament_Pack_Vol._5',
    },
    {
      name: 'Winner Pack New Awakening',
      image: '../../assets/images/products/WinnerPackNewAwakening.webp',
      link: 'https://digimoncardgame.fandom.com/wiki/Winner_Pack_New_Awakening',
    },
    {
      name: "PB-07: Digimon Card Game Tamer's Set EX",
      image: '../../assets/images/products/Cardcase-PB-07.webp',
      link: 'https://digimoncardgame.fandom.com/wiki/PB-07:_Digimon_Card_Game_Tamer%27s_Set_EX',
    },
    {
      name: 'PB-08: Digimon Tamers Playmat',
      image: '../../assets/images/products/PB-08.webp',
      link: 'https://digimoncardgame.fandom.com/wiki/PB-08:_Digimon_Tamers_Playmat',
    },
    {
      name: 'AB-01: Digimon Card Game Adventure Box',
      image: '../../assets/images/products/AB-01.webp',
      link: 'https://digimoncardgame.fandom.com/wiki/AB-01:_Digimon_Card_Game_Adventure_Box',
    },
    {
      name: 'Official Tournament Pack Vol. 6',
      image: '../../assets/images/products/Official_Tournament_Pack_Vol.6.webp',
      link: 'https://digimoncardgame.fandom.com/wiki/Official_Tournament_Pack_Vol._6',
    },
    {
      name: 'Winner Pack X Record',
      image: '../../assets/images/products/WinnerPackXRecord.webp',
      link: 'https://digimoncardgame.fandom.com/wiki/Winner_Pack_X_Record',
    },
    {
      name: 'GB-02: Digimon Card Game Gift Box 2',
      image: '../../assets/images/products/GB-02.webp',
      link: 'https://digimoncardgame.fandom.com/wiki/GB-02:_Digimon_Card_Game_Gift_Box_2',
    },
    {
      name: "PB-11: Digimon Card Game Tamer's Set 5",
      image: '../../assets/images/products/PB-11.webp',
      link: 'https://digimoncardgame.fandom.com/wiki/PB-11:_Digimon_Card_Game_Tamer%27s_Set_5',
    },
  ];

  products = [
    {
      name: 'Starter Decks',
      items: this.starter,
    },
    {
      name: 'Booster Sets',
      items: this.booster,
    },
    {
      name: 'Promo Products',
      items: this.promo,
    },
  ];

  displayCount = 3;

  public router = inject(Router);
  private meta = inject(Meta);
  private title = inject(Title);
  constructor() {
    this.makeGoogleFriendly();
    this.checkScreenWidth(window.innerWidth);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.checkScreenWidth((event.target as Window).innerWidth);
  }

  private makeGoogleFriendly() {
    this.title.setTitle('Digimon Card Game - Products');

    this.meta.addTags([
      {
        name: 'description',
        content:
          'See all Digimon TCG Products in one Place with a Link to the Wiki',
      },
      { name: 'author', content: 'TakaOtaku' },
      {
        name: 'keywords',
        content:
          'Digimon, decks, deck builder, collection,  tournament, TCG, community, friends, share',
      },
    ]);
  }

  openLink(link: string) {
    window.open(link, '_blank');
  }

  private checkScreenWidth(innerWidth: number) {
    const xl = innerWidth >= 1280;
    const lg = innerWidth >= 1024;
    const md = innerWidth >= 768;
    if (xl) {
      this.displayCount = 4;
    } else if (lg) {
      this.displayCount = 3;
    } else if (md) {
      this.displayCount = 2;
    } else {
      this.displayCount = 1;
    }
  }
}
