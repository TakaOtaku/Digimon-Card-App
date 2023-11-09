/* eslint-disable prettier/prettier */
import { DigimonCard, ICountCard, IFilter, ISort } from '../../models';
import { UltimateCup2023, UltimateCup2024 } from '../../models/data/presets.data';

let digimonCardMap = new Map<string, DigimonCard>();
export function filterCards(
  cards: DigimonCard[],
  collection: ICountCard[],
  filter: IFilter,
  sort: ISort,
  cardMap: Map<string, DigimonCard>
): DigimonCard[] {
  digimonCardMap = cardMap;
  let filteredCards = applySearchFilter(cards, filter.searchFilter);

  filteredCards = applyCardCountFilter(
    filteredCards,
    collection,
    filter.cardCountFilter
  );

  filteredCards = applyFilter(filteredCards, filter.setFilter, 'id');
  filteredCards = applyFilter(filteredCards, filter.colorFilter, 'color');
  filteredCards = applyFilter(filteredCards, filter.cardTypeFilter, 'cardType');
  filteredCards = applyFilter(filteredCards, filter.formFilter, 'form');
  filteredCards = applyFilter(
    filteredCards,
    filter.attributeFilter,
    'attribute'
  );
  filteredCards = applyFilter(filteredCards, filter.typeFilter, 'type');
  filteredCards = applyFilter(filteredCards, filter.rarityFilter, 'rarity');
  filteredCards = applyFilter(filteredCards, filter.versionFilter, 'version');
  filteredCards = applyFilter(filteredCards, filter.keywordFilter, 'keyword');
  filteredCards = applyFilter(
    filteredCards,
    filter.specialRequirementsFilter,
    'specialRequirements'
  );
  filteredCards = applyFilter(
    filteredCards,
    filter.illustratorFilter,
    'illustrator'
  );
  filteredCards = applyFilter(filteredCards, filter.blockFilter, 'block');
  filteredCards = applyFilter(
    filteredCards,
    filter.restrictionsFilter,
    'restriction'
  );
  filteredCards = applyFilter(filteredCards, filter.sourceFilter, 'source');

  filteredCards = applyRangeFilter(filteredCards, filter.levelFilter, 'level');
  filteredCards = applyRangeFilter(
    filteredCards,
    filter.playCostFilter,
    'playCost'
  );
  filteredCards = applyRangeFilter(
    filteredCards,
    filter.digivolutionFilter,
    'digivolution'
  );
  filteredCards = applyRangeFilter(filteredCards, filter.dpFilter, 'dp');

  filteredCards = applyPresetFilter(filteredCards, filter.presetFilter);

  filteredCards = applySortOrder(filteredCards, sort, collection);
  return filteredCards;
}

//region Filter Functions
function applySearchFilter(
  cards: DigimonCard[],
  searchFilter: string
): DigimonCard[] {
  if (searchFilter === '') {
    return cards;
  }

  function deepSearch(obj: any): boolean {
    if (typeof obj === 'string') {
      return obj.toLowerCase().includes(searchFilter.toLowerCase());
    }

    if (Array.isArray(obj)) {
      return obj.some((item) => deepSearch(item));
    }

    if (typeof obj === 'object') {
      return Object.values(obj).some((value) => deepSearch(value));
    }

    return false;
  }

  return cards.filter((card) => deepSearch(card));
}

function applyCardCountFilter(
  cards: DigimonCard[],
  collection: ICountCard[],
  cardCountFilter: number[]
): DigimonCard[] {
  const tempCollection: ICountCard[] = [];
  cards.forEach((card) => {
    const count = collection.find((cc) => cc.id === card.id)?.count ?? 0;
    tempCollection.push({ id: card.id, count });
  });

  const filteredCollection = tempCollection.filter((card) => {
    if (cardCountFilter[1] === 5) {
      return cardCountFilter[0] <= card.count;
    }
    return cardCountFilter[0] <= card.count && card.count <= cardCountFilter[1];
  });

  let filteredCards: DigimonCard[] = [];
  filteredCollection.forEach((card) => {
    filteredCards.push(cards.find((value) => value.id === card.id)!);
  });

  return [...new Set([...filteredCards])];
}

