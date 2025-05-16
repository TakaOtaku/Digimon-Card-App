import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'digimon-home-intro',
  template: `
    <div class="flex flex-row justify-center">
      <img alt="Logo" class="cursor-pointer max-h-[3rem] md:max-h-[6rem]" src="../../../assets/images/logo.png" />
      <h1 class="text-shadow ml-3 mt-3 md:mt-6 text-center text-xl sm:text-3xl md:text-6xl font-black text-[#64B5F6]">Digimoncard.app</h1>
    </div>

    <p-divider class="my-5"></p-divider>

    <h2 class="mt-1 text-center text-[#e2e4e6] text-sm sm:text-base">
      I build <span class="font-bold">Digimoncard.App</span> as a website to help you keep track of your Digimon Card collection, give you
      access to a deckbuilder with everything needed to build a great deck and to help you share those decks with friends and the community.
    </h2>

    <p-divider class="my-5"></p-divider>

    <h2 class="mt-1 text-center text-[#e2e4e6] text-sm sm:text-base">
      Everything related to the cards is loaded once a day from
      <span class="font-bold">DigimonCardGame.Fandom</span>. Thanks to their effort everything should on here should be up to date.
    </h2>

    <p-divider class="my-5"></p-divider>

    <h2 class="mt-1 text-center text-[#e2e4e6] text-sm sm:text-base">
      March next year the 3-Year Plan for the Server will end and I will have to move to a new server. The last Server was about 250-300€
      for the 3 years, thanks to a good deal and about 100€ of that was payed thanks to the donations. So if you want to support the site,
      consider donating a few bucks to help me maintain the site.
    </h2>

    <p-divider class="my-5"></p-divider>

    <h2 class="mt-1 text-center text-[#e2e4e6] text-sm sm:text-base">
      If you do like the site and want to support it, consider donating
      <a href="https://www.paypal.com/donate/?hosted_button_id=WLM58Q785D4H4" target="_blank">
        <i class="pi pi-paypal px-1 text-[#e2e4e6] hover:text-[#64B5F6]"></i>
      </a>
      and helping me keep the website ad-free. I will use everything that gets donated to get better servers to improve the performance of
      the website.
    </h2>

    <p-divider class="my-5"></p-divider>

    <h2 class='text-shadow text-base sm:text-lg font-black underline text-center text-white text-[#e2e4e6]"'>Partners</h2>
    <div class="mx-auto flex flex-row">
      <a class="mx-auto flex flex-col" href="https://www.youtube.com/@AVAULT" target="_blank">
        <img class="mx-auto max-h-16 w-16 rounded-full object-cover" src="assets/images/partners/avault.jpg" alt="AVAULT" />
        <div class="text-shadow text-center text-xs font-black text-[#e2e4e6]">AVAULT</div>
      </a>
      <a class="mx-auto flex flex-col" href="https://discord.gg/digimon-tcg-dach-759562127513223168" target="_blank">
        <img class="mx-auto max-h-16" src="assets/images/partners/dach.png" alt="Digimon DACH Discord" />
        <div class="text-shadow text-center text-xs font-black text-[#e2e4e6]">Digimon TCG DACH</div>
      </a>
      <a class="mx-auto flex flex-col" href="https://www.youtube.com/East_ML" target="_blank">
        <img class="mx-auto max-h-16 w-16 rounded-full object-cover" src="assets/images/partners/east.jpg" alt="East" />
        <div class="text-shadow text-center text-xs font-black text-[#e2e4e6]">East</div>
      </a>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [DividerModule],
})
export class HomeIntroComponent {
  faq = [];
  images = [
    {
      src: 'assets/images/1.webp',
    },
  ];

  position: string = 'bottom';

  positionOptions = [
    {
      label: 'Bottom',
      value: 'bottom',
    },
    {
      label: 'Top',
      value: 'top',
    },
    {
      label: 'Left',
      value: 'left',
    },
    {
      label: 'Right',
      value: 'right',
    },
  ];

  responsiveOptions: any[] = [
    {
      breakpoint: '1024px',
      numVisible: 5,
    },
    {
      breakpoint: '768px',
      numVisible: 3,
    },
    {
      breakpoint: '560px',
      numVisible: 1,
    },
  ];
}
