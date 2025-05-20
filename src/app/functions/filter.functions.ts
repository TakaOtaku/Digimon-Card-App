/* eslint-disable prettier/prettier */
import { DigimonCard, ICountCard, IFilter, ISave, ISort, UltimateCup2023, UltimateCup2024 } from '../../models';

/**
 * Filters and sorts an array of Digimon cards based on multiple criteria.
 *
 * Applies a series of exclusion filters to the input cards, removing any card that matches a filter condition. After filtering, sorts the remaining cards according to the specified sort order.
 *
 * @returns An array of Digimon cards that match all filter criteria, sorted as specified.
 */
export function filterCards(
  cards: DigimonCard[],
  save: ISave,
  filter: IFilter,
  sort: ISort,
  cardMap: Map<string, DigimonCard>,
): DigimonCard[] {
  let filteredCards: DigimonCard[] = cards;
  let removeCards: DigimonCard[] = [];

  cards.forEach((card) => {
    if (filter.searchFilter !== '' && applySearchFilter(card, filter.searchFilter)) {
      removeCards.push(card);
      return;
    }
    if (filter.setFilter.length > 0 && applySetFilter(card, filter.setFilter)) {
      removeCards.push(card);
      return;
    }
    if (filter.rarityFilter.length > 0 && applyRarityFilter(card, filter.rarityFilter)) {
      removeCards.push(card);
      return;
    }
    if (filter.cardTypeFilter.length > 0 && applyCardTypeFilter(card, filter.cardTypeFilter)) {
      removeCards.push(card);
      return;
    }
    if (filter.formFilter.length > 0 && applyFormFilter(card, filter.formFilter)) {
      removeCards.push(card);
      return;
    }
    if (filter.attributeFilter.length > 0 && applyAttributeFilter(card, filter.attributeFilter)) {
      removeCards.push(card);
      return;
    }
    if (filter.illustratorFilter.length > 0 && applyIllustratorFilter(card, filter.illustratorFilter)) {
      removeCards.push(card);
      return;
    }
    if (filter.restrictionsFilter.length > 0 && applyRestrictionFilter(card, filter.restrictionsFilter)) {
      removeCards.push(card);
      return;
    }
    if (filter.blockFilter.length > 0 && applyBlockFilter(card, filter.blockFilter)) {
      removeCards.push(card);
      return;
    }
    if (filter.colorFilter.length > 0 && applyColorFilter(card, filter.colorFilter)) {
      removeCards.push(card);
      return;
    }
    if (filter.typeFilter.length > 0 && applyTypeFilter(card, filter.typeFilter)) {
      removeCards.push(card);
      return;
    }
    if (filter.versionFilter.length > 0 && applyVersionFilter(card, filter.versionFilter)) {
      removeCards.push(card);
      return;
    }
    if (filter.keywordFilter.length > 0 && applyKeywordFilter(card, filter.keywordFilter)) {
      removeCards.push(card);
      return;
    }
    if (filter.specialRequirementsFilter.length > 0 && applySpecialRequirementsFilter(card, filter.specialRequirementsFilter)) {
      removeCards.push(card);
      return;
    }
    if (filter.sourceFilter.length > 0 && applySourceFilter(card, filter.sourceFilter)) {
      removeCards.push(card);
      return;
    }
    if (applyCardCountFilter(card, save, filter.cardCountFilter)) {
      removeCards.push(card);
      return;
    }
    if (applyRangeFilter(card, filter.levelFilter, 'level')) {
      removeCards.push(card);
      return;
    }
    if (applyRangeFilter(card, filter.playCostFilter, 'playCost')) {
      removeCards.push(card);
      return;
    }
    if (applyRangeFilter(card, filter.digivolutionFilter, 'digivolution')) {
      removeCards.push(card);
      return;
    }
    if (applyRangeFilter(card, filter.dpFilter, 'dp')) {
      removeCards.push(card);
      return;
    }
    if (filter.presetFilter.length > 0 && applyPresetFilter(card, filter.presetFilter)) {
      removeCards.push(card);
      return;
    }
  });

  filteredCards = filteredCards.filter((card) => !removeCards.includes(card));

  filteredCards = applySortOrder(filteredCards, sort, save.collection);
  return filteredCards;
}

//region Filter Functions
function applySearchFilter(card: DigimonCard, searchFilter: string): boolean {
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

  return !deepSearch(card);
}

