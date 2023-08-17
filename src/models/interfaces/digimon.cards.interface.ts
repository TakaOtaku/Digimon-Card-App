import { DigimonCard } from './digimon-card.interface';

export interface IDigimonCards {
  allCards: DigimonCard[];
  digimonCardMap: Map<string, DigimonCard>;
  filteredCards: DigimonCard[];
}