function applyFilter(
  cards: DigimonCard[],
  filter: any[],
  key: string
): DigimonCard[] {
  if (filter.length === 0) {
    return cards;
  }

  let returnArray = [] as DigimonCard[];
  switch (key) {
    default:
    case 'id':
      filter.forEach(
        (filter) =>
          (returnArray = [
            ...new Set([
              ...returnArray,
              ...cards.filter((cards) => cards['id'].split('-')[0] === filter),
            ]),
          ])
      );
      break;
    case 'color':
      filter.forEach((filter) => {
        if (filter === 'Multi') {
          returnArray = [
            ...new Set([
              ...returnArray,
              ...cards.filter((cards) => cards['color'].includes('/')),
            ]),
          ];
        } else {
          returnArray = [
            ...new Set([
              ...returnArray,
              ...cards.filter((cards) => cards['color'].includes(filter)),
            ]),
          ];
        }
      });
      break;
    case 'cardType':
      filter.forEach(
        (filter) =>
          (returnArray = [
            ...new Set([
              ...returnArray,
              ...cards.filter((cards) => cards['cardType'].includes(filter)),
            ]),
          ])
      );
      break;
    case 'form':
      filter.forEach(
        (filter) =>
          (returnArray = [
            ...new Set([
              ...returnArray,
              ...cards.filter((cards) => cards['form'].includes(filter)),
            ]),
          ])
      );
      break;
    case 'attribute':
      filter.forEach(
        (filter) =>
          (returnArray = [
            ...new Set([
              ...returnArray,
              ...cards.filter((cards) => cards['attribute'].includes(filter)),
            ]),
          ])
      );
      break;
    case 'type':
      filter.forEach(
        (filter) =>
          (returnArray = [
            ...new Set([
              ...returnArray,
              ...cards.filter((card) => {
                const types = card['type'].split('/');

                let shouldReturn = false;
                types.forEach((type) => {
                  if (type === filter) {
                    shouldReturn = true;
                  }
                });
                return shouldReturn;
              }),
            ]),
          ])
      );
      break;
    case 'cardLv':
      filter.forEach(
        (filter) =>
          (returnArray = [
            ...new Set([
              ...returnArray,
              ...cards.filter((cards) => cards['cardLv'] === filter),
            ]),
          ])
      );
      break;
    case 'rarity':
      filter.forEach(
        (filter) =>
          (returnArray = [
            ...new Set([
              ...returnArray,
              ...cards.filter((cards) => cards['rarity'] === filter),
            ]),
          ])
      );
      break;
    case 'version':
      filter.forEach(
        (current) =>
          (returnArray = [
            ...new Set([
              ...returnArray,
              ...cards.filter((cards) => cards['version'].includes(current)),
            ]),
          ])
      );
      break;
    case 'keyword':
      filter.forEach(
        (filter) =>
          (returnArray = [
            ...new Set([
              ...returnArray,
              ...cards.filter(
                (cards) =>
                  cards['effect'].includes(filter) ||
                  cards['digivolveEffect'].includes(filter)
              ),
            ]),
          ])
      );
      break;
    case 'specialRequirements':
      if (filter.find((value) => value === 'Digivolve')) {
        returnArray = [
          ...new Set([
            ...returnArray,
            ...cards.filter((cards) => cards['specialDigivolve'] !== '-'),
          ]),
        ];
      }
      if (filter.find((value) => value === 'Burst Digivolve')) {
        returnArray = [
          ...new Set([
            ...returnArray,
            ...cards.filter(
              (cards) =>
                cards['burstDigivolve'] && cards['burstDigivolve'] !== '-'
            ),
          ]),
        ];
      }
      if (filter.find((value) => value === 'DNA Digivolution')) {
        returnArray = [
          ...new Set([
            ...returnArray,
            ...cards.filter((cards) => cards['dnaDigivolve'] !== '-'),
          ]),
        ];
      }
      if (filter.find((value) => value === 'ACE')) {
        returnArray = [
          ...new Set([
            ...returnArray,
            ...cards.filter(
              (cards) => cards['aceEffect'] && cards['aceEffect'] !== '-'
            ),
          ]),
        ];
      }
      if (filter.find((value) => value === 'DigiXros')) {
        returnArray = [
          ...new Set([
            ...returnArray,
            ...cards.filter((cards) => cards['digiXros'] !== '-'),
          ]),
        ];
      }

      break;
    case 'illustrator':
      filter.forEach(
        (filter) =>
          (returnArray = [
            ...new Set([
              ...returnArray,
              ...cards.filter((cards) => cards['illustrator'].includes(filter)),
            ]),
          ])
      );
      break;
    case 'block':
      filter.forEach(
        (filter) =>
          (returnArray = [
            ...new Set([
              ...returnArray,
              ...cards.filter((cards) => cards['block'].includes(filter)),
            ]),
          ])
      );
      break;
    case 'restriction':
      filter.forEach((filter) => {
          returnArray = [
            ...new Set([
              ...returnArray,
              ...cards.filter((cards) => cards.restrictions.english === filter),
            ]),
          ];
      })
      break;
    case 'source':
      filter.forEach(
        (filter) =>
          (returnArray = [
            ...new Set([
              ...returnArray,
              ...cards.filter((cards) => cards['notes'] === filter),
            ]),
          ])
      );
      break;
  }

  return returnArray;
}