function applySetFilter(card: DigimonCard, filter: string[]): boolean {
  return !filter.includes(card['id'].split('-')[0]);
}

function applyRarityFilter(card: DigimonCard, filter: string[]): boolean {
  return !filter.includes(card['rarity']);
}

function applyCardTypeFilter(card: DigimonCard, filter: string[]): boolean {
  return !filter.includes(card['cardType']);
}

function applyFormFilter(card: DigimonCard, filter: string[]): boolean {
  return !filter.includes(card['form']);
}

function applyAttributeFilter(card: DigimonCard, filter: string[]): boolean {
  return !filter.includes(card['attribute']);
}

function applyIllustratorFilter(card: DigimonCard, filter: string[]): boolean {
  return !filter.includes(card['illustrator']);
}

function applyRestrictionFilter(card: DigimonCard, filter: string[]): boolean {
  return !filter.includes(card.restrictions.english);
}

function applyBlockFilter(card: DigimonCard, filter: string[]): boolean {
  return !filter.some((filter) => card['block'].includes(filter));
}

function applyColorFilter(card: DigimonCard, filters: string[]): boolean {
  if (filters.includes('Multi') && filters.length === 1) {
    return !card['color'].includes('/');
  } else if (filters.includes('Multi')) {
    const removeIfSmallerThanFilter = [];
    filters.forEach((filter) => {
      if (filter === 'Multi') {
        removeIfSmallerThanFilter.push(filter);
      }
      if (card['color'].includes(filter)) {
        removeIfSmallerThanFilter.push(filter);
      }
    });
    return removeIfSmallerThanFilter.length !== filters.length;
  } else {
    return !filters.some((filter) => card.color.includes(filter));
  }
}

function applyTypeFilter(card: DigimonCard, filter: string[]): boolean {
  return !filter.some((filter) => card['type'].split('/').includes(filter));
}

/**
 * Excludes a card if its version matches any of the specified version filters.
 *
 * Handles special cases for versions such as "Stamp", "Alternative Art", "Foil", "Textured", "Release", "Box Topper", "Full Art", "Special Rare", and "Rare Pull". For the "Stamp" filter, cards with "Pre-Release Stamp", "Pre-Release", or "Pre Release" are not excluded.
 *
 * @param filters - List of version filters to apply.
 * @returns `true` if the card should be excluded based on its version; otherwise, `false`.
 */
function applyVersionFilter(card: DigimonCard, filters: string[]): boolean {
  let remove = false;
  for (let filter of filters) {
    if (filter === 'Stamp') {
      const preRelease =
        card['version'].includes('Pre-Release Stamp') || card['version'].includes('Pre-Release') || card['version'].includes('Pre Release');
      remove = card['version'].includes('Stamp') && !preRelease;
    } else if (filter === 'AA' || filter === 'Alternative Art') {
      remove = card['version'].includes('Alternative Art');
    } else if (filter === 'Normal') {
      remove = card['version'].includes('Normal');
    } else if (filter === 'Foil') {
      remove = card['version'].includes('Foil');
    } else if (filter === 'Textured') {
      remove = card['version'].includes('Textured');
    } else if (filter === 'Release') {
      remove = card['version'].includes('Pre Release');
    } else if (filter === 'Box Topper') {
      remove = card['version'].includes('Box Topper');
    } else if (filter === 'Full Art') {
      remove = card['version'].includes('Full Art');
    } else if (filter === 'Special Rare') {
      remove = card['version'].includes('Special Rare');
    } else if (filter === 'Rare Pull') {
      remove = card['version'].includes('Rare Pull');
    } else {
      remove = filter.includes(card['version']);
    }
    if (remove) break;
  }
  return !remove;
}

/**
 * Determines whether a card should be excluded based on the presence of specified keywords in its effect or digivolveEffect text.
 *
 * @param filters - List of keywords to search for in the card's effect or digivolveEffect.
 * @returns True if none of the keywords are found in the card's effect or digivolveEffect; otherwise, false.
 */
function applyKeywordFilter(card: DigimonCard, filters: string[]): boolean {
  let remove = false;
  for (let filter of filters) {
    remove = card['effect'].includes(filter) || card['digivolveEffect'].includes(filter);
    if (remove) break;
  }
  return !remove;
}

