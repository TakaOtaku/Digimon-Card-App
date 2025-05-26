export interface AA {
  id: string;
  illustrator: string;
  note: string;
  type: string;
}

export interface DigivolveCondition {
  color: string;
  cost: string;
  level: string;
}

export interface DigimonCard {
  aceEffect: string;
  attribute: string;
  block: string[];
  burstDigivolve: string;
  cardImage: string;
  cardLv: string;
  cardNumber: string;
  cardType: string;
  color: string;
  linkRequirement: string;
  linkDP: string;
  linkEffect: string;
  rule: string;
  digiXros: string;
  assembly?: string;
  digivolveCondition: DigivolveCondition[];
  digivolveEffect: string;
  dnaDigivolve: string;
  dp: string;
  effect: string;
  form: string;
  id: string;
  illustrator: string;
  name: {
    english: string;
    japanese: string;
    korean: string;
    simplifiedChinese: string;
    traditionalChinese: string;
  };
  notes: string;
  playCost: string;
  rarity: string;
  restrictions: {
    chinese: string;
    english: string;
    japanese: string;
    korean: string;
  };
  securityEffect: string;
  specialDigivolve: string;
  type: string;
  version: string;
}