function applyRangeFilter(
  cards: DigimonCard[],
  filter: number[],
  key: string
): DigimonCard[] {
  let returnArray = [] as DigimonCard[];
  switch (key) {
    default:
    case 'level':
      if (filter[0] === 2 && filter[1] === 7) {
        return cards;
      }

      if (filter[1] === 7) {
        return [
          ...new Set([
            ...cards.filter((cards) => {
              const level: number = +cards['cardLv'].substring(3) >>> 0;
              return filter[0] <= level;
            }),
          ]),
        ];
      }

      return [
        ...new Set([
          ...cards.filter((cards) => {
            const level: number = +cards['cardLv'].substring(3) >>> 0;
            return filter[0] <= level && filter[1] >= level;
          }),
        ]),
      ];
    case 'playCost':
      if (filter[0] === 0 && filter[1] === 20) {
        return cards;
      }

      if (filter[1] === 20) {
        return [
          ...new Set([
            ...cards.filter((cards) => {
              const playCost: number = +cards['playCost'] >>> 0;
              return filter[0] <= playCost;
            }),
          ]),
        ];
      }

      return [
        ...new Set([
          ...cards.filter((cards) => {
            const playCost: number = +cards['playCost'] >>> 0;
            return filter[0] <= playCost && filter[1] >= playCost;
          }),
        ]),
      ];
    case 'digivolution':
      if (filter[0] === 0 && filter[1] === 7) {
        return cards;
      }
      return cards;
    /* TODO - Implement
      return [
        ...new Set([
          ...cards.filter((cards) => {
            const digivolution1: number = +cards['digivolveCost1'].split(' ')[0] >>> 0;
            const digivolution2: number = +cards['digivolveCost2'].split(' ')[0] >>> 0;

            if (cards['digivolveCost1'] === '-') {
              return false;
            }
            if (cards['digivolveCost2'] === '-') {
              if (filter[1] === 7) {
                return filter[0] <= digivolution1;
              }

              return filter[0] <= digivolution1 && filter[1] >= digivolution1;
            }

            if (filter[1] === 6) {
              return filter[0] <= digivolution1 || filter[0] <= digivolution2;
            }

            return (filter[0] <= digivolution1 && filter[1] >= digivolution1) || (filter[0] <= digivolution2 && filter[1] >= digivolution2);
          }),
        ]),
      ]; */
    case 'dp':
      if (filter[0] === 1 && filter[1] === 17) {
        return cards;
      }

      return [
        ...new Set([
          ...cards.filter((cards) => {
            const dp: number = +cards['dp'] >>> 0;

            if (cards['dp'] === '-') {
              return false;
            }

            const a: number = +(filter[0] + '000') >>> 0;
            const b: number = +(filter[1] + '000') >>> 0;

            if (filter[1] === 16) {
              return a <= dp;
            }

            return a <= dp && b >= dp;
          }),
        ]),
      ];
  }
}