/**
 * Determines whether a card should be excluded based on special requirements filters.
 *
 * Returns true if the card does not meet any of the specified special requirements such as Digivolve, Burst Digivolve, DNA Digivolution, ACE, or DigiXros.
 *
 * @param filters - List of special requirements to filter by.
 * @returns True if the card should be excluded; false otherwise.
 */
function applySpecialRequirementsFilter(card: DigimonCard, filters: string[]): boolean {
  let remove = false;
  for (let filter of filters) {
    if (filter === 'Digivolve') {
      remove = !!card['specialDigivolve'] && card['specialDigivolve'] !== '-';
      if (remove) return false;
    }
    if (filter === 'Burst Digivolve') {
      remove = !!card['burstDigivolve'] && card['burstDigivolve'] !== '-';
      if (remove) return false;
    }
    if (filter === 'DNA Digivolution') {
      remove = !!card['dnaDigivolve'] && card['dnaDigivolve'] !== '-';
      if (remove) return false;
    }
    if (filter === 'ACE') {
      remove = !!card['aceEffect'] && card['aceEffect'] !== '-';
      if (remove) return false;
    }
    if (filter === 'DigiXros') {
      remove = !!card['digiXros'] && card['digiXros'] !== '-';
      if (remove) return false;
    }
  }
  return !remove;
}

/**
 * Determines whether a card should be excluded based on its notes property.
 *
 * @returns True if the card's notes are not included in the filter list; otherwise, false.
 */
function applySourceFilter(card: DigimonCard, filters: string[]): boolean {
  return filters.includes(card['notes']);
}

/**
 * Determines whether a card should be excluded based on its count in the user's collection and the specified count range.
 *
 * @param cardCountFilter - An array with two elements specifying the minimum and maximum allowed counts.
 * @returns `true` if the card's count is outside the specified range and should be excluded; otherwise, `false`.
 *
 * @remark If the maximum value in {@link cardCountFilter} equals the user's maximum count setting, only the lower bound is enforced.
 */
function applyCardCountFilter(card: DigimonCard, save: ISave, cardCountFilter: number[]): boolean {
  const count = save.collection.find((cc) => cc.id === card.id)?.count ?? 0;

  // If the CardCount Filter is at the max, check if the card count is higher than the smaller slider
  const filterMax = save.settings.countMax ?? 5;
  if (cardCountFilter[1] === filterMax) {
    return !(cardCountFilter[0] <= count);
  }
  return !(cardCountFilter[0] <= count && count <= cardCountFilter[1]);
}

/**
 * Determines whether a Digimon card should be excluded based on a numeric range filter for a specified property.
 *
 * Applies range filtering to properties such as level, play cost, digivolution cost, or DP. Returns `true` if the card's value for the given property falls outside the specified range, or if required values are missing.
 *
 * @param filter - The inclusive lower and upper bounds for the property.
 * @param key - The property to filter by: 'level', 'playCost', 'digivolution', or 'dp'.
 * @returns `true` if the card should be excluded based on the range filter; otherwise, `false`.
 */
function applyRangeFilter(card: DigimonCard, filter: number[], key: string): boolean {
  switch (key) {
    default:
    case 'level':
      if (filter[0] === 2 && filter[1] === 7) {
        return false;
      }

      const level: number = +card['cardLv'].slice(-1) >>> 0;
      if (filter[1] === 7) {
        return filter[0] > level;
      }

      return filter[0] > level || filter[1] < level;
    case 'playCost':
      if (filter[0] === 0 && filter[1] === 20) {
        return false;
      }

      if (filter[1] === 20) {
        const playCost: number = +card['playCost'] >>> 0;
        return filter[0] > playCost;
      }

      const playCost: number = +card['playCost'] >>> 0;
      return filter[0] > playCost || filter[1] < playCost;
    case 'digivolution':
      if (filter[0] === 0 && filter[1] === 7) {
        return false;
      }

      let highestDigivolveCost;
      let lowestDigivolveCost;

      for (let condition of card['digivolveCondition']) {
        if (!highestDigivolveCost || +condition.cost >>> 0 > highestDigivolveCost) highestDigivolveCost = +condition.cost >>> 0;
        if (!lowestDigivolveCost || +condition.cost >>> 0 < lowestDigivolveCost) lowestDigivolveCost = +condition.cost >>> 0;
      }

      if (!highestDigivolveCost || !lowestDigivolveCost) {
        return true;
      }

      if (filter[1] === 7) {
        return filter[0] > lowestDigivolveCost;
      }

      return filter[0] > lowestDigivolveCost || filter[1] < highestDigivolveCost;
    case 'dp':
      if (filter[0] === 1 && filter[1] === 17) {
        return false;
      }

      const dp: number = +card['dp'] >>> 0;

      if (card['dp'] === '-' || card['dp'] === '') {
        return true;
      }

      const a: number = +(filter[0] + '000') >>> 0;
      const b: number = +(filter[1] + '000') >>> 0;

      if (filter[1] === 17) {
        return a > dp;
      }

      return a > dp || b < dp;
  }
}

