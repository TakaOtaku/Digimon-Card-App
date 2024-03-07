import { DRAG } from '../enums';
import { DigimonCard } from './digimon-card.interface';

export interface IDraggedCard {
  card: DigimonCard;
  drag: DRAG;
}
