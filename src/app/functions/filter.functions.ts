import {ICard, ICountCard, IFilter, ISort} from "../../models";

export function filterCards(cards: ICard[], collection: ICountCard[], filter: IFilter, sort: ISort): ICard[] {
  let filteredCards = applyCardCountFilter(cards, collection, filter.cardCountFilter);
  filteredCards = applySearchFilter(filteredCards, filter.searchFilter);
  filteredCards = applySetFilter(filteredCards, filter.setFilter);
  filteredCards = applyColorFilter(filteredCards, filter.colorFilter);
  filteredCards = applyCardTypeFilter(filteredCards, filter.cardTypeFilter);
  filteredCards = applyTypeFilter(filteredCards, filter.typeFilter);
  filteredCards = applyLvFilter(filteredCards, filter.lvFilter);
  filteredCards = applyRarityFilter(filteredCards, filter.rarityFilter);
  filteredCards = applyVersionFilter(filteredCards, filter.versionFilter);
  filteredCards = applySortOrder(filteredCards, sort);
  return filteredCards;
}

//region Filter Functions
function applySearchFilter(cards: ICard[], searchFilter: string): ICard[] {
  if(searchFilter === '') {return cards;}

  const nameFiltered: ICard[] = cards.filter(cards => cards.name.includes(searchFilter));
  const effectFiltered: ICard[] = cards.filter(cards => cards.effect.includes(searchFilter));
  const inheritedFiltered: ICard[] = cards.filter(cards => cards.digivolveEffect.includes(searchFilter));
  const securityFiltered: ICard[] = cards.filter(cards => cards.securityEffect.includes(searchFilter));

  return [...new Set([...nameFiltered, ...effectFiltered, ...inheritedFiltered, ...securityFiltered])];
}

function applyCardCountFilter(cards: ICard[], collection: ICountCard[], cardCountFilter: number | null): ICard[] {
  if (cardCountFilter == null) {
    return cards;
  }

  // 0: Take all Cards that are 0 or not in the Collection
  // >0: Take all Cards that are >0 that are in the Collection
  let filteredCards: ICard[];
  if (cardCountFilter === 0) {
    const collectionCards = collection.filter(card => card.count !== cardCountFilter);
    filteredCards = cards.filter(card => !containsCard(card.id, collectionCards))
  } else {
    const collectionCards = collection.filter(card => card.count === cardCountFilter);
    filteredCards = cards.filter(card => containsCard(card.id, collectionCards))
  }
  return [...new Set([...filteredCards])];
}

function containsCard(cardId: string, collectionArray: ICountCard[]): boolean {
  let cardInCollection = false;
  collectionArray.forEach(collection => {
    if (cardId === collection.id) {
      cardInCollection = true;
    }
  });
  return cardInCollection;
}

function applySetFilter(cards: ICard[], setFilter: string[]): ICard[] {
  if(setFilter.length === 0) {return cards;}

  let returnArray = [] as ICard[];
  setFilter.forEach(filter => {
    const filteredCards: ICard[] = cards.filter(cards => cards.id.includes(filter));
    returnArray = [...new Set([...returnArray,...filteredCards])]
  })
  return returnArray;
}

function applyColorFilter(cards: ICard[], colorFilter: string[]): ICard[] {
  if(colorFilter.length === 0) {return cards;}

  let returnArray = [] as ICard[];
  colorFilter.forEach(filter => {
    const filteredCards: ICard[] = cards.filter(cards => cards.color.includes(filter));
    returnArray = [...new Set([...returnArray,...filteredCards])]
  })
  return returnArray;
}

function applyCardTypeFilter(cards: ICard[], cardTypeFilter: string[]): ICard[] {
  if(cardTypeFilter.length === 0) {return cards;}

  let returnArray = [] as ICard[];
  cardTypeFilter.forEach(filter => {
    const filteredCards: ICard[] = cards.filter(cards => cards.cardType.includes(filter));
    returnArray = [...new Set([...returnArray,...filteredCards])]
  })
  return returnArray;
}

function applyTypeFilter(cards: ICard[], typeFilter: string[]): ICard[] {
  if(typeFilter.length === 0) {return cards;}

  let returnArray = [] as ICard[];
  typeFilter.forEach(filter => {
    const filteredCards: ICard[] = cards.filter(cards => cards.attribute.includes(filter));
    returnArray = [...new Set([...returnArray,...filteredCards])]
  })
  return returnArray;
}

function applyLvFilter(cards: ICard[], lvFilter: string[]): ICard[] {
  if(lvFilter.length === 0) {return cards;}

  let returnArray = [] as ICard[];
  lvFilter.forEach(filter => {
    const filteredCards: ICard[] = cards.filter(cards => cards.cardLv.includes(filter));
    returnArray = [...new Set([...returnArray,...filteredCards])]
  })
  return returnArray;
}

function applyRarityFilter(cards: ICard[], rarityFilter: string[]): ICard[] {
  if(rarityFilter.length === 0) {return cards;}

  let returnArray = [] as ICard[];
  rarityFilter.forEach(filter => {
    const filteredCards: ICard[] = cards.filter(cards => cards.rarity === filter);
    returnArray = [...new Set([...returnArray,...filteredCards])]
  })
  return returnArray;
}

function applyVersionFilter(cards: ICard[], versionFilter: string[]): ICard[] {
  if(versionFilter.length === 0) {return cards;}

  let returnArray = [] as ICard[];
  versionFilter.forEach(filter => {
    const filteredCards: ICard[] = cards.filter(cards => cards.version.includes(filter));
    returnArray = [...new Set([...returnArray,...filteredCards])]
  })
  return returnArray;
}

function applySortOrder(cards: ICard[], sort: ISort): ICard[] {
  const returnArray = [...new Set([...cards])];
  if(sort.sortBy.element === 'playCost' || sort.sortBy.element === 'dp' ) {
    return sort.ascOrder ? returnArray.sort(dynamicSortNumber(sort.sortBy.element)) : returnArray.sort(dynamicSortNumber(`-${sort.sortBy.element}`));
  }
  return sort.ascOrder ? returnArray.sort(dynamicSort(sort.sortBy.element)) : returnArray.sort(dynamicSort(`-${sort.sortBy.element}`));
}
//endregion

export function dynamicSort(property: string): any {
  let sortOrder = 1;
  if (property[0] === "-") {
    sortOrder = -1;
    property = property.substr(1);
  }
  return function (a: any, b: any) {
    let result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
    return result * sortOrder;
  }
}

function dynamicSortNumber(property: string): any {
  let sortOrder = 1;
  if(property[0] === "-") {
    sortOrder = -1;
    property = property.substr(1);
  }
  return function (a:any, b:any) {
    const first: number = a[property]>>>0;
    const second: number = b[property]>>>0;
    let result = (first < second) ? -1 : (first > second) ? 1 : 0;
    return result * sortOrder;
  }
}
//endregion
