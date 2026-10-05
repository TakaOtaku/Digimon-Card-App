import { IDeck } from './deck.interface';

/**
 * Tournament Deck interface (extends regular deck)
 * Used for tournament-specific deck functionality in legacy backend
 */
export interface ITournamentDeck extends IDeck {
    // Tournament-specific fields can be added here if needed
    // For now, it's the same as a regular deck
}
