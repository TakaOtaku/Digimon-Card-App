import { TestBed } from '@angular/core/testing';
import { dummyCard, emptyDeck } from '@models';
import { CardMarketService } from '@services';
import { DialogStore, DigimonCardStore, SaveStore, WebsiteStore } from '@store';
import { ViewCardDialogComponent } from './view-card-dialog.component';

describe('ViewCardDialogComponent section order', () => {
  it('places option requirements, option effect, dual effect, and Link DP in order', () => {
    const card = {
      ...dummyCard,
      optionCardColourRequirement: 'Red',
      optionCardEffect: '[Main] Use it.',
      dualEffect: '[Arts Digivolve] Cost 3',
      linkRequirement: '[Link] Test',
      linkEffect: '[When Linking] Draw 1.',
      linkDP: '+2000',
    };
    const pool = ['A-1', 'A-2', 'A-3'].map((id) => ({ ...card, id }));
    TestBed.configureTestingModule({
      imports: [ViewCardDialogComponent],
      providers: [
        { provide: DialogStore, useValue: { viewCard: () => ({ card }) } },
        { provide: SaveStore, useValue: { collectionMode: () => false, collection: () => [] } },
        { provide: WebsiteStore, useValue: { deck: () => emptyDeck } },
        { provide: DigimonCardStore, useValue: { cards: () => [], poolCards: () => pool, format: () => 'alysion' } },
        { provide: CardMarketService, useValue: { getPriceData: () => undefined } },
      ],
    });
    const fixture = TestBed.createComponent(ViewCardDialogComponent);
    fixture.detectChanges();
    // A paper restriction does not show for the same card in Alysion mode
    fixture.componentInstance.card = { ...card, cardNumber: 'BT1-084', restrictions: { ...card.restrictions, english: 'Banned' } };
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#Restriction')).toBeNull();

    const ids = Array.from(fixture.nativeElement.querySelector('#Effects').children, (element: Element) => element.id);
    expect(ids).toEqual(
      expect.arrayContaining(['Option-Colour-Requirement', 'Option-Card-Effect', 'Dual-Effect', 'Digimon-Link', 'Link-DP']),
    );
    expect(ids.indexOf('Option-Card-Effect')).toBe(ids.indexOf('Option-Colour-Requirement') + 1);
    expect(ids.indexOf('Option-Colour-Requirement')).toBeLessThan(ids.indexOf('Option-Card-Effect'));
    expect(ids.indexOf('Option-Card-Effect')).toBeLessThan(ids.indexOf('Dual-Effect'));
    expect(ids.indexOf('Dual-Effect')).toBeLessThan(ids.indexOf('Link-DP'));
    expect(ids.indexOf('Digimon-Link')).toBeLessThan(ids.indexOf('Link-DP'));

    fixture.componentInstance.card = {
      ...dummyCard,
      optionCardColourRequirement: '-',
      optionCardEffect: '-',
      dualEffect: '-',
      linkDP: '-',
    };
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#Option-Colour-Requirement')).toBeNull();
    expect(fixture.nativeElement.querySelector('#Option-Card-Effect')).toBeNull();
    expect(fixture.nativeElement.querySelector('#Dual-Effect')).toBeNull();
    expect(fixture.nativeElement.querySelector('#Link-DP')).toBeNull();

    fixture.componentInstance.card = { ...dummyCard, linkEffect: '-', linkDP: '+1000' };
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#Digimon-Link')).toBeNull();
    expect(fixture.nativeElement.querySelector('#Link-DP').textContent).toContain('+1000');

    // Previous / next stay inside the current mode's cards
    fixture.componentInstance.card = pool[1];
    fixture.componentInstance.nextCard();
    expect(fixture.componentInstance.card.id).toBe('A-3');
    fixture.componentInstance.previousCard();
    expect(fixture.componentInstance.card.id).toBe('A-2');
  });
});