function applyPresetFilter(
  cards: DigimonCard[],
  filter: string[]
): DigimonCard[] {
  for (const preset of filter) {
    if(preset === 'Ultimate Cup 2023') {
      cards = [
        ...new Set([
          ...cards.filter((card: DigimonCard) => UltimateCup2023.includes(card.id)),
        ]),
      ];
    }
    if(preset === 'Ultimate Cup 2024') {
      cards = [
        ...new Set([
          ...cards.filter((card: DigimonCard) => UltimateCup2024.includes(card.id)),
        ]),
      ];
    }
  }
  return cards;
}


function applySortOrder(
  cards: DigimonCard[],
  sort: ISort,
  collection: ICountCard[]
): DigimonCard[] {
  const returnArray = [...new Set([...cards])];
  if (sort.sortBy.element === 'playCost' || sort.sortBy.element === 'dp') {
    return sort.ascOrder
      ? returnArray.sort(dynamicSortNumber(sort.sortBy.element))
      : returnArray.sort(dynamicSortNumber(`-${sort.sortBy.element}`));
  } else if (sort.sortBy.element === 'count') {
    return sort.ascOrder
      ? returnArray.sort((a, b) => {
          const countA =
            collection.find((card) => card.id === a.id)?.count ?? 0;
          const countB =
            collection.find((card) => card.id === b.id)?.count ?? 0;
          return countA - countB;
        })
      : returnArray.sort((a, b) => {
          const countA =
            collection.find((card) => card.id === a.id)?.count ?? 0;
          const countB =
            collection.find((card) => card.id === b.id)?.count ?? 0;
          return countB - countA;
        });
  }
  return sort.ascOrder
    ? returnArray.sort(dynamicSort(sort.sortBy.element))
    : returnArray.sort(dynamicSort(`-${sort.sortBy.element}`));
}

//endregion

export function dynamicSort(property: string): any {
  let sortOrder = 1;
  if (property[0] === '-') {
    sortOrder = -1;
    property = property.substr(1);
  }
  return function (a: any, b: any) {
    let result = a[property]
      .toLowerCase()
      .localeCompare(b[property].toLowerCase(), undefined, {
        numeric: true,
        sensitivity: 'base',
      });
    return result * sortOrder;
  };
}

export function dynamicSortNumber(property: string): any {
  let sortOrder = 1;
  if (property[0] === '-') {
    sortOrder = -1;
    property = property.substr(1);
  }
  return function (a: any, b: any) {
    const first: number = a[property] >>> 0;
    const second: number = b[property] >>> 0;
    let result = first < second ? -1 : first > second ? 1 : 0;
    return result * sortOrder;
  };
}

export function sortID(a: string, b: string) {
  const aSplit = a.split('-');
  const bSplit = b.split('-');

  const aSetName = hasNumber(aSplit[0]) ? aSplit[0].slice(0, 2) : 'P';
  const bSetName = hasNumber(bSplit[0]) ? bSplit[0].slice(0, 2) : 'P';

  const aSetNumber = hasNumber(aSplit[0])
    ? (aSplit[0].substring(2) as any) >>> 0
    : 99;
  const bSetNumber = hasNumber(bSplit[0])
    ? (bSplit[0].substring(2) as any) >>> 0
    : 99;

  const aSetID = aSplit[1];
  const bSetID = bSplit[1];

  const SetResult = aSetName.localeCompare(bSetName, undefined, {
    numeric: true,
    sensitivity: 'base',
  });

  const SetNumberResult =
    aSetNumber < bSetNumber ? -1 : aSetNumber > bSetNumber ? 1 : 0;

  const IDResult = aSetID < bSetID ? -1 : aSetID > bSetID ? 1 : 0;

  return SetResult || SetNumberResult || IDResult;
}

function hasNumber(myString: string) {
  return /\d/.test(myString);
}
