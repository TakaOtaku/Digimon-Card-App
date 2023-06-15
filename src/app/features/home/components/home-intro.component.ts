import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'digimon-home-intro',
  template: `
    <h1 class="text-shadow mt-6 text-center text-4xl font-black text-[#e2e4e6] underline xl:mt-2">
      Welcome to Digimoncard.app!
    </h1>
    <h2 class="mt-1 text-center text-[#e2e4e6]">
      <span class="font-bold">Digimoncard.App</span> is a website to help you keep track of your Digimon card
      collection, help you build great decks and keep you posted about the result of any major events.
    </h2>
    <h2 class="mt-1 text-center text-[#e2e4e6]">
      If you do like the site and want to support it, consider donating and helping me keep the website ad-free, every
      amount counts.
    </h2>
    <h2 class="mt-1 text-center text-[#e2e4e6]">
      With this I can also increase the performance of the website with better servers.
    </h2>
    <h2 class="mt-1 text-center text-[#e2e4e6]">
      If you are interested in writing blog post or help me develop this website, please contact me.
    </h2>
    <div class="grid grid-cols-3 text-center">
      <div></div>
      <a class="mx-auto" href="https://www.paypal.com/donate/?hosted_button_id=WLM58Q785D4H4" target="_blank">
        <img alt="PayPal Donate Button" class="h-[24px] lg:h-[40px]" src="../../../../assets/images/blue.png" />
      </a>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class HomeIntroComponent {}