/**
 * Excludes a card if it is not included in any of the specified preset sets.
 *
 * @param filter - List of preset set names to check (e.g., "Ultimate Cup 2023", "Ultimate Cup 2024").
 * @returns `false` if the card is found in any of the specified preset sets; otherwise, `true` to indicate exclusion.
 */
function applyPresetFilter(card: DigimonCard, filter: string[]): boolean {
  let inPreset = true;
  for (const preset of filter) {
    if (preset === 'Ultimate Cup 2023') {
      if (UltimateCup2023.includes(card.id)) return false;
    }
    if (preset === 'Ultimate Cup 2024') {
      if (UltimateCup2024.includes(card.id)) return false;
    }
  }
  return inPreset;
}

/**
 * Sorts an array of Digimon cards based on the specified sort criteria.
 *
 * Sorts by numeric order for 'playCost' and 'dp', or by string order for other properties, in ascending or descending order as specified.
 *
 * @returns The sorted array of Digimon cards.
 */
function applySortOrder(cards: DigimonCard[], sort: ISort, collection: ICountCard[]): DigimonCard[] {
  const returnArray = [...new Set([...cards])];
  if (sort.sortBy.element === 'playCost' || sort.sortBy.element === 'dp') {
    return sort.ascOrder
      ? returnArray.sort(dynamicSortNumber(sort.sortBy.element))
      : returnArray.sort(dynamicSortNumber(`-${sort.sortBy.element}`));
  }
  return sort.ascOrder ? returnArray.sort(dynamicSort(sort.sortBy.element)) : returnArray.sort(dynamicSort(`-${sort.sortBy.element}`));
}

/**
 * Returns a comparator function for case-insensitive, locale-aware string sorting by the specified property.
 *
 * @param property - The object property to sort by. Prefix with '-' for descending order.
 * @returns A comparator function suitable for use with {@link Array.prototype.sort}.
 */

export function dynamicSort(property: string): any {
  let sortOrder = 1;
  if (property[0] === '-') {
    sortOrder = -1;
    property = property.substr(1);
  }
  return function (a: any, b: any) {
    let result = a[property].toLowerCase().localeCompare(b[property].toLowerCase(), undefined, {
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

/**
 * Compares two card ID strings for sorting by set name, set number, and card ID.
 *
 * Splits each ID into components and compares them in order: set name (with numeric-aware comparison), set number (as an integer), and card ID (as a string).
 *
 * @returns A negative number if {@link a} should come before {@link b}, a positive number if after, or 0 if they are equal.
 */
export function sortID(a: string, b: string) {
  const aSplit = a.split('-');
  const bSplit = b.split('-');

  const aSetName = hasNumber(aSplit[0]) ? aSplit[0].slice(0, 2) : 'P';
  const bSetName = hasNumber(bSplit[0]) ? bSplit[0].slice(0, 2) : 'P';

  const aSetNumber = hasNumber(aSplit[0]) ? (aSplit[0].substring(2) as any) >>> 0 : 99;
  const bSetNumber = hasNumber(bSplit[0]) ? (bSplit[0].substring(2) as any) >>> 0 : 99;

  const aSetID = aSplit[1];
  const bSetID = bSplit[1];

  const SetResult = aSetName.localeCompare(bSetName, undefined, {
    numeric: true,
    sensitivity: 'base',
  });

  const SetNumberResult = aSetNumber < bSetNumber ? -1 : aSetNumber > bSetNumber ? 1 : 0;

  const IDResult = aSetID < bSetID ? -1 : aSetID > bSetID ? 1 : 0;

  return SetResult || SetNumberResult || IDResult;
}

function hasNumber(myString: string) {
  return /\d/.test(myString);
}
