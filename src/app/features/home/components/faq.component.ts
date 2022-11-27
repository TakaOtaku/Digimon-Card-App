import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'digimon-faq',
  template: `
    <h1 class="text-shadow my-2 text-2xl font-black text-[#e2e4e6]">
      What can I do on this Website?
    </h1>
    <p-accordion>
      <p-accordionTab *ngFor="let faq of faqs" [header]="faq.header">
        <div [innerHTML]="faq.text"></div>
      </p-accordionTab>
    </p-accordion>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FAQComponent {
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
      `,
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
      `,
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
      `,
    },
    {
      header: `Community`,
      text: `
      <ul class="list-disc p-2">
        <li>Overview of <strong>official tournaments</strong> and <strong>deck reports</strong>.</li>
        <li>Miscellaneous stats for all <strong>community decks</strong>.</li>
      </ul>
      `,
    },
    {
      header: `Products`,
      text: `
      <ul class="list-disc p-2">
        <li>See all currently released Digimon TCG products in one place.</li>
        <li>Click on a product to open the corresponding <strong>wiki-link</strong> in a new tab.</li>
      </ul>
      `,
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
      `,
    },
  ];
}
