import { IDeck } from './deck.interface';

export interface ITournamentDeck extends IDeck {
  placement: number;
  country: string;
  player: string;
  host: string;
  format: string;
}
