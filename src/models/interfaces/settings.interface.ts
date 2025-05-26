export interface ISettings {
  cardSet: string; // English/Japanese/Both/Overwrite ---- default = Overwrite

  collectionMode: boolean; // Do you want to show cardCount for the Collection ---- default = true
  collectionSets: string[]; // Which Sets do you want to collect ---- default = All
  collectionMinimum: number; // How many cards do you want to collect to color it ---- default = 1
  aaCollectionMinimum: number; // How many aa cards do you want to collect to color it ---- default = 1

  showNormalCards: boolean; // Show Normal Cards ---- default = false
  showAACards: boolean; // Show AA Cards ---- default = false
  showFoilCards: boolean; // Show Foil Cards ---- default = false
  showTexturedCards: boolean; // Show Textured Cards ---- default = false
  showPreRelease: boolean; // Show Pre-Release Stamped Cards ---- default = false
  showBoxTopper: boolean; // Show Box Topper Cards ---- default = false
  showFullArtCards: boolean; // Show Full Art Cards ---- default = false
  showStampedCards: boolean; // Show Stamped Cards ---- default = false
  showSpecialRareCards: boolean; // Show Special Rare Cards ---- default = false
  showRarePullCards: boolean; // Show Rare Pull Cards ---- default = false

  showReprintCards: boolean; // Show Reprint Cards ---- default = false

  sortDeckOrder: string; // Set Deck-Sort Order ---- default = Level
  showUserStats: boolean; // Show User-Stats in the Profil Yes or no ---- default = true
  deckDisplayTable: boolean; // Display Decks as Table instead of Big Blocks
  displaySideDeck: boolean; // Display SideDeck in the DeckView
  fullscreenFilter: boolean; // Display Filter with big screen
  countMax: number; // How high do you want to set the count-filter
}
