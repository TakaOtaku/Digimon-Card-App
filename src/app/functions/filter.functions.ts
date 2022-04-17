import {ICard, ICountCard, IFilter, ISort} from "../../models";

export function filterCards(cards: ICard[], collection: ICountCard[], filter: IFilter, sort: ISort): ICard[] {
  let filteredCards = applyCardCountFilter(cards, collection, filter.cardCountFilter);
  filteredCards = applySearchFilter(filteredCards, filter.searchFilter);

  filteredCards = applyFilter(filteredCards, filter.setFilter, 'id');
  filteredCards = applyFilter(filteredCards, filter.colorFilter, 'color');
  filteredCards = applyFilter(filteredCards, filter.cardTypeFilter, 'cardType');
  filteredCards = applyFilter(filteredCards, filter.formFilter, 'form');
  filteredCards = applyFilter(filteredCards, filter.attributeFilter, 'attribute');
  filteredCards = applyFilter(filteredCards, filter.typeFilter, 'type');
  filteredCards = applyFilter(filteredCards, filter.lvFilter, 'cardLv');
  filteredCards = applyFilter(filteredCards, filter.rarityFilter, 'rarity');
  filteredCards = applyFilter(filteredCards, filter.versionFilter, 'version');

  filteredCards = applySortOrder(filteredCards, sort);
  return filteredCards;
}

//region Filter Functions
function applySearchFilter(cards: ICard[], searchFilter: string): ICard[] {
  if(searchFilter === '') {return cards;}

  const idFiltered: ICard[] = cards.filter(cards => cards.id.toLowerCase().includes(searchFilter.toLowerCase()));
  const nameFiltered: ICard[] = cards.filter(cards => cards.name.toLowerCase().includes(searchFilter.toLowerCase()));
  const formFiltered: ICard[] = cards.filter(cards => cards.form.toLowerCase().includes(searchFilter.toLowerCase()));
  const attributeFiltered: ICard[] = cards.filter(cards => cards.attribute.toLowerCase().includes(searchFilter.toLowerCase()));
  const typeFiltered: ICard[] = cards.filter(cards => cards.type.toLowerCase().includes(searchFilter.toLowerCase()));
  const effectFiltered: ICard[] = cards.filter(cards => cards.effect.toLowerCase().includes(searchFilter.toLowerCase()));
  const inheritedFiltered: ICard[] = cards.filter(cards => cards.digivolveEffect.toLowerCase().includes(searchFilter.toLowerCase()));
  const securityFiltered: ICard[] = cards.filter(cards => cards.securityEffect.toLowerCase().includes(searchFilter.toLowerCase()));

  return [...new Set([
    ...idFiltered,
    ...nameFiltered,
    ...formFiltered,
    ...attributeFiltered,
    ...typeFiltered,
    ...effectFiltered,
    ...inheritedFiltered,
    ...securityFiltered
  ])];
}

function applyCardCountFilter(cards: ICard[], collection: ICountCard[], cardCountFilter: number|null): ICard[] {
  if (cardCountFilter == null) {return cards;}

  let filteredCards: ICard[] = [];
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

function applyFilter(cards: ICard[], filter: string[], key: string): ICard[] {
  if(filter.length === 0) {return cards;}

  let returnArray = [] as ICard[];
  switch (key) {
    default:
    case 'id':
      filter.forEach(filter => returnArray = [...new Set(
        [...returnArray,...cards.filter(cards => cards['id'].includes(filter))]
      )]);
      break;
    case 'color':
      filter.forEach(filter => returnArray = [...new Set(
        [...returnArray,...cards.filter(cards => cards['color'].includes(filter))]
      )]);
      break;
    case 'cardType':
      filter.forEach(filter => returnArray = [...new Set(
        [...returnArray,...cards.filter(cards => cards['cardType'].includes(filter))]
      )]);
      break;
    case 'form':
      filter.forEach(filter => returnArray = [...new Set(
        [...returnArray,...cards.filter(cards => cards['form'].includes(filter))]
      )]);
      break;
    case 'attribute':
      filter.forEach(filter => returnArray = [...new Set(
        [...returnArray,...cards.filter(cards => cards['attribute'].includes(filter))]
      )]);
      break;
    case 'type':
      filter.forEach(filter => returnArray = [...new Set(
        [...returnArray,...cards.filter(cards => cards['type'].includes(filter))]
      )]);
      break;
    case 'cardLv':
      filter.forEach(filter => returnArray = [...new Set(
        [...returnArray,...cards.filter(cards => cards['cardLv'].includes(filter))]
      )]);
      break;
    case 'rarity':
      filter.forEach(filter => returnArray = [...new Set(
        [...returnArray,...cards.filter(cards => cards['rarity'].includes(filter))]
      )]);
      break;
    case 'version':
      filter.forEach(filter => returnArray = [...new Set(
        [...returnArray,...cards.filter(cards => cards['version'].includes(filter))]
      )]);
      break;
  }

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
