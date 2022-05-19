export interface ISettings {
  cardSet: string; // English/Japanese/Both/Overwrite ---- default = Overwrite

  cardSize: number; // How big should the cards be ---- default = 10

  collectionMode: boolean; // Do you want to show cardCount for the Collection ---- default = true
  collectionMinimum: number; // How many cards do you want to collect to color it ---- default = 1
  showPreRelease: boolean; // Show Pre-Release Stamped Cards ---- default = false
  showStampedCards: boolean; // Show Stamped Cards ---- default = true
  showAACards: boolean; // Show AA Cards ---- default = true
  sortDeckOrder: string; // Set Deck-Sort Order ---- default = Level
}
