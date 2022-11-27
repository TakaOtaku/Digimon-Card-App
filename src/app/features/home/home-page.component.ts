import { ChangeDetectionStrategy, Component } from "@angular/core";
import { Meta, Title } from "@angular/platform-browser";
import { Router } from "@angular/router";

@Component({
  selector: "digimon-home-page",
  template: `
    <div
      class="flex h-[calc(100vh-50px)] w-full flex-row overflow-y-scroll bg-gradient-to-b from-[#17212f] to-[#08528d] px-1"
    >
      <div class="mx-auto flex w-full max-w-6xl flex-col">
        <h1
          class="text-shadow mt-6 text-4xl font-black text-[#e2e4e6] underline xl:mt-2"
        >
          Welcome to Digimoncard.app!
        </h1>
        <h2 class="mt-1 text-[#e2e4e6]">
          <span class="font-bold">Digimoncard.App</span> is a website to help
          you keep track of your Digimon card collection, help you build great
          decks and keep you posted about the result of any major events.
        </h2>
        <h2 class="mt-1 text-[#e2e4e6]">
          You can also
          <span class="font-bold">submit your winning decks</span> from your
          locals!
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
            src="../../../assets/images/blue.png"
          />
        </a>

        <div class="my-4 w-full border-b border-slate-100"></div>

        <div class="grid gap-5 sm:grid-cols-2">
          <digimon-split-box
            image=""
            header="Deckbuilder"
            subheader="Build and Share Decks"
            (click)="this.router.navigateByUrl('/deckbuilder')"
          ></digimon-split-box>
          <digimon-split-box
            image=""
            header="Collection"
            subheader="Track your Cards"
            (click)="this.router.navigateByUrl('/collection')"
          ></digimon-split-box>
          <digimon-split-box
            image=""
            header="Profile"
            subheader="Overview of your Decks and Collection"
            (click)="this.router.navigateByUrl('/user')"
          ></digimon-split-box>
          <digimon-split-box
            image=""
            header="Decks"
            subheader="Community created Decks"
            (click)="this.router.navigateByUrl('/decks')"
          ></digimon-split-box>
          <digimon-split-box
            image=""
            header="Community"
            subheader="Deck- and Tournament-Reports"
            (click)="this.router.navigateByUrl('/community')"
          ></digimon-split-box>
          <digimon-split-box
            image=""
            header="Products"
            subheader="List of all Digimon TCG Products"
            (click)="this.router.navigateByUrl('/products')"
          ></digimon-split-box>
        </div>

        <div class="my-4 w-full border-b border-slate-100"></div>

        <digimon-event-calendar></digimon-event-calendar>

        <div class="my-4 w-full border-b border-slate-100"></div>

        <h1 class="text-shadow my-2 text-2xl font-black text-[#e2e4e6]">
          What can I do on this Website?
        </h1>
        <p-accordion>
          <p-accordionTab *ngFor="let faq of faqs" [header]="faq.header">
            <div [innerHTML]="faq.text"></div>
          </p-accordionTab>
        </p-accordion>

        <div class="my-4 w-full border-b border-slate-100"></div>

        <digimon-tierlist></digimon-tierlist>

        <div class="h-10 min-h-[2rem]"></div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePageComponent {
  faqs = [
    {
      header: `Deckbuilder`,
      text: `
      <ul class="list-disc p-2">
        <li>When creating decks <strong>tags</strong> and <strong>color</strong> is set automatically.</li>
        <li>Show which cards are <strong>missing from your collection</strong>.</li>
        <li>Save the Deck to your profile.</li>
        <li>Import Decks with <strong>various formats including the TTS format.</strong></li>
        <li>Export Decks in <strong>various text and image formats.</strong></li>
        <li>Show the different deck statistics or hide them.</li>
        <li>Simulate <strong>Start Hand</strong> and <strong>Security Stack.</strong></li>
        <li><strong>Share the deck</strong> with everyone in the community.</li>
        <li>Close the Deck-View or Collection View to see the other one in <strong>Fullscreen</strong></li>
        <li>On the Deck-View-Fullscreen see even more deck-statistics.</li>
      </ul>
      `,
    },
    {
      header: `Collection`,
      text: `
      <ul class="list-disc p-2">
        <li>See <strong>all english and japanese</strong> cards in one place.</li>
        <li>Filter those cards mit tons of different filters.</li>
        <li><strong>Add and remove cards</strong> from your collection. They turn from <strong>grey to color</strong> if you have achieved your <strong>collection goal.</strong></li>
        <li>Click on a card to open it in <strong>detail view</strong>.</li>
      </ul>
      `
    },
    {
      header: `Profile`,
      text: `
      <ul class="list-disc p-2">
        <li>See your <strong>collection stats</strong> and your collected cards in a list.</li>
        <li>Share your <strong>profile link</strong> with other users.</li>
        <li>See all your created decks.</li>
        <li>Click on a Deck-Name or right click to open a context menu, to <strong>open</strong>, <strong>copy</strong>, <strong>export</strong> or <strong>delete</strong> the deck.</li>
      </ul>
      `
    },
    {
      header: `Decks`,
      text: `
      <ul class="list-disc p-2">
        <li>Overview of all <strong>community-created</strong> decks.</li>
        <li>Filter those decks for a <strong>specific format</strong> or other attributes like <strong>contained cards</strong>.</li>
        <li>Click on a deck-name or right click to open a context menu, to <strong>open</strong>, <strong>copy</strong> or <strong>get the link</strong> to a deck.</li>
        <li>Press the arrow next to a deck to open a preview.</li>
      </ul>
      `
    },
    {
      header: `Community`,
      text: `
      <ul class="list-disc p-2">
        <li>Overview of <strong>official tournaments</strong> and <strong>deck reports</strong>.</li>
        <li>Miscellaneous stats for all <strong>community decks</strong>.</li>
      </ul>
      `
    },
    {
      header: `Products`,
      text: `
      <ul class="list-disc p-2">
        <li>See all currently released Digimon TCG products in one place.</li>
        <li>Click on a product to open the corresponding <strong>wiki-link</strong> in a new tab.</li>
      </ul>
      `
    },
    {
      header: `Settings`,
      text: `
      <ul class="list-disc p-2">
        <li>Set your <strong>how many</strong> of each card you want to collect.</li>
        <li>Set a how you want your cards sorted in your decks. <strong>Color first or level first.</strong> </li>
        <li>Set if you want to see pre-release, alternative art or stamped cards.</li>
        <li>Export your whole collection or your missing cards to a table format.</li>
        <li>Import your collection in the format <strong>"id count"</strong.</li>
        <li>Import/Export/Delete your Save File</li>
      </ul>
      `
    },
  ];

  constructor(public router: Router, private meta: Meta, private title: Title) {
    this.makeGoogleFriendly();
  }

  private makeGoogleFriendly() {
    this.title.setTitle("Digimon Card Game - Home");

    this.meta.addTags([
      {
        name: "description",
        content:
          "Digimoncard.App is a website to to keep track of your Digimon card collection, build great decks and keep you posted about the result of any major events."
      },
      { name: "author", content: "TakaOtaku" },
      {
        name: "keywords",
        content:
          "Digimon, decks, deck builder, collection,  tournament, TCG, community, friends, share"
      }
    ]);
  }
}
