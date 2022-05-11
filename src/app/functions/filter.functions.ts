import {ICard, ICountCard, IFilter, ISort} from "../../models";

export function filterCards(cards: ICard[], collection: ICountCard[], filter: IFilter, sort: ISort): ICard[] {
  let filteredCards = applySearchFilter(cards, filter.searchFilter);

  filteredCards = applyCardCountFilter(filteredCards, collection, filter.cardCountFilter);

  filteredCards = applyFilter(filteredCards, filter.setFilter, 'id');
  filteredCards = applyFilter(filteredCards, filter.colorFilter, 'color');
  filteredCards = applyFilter(filteredCards, filter.cardTypeFilter, 'cardType');
  filteredCards = applyFilter(filteredCards, filter.formFilter, 'form');
  filteredCards = applyFilter(filteredCards, filter.attributeFilter, 'attribute');
  filteredCards = applyFilter(filteredCards, filter.typeFilter, 'type');
  filteredCards = applyFilter(filteredCards, filter.rarityFilter, 'rarity');
  filteredCards = applyFilter(filteredCards, filter.versionFilter, 'version');
  filteredCards = applyFilter(filteredCards, filter.keywordFilter, 'keyword');
  filteredCards = applyFilter(filteredCards, filter.illustratorFilter, 'illustrator');

  filteredCards = applyRangeFilter(filteredCards, filter.levelFilter, 'level');
  filteredCards = applyRangeFilter(filteredCards, filter.playCostFilter, 'playCost');
  filteredCards = applyRangeFilter(filteredCards, filter.digivolutionFilter, 'digivolution');
  filteredCards = applyRangeFilter(filteredCards, filter.dpFilter, 'dp');


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
  const noteFiltered: ICard[] = cards.filter(cards => cards.notes.toLowerCase().includes(searchFilter.toLowerCase()));
  const illustratorFiltered: ICard[] = cards.filter(cards => cards.illustrator.toLowerCase().includes(searchFilter.toLowerCase()));
  const dnaFiltered: ICard[] = cards.filter(cards => cards.dnaDigivolve.toLowerCase().includes(searchFilter.toLowerCase()));
  const specialFiltered: ICard[] = cards.filter(cards => cards.specialDigivolve.toLowerCase().includes(searchFilter.toLowerCase()));

  return [...new Set([
    ...idFiltered,
    ...nameFiltered,
    ...formFiltered,
    ...attributeFiltered,
    ...typeFiltered,
    ...effectFiltered,
    ...inheritedFiltered,
    ...securityFiltered,
    ...noteFiltered,
    ...illustratorFiltered,
    ...dnaFiltered,
    ...specialFiltered
  ])];
}

function applyCardCountFilter(cards: ICard[], collection: ICountCard[], cardCountFilter: number[]): ICard[] {
  const tempCollection: ICountCard[] = [];
  cards.forEach(card => {
    const count = collection.find(cc => cc.id === card.id)?.count ?? 0;
    tempCollection.push({id: card.id, count})
  });

  const filteredCollection = tempCollection.filter(card => {
    if(cardCountFilter[1] === 5) {return cardCountFilter[0] <= card.count}
    return cardCountFilter[0] <= card.count && card.count <= cardCountFilter[1];
  });

  let filteredCards: ICard[] = [];
  filteredCollection.forEach(card => {
    filteredCards.push(cards.find(value => value.id === card.id)!);
  })

  return [...new Set([...filteredCards])];
}

function applyFilter(cards: ICard[], filter: any[], key: string): ICard[] {
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
      filter.forEach(filter => {
        if(filter === 'Multi') {
          returnArray = [...new Set([...returnArray, ...cards.filter(cards => cards['color'].includes('/'))])];
        } else {
          returnArray = [...new Set([...returnArray, ...cards.filter(cards => cards['color'].includes(filter))])];
        }
      });
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
        [...returnArray,...cards.filter(card => {
          const types = card['type'].split('/');

          let shouldReturn = false;
          types.forEach(type => {
            if (type === filter) {
              shouldReturn = true;
            }
          })
          return shouldReturn;
        })]
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
    case 'keyword':
      filter.forEach(filter => returnArray = [...new Set(
        [...returnArray,...cards.filter(cards =>
          cards['effect'].includes(filter) ||
          cards['digivolveEffect'].includes(filter))]
      )]);
      break;
    case 'illustrator':
      filter.forEach(filter => returnArray = [...new Set(
        [...returnArray,...cards.filter(cards => cards['illustrator'].includes(filter))]
      )]);
      break;
  }

  return returnArray;
}

function applyRangeFilter(cards: ICard[], filter: number[], key: string): ICard[] {
  let returnArray = [] as ICard[];
  switch (key) {
    default:
    case 'level':
      if(filter[0] === 2 && filter[1] === 7) {return  cards}

      if(filter[1] === 7) {
        return [...new Set([...cards.filter(cards => {
          const level: number = +cards['cardLv'].substring(3) >>> 0;
          return filter[0] <= level;
        })])];
      }

      return [...new Set([...cards.filter(cards => {
        const level: number = +cards['cardLv'].substring(3) >>> 0;
        return filter[0] <= level && filter[1] >= level
      })])];
    case 'playCost':
      if(filter[0] === 0 && filter[1] === 20) {return  cards}

      if(filter[1] === 20) {
        return [...new Set([...cards.filter(cards => {
          const playCost: number = +cards['playCost'] >>> 0;
          return filter[0] <= playCost;
        })])];
      }

      return [...new Set([...cards.filter(cards => {
        const playCost: number = +cards['playCost'] >>> 0;
        return filter[0] <= playCost && filter[1] >= playCost
      })])];
    case 'digivolution':
      if(filter[0] === 0 && filter[1] === 7) {return  cards}

      return [...new Set([...cards.filter(cards => {
        const digivolution1: number = +cards['digivolveCost1'].split(' ')[0] >>> 0;
        const digivolution2: number = +cards['digivolveCost2'].split(' ')[0] >>> 0;

        if(cards['digivolveCost1'] === '-') {
          return false;
        }
        if (cards['digivolveCost2'] === '-') {
          if(filter[1] === 7) {
            return (filter[0] <= digivolution1);
          }

          return (filter[0] <= digivolution1 && filter[1] >= digivolution1);
        }

        if(filter[1] === 6) {
          return filter[0] <= digivolution1 || filter[0] <= digivolution2;
        }

        return (filter[0] <= digivolution1 && filter[1] >= digivolution1) ||
          (filter[0] <= digivolution2 && filter[1] >= digivolution2);
      })])];
    case 'dp':
      if(filter[0] === 1 && filter[1] === 16) {return  cards}

      return [...new Set([...cards.filter(cards => {
        const dp: number = +cards['dp'] >>> 0;

        if(cards['dp'] === '-') {
          return false;
        }

        const a: number = +(filter[0]+'000') >>> 0;
        const b: number = +(filter[1]+'000') >>> 0;

        if(filter[1] === 16) {
          return a <= dp;
        }

        return a <= dp && b >= dp;
      })])];
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
    let result = a[property].toLowerCase().localeCompare(
      b[property].toLowerCase(),
      undefined,
      {
        numeric: true,
        sensitivity: 'base',
      }
    );
    return result * sortOrder;
  }
}

export function dynamicSortNumber(property: string): any {
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
