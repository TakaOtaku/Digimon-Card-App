import { TestBed } from '@angular/core/testing';
import { MongoBackendService } from '@services';
import { DigimonCardStore, SaveStore, WebsiteStore } from '@store';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { emptyDeck, emptySave, IDeck } from '../../../models';
import { decksForMode } from '../../functions/alysion.functions';
import { AuthService } from '../../services/auth.service';

const deck = (id: string, cards: string[], sideDeck: string[] = []): IDeck => ({
  ...emptyDeck,
  id,
  cards: cards.map((card) => ({ id: card, count: 1 })),
  sideDeck: sideDeck.map((card) => ({ id: card, count: 1 })),
});

const released = deck('released', ['BT1-010', 'BD01-02_P1', 'ST01-07', 'ST6-01'], ['BT4-001']);
const decks = [released, deck('newer', ['BT1-010', 'BT24-001']), deck('side', ['BT1-010'], ['EX1-001']), deck('alt', ['BT1-010_P1']), deck('empty', [])];

describe('community decks in Alysion mode', () => {
  it('lists only decks made entirely of released Alysion cards', () => {
    expect(decksForMode(decks, 'alysion').map((d) => d.id)).toEqual(['released']);
    expect(decksForMode(decks, 'paper')).toBe(decks);
  });

  it('filters what the community deck search returns', () => {
    TestBed.configureTestingModule({
      providers: [
        { provide: MessageService, useValue: {} },
        { provide: AuthService, useValue: {} },
        { provide: MongoBackendService, useValue: { getDecksPaginated: () => of({ data: decks, pagination: {} }) } },
      ],
    });
    TestBed.inject(SaveStore).updateSettings({ ...emptySave.settings, alysionMode: true });
    TestBed.inject(DigimonCardStore).updateFormat('alysion');
    const website = TestBed.inject(WebsiteStore);
    website.switchFormat('alysion');
    expect(website.communityDecks().map((d) => d.id)).toEqual(['released']);
    website.loadDecksPage(2);
    expect(website.communityDecks().map((d) => d.id)).toEqual(['released']);
    website.loadCommunityDecks();
    expect(website.communityDecks().map((d) => d.id)).toEqual(['released']);
  });
});
