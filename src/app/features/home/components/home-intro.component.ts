import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'digimon-home-intro',
  template: `
    <h1
      class="text-shadow mt-6 text-4xl font-black text-[#e2e4e6] underline xl:mt-2"
    >
      Welcome to Digimoncard.app!
    </h1>
    <h2 class="mt-1 text-[#e2e4e6]">
      <span class="font-bold">Digimoncard.App</span> is a website to help you
      keep track of your Digimon card collection, help you build great decks and
      keep you posted about the result of any major events.
    </h2>
    <h2 class="mt-1 text-[#e2e4e6]">
      You can also
      <span class="font-bold">submit your winning decks</span> from your locals!
    </h2>
    <h2 class="mt-1 text-[#e2e4e6]">
      If you do like the site and want to support it, consider donating and
      helping me keep the website ad-free, every amount counts.
    </h2>
    <a
      class="mx-auto my-2"
      href="https://www.paypal.com/donate/?hosted_button_id=WLM58Q785D4H4"
      target="_blank"
    >
      <img
        alt="PayPal Donate Button"
        class="h-[24px] lg:h-[40px]"
        src="../../../../assets/images/blue.png"
      />
    </a>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeIntroComponent {}
