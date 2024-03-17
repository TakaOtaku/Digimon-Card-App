import {
  Attributes, Blocks, CardTypes,
  Colors,
  Forms,
  Illustrators,
  Keywords, Rarity,
  Restrictions, Sets,
  SpecialRequirements,
  Types, Versions
} from './filter.data';

export const FilterTypes = [
  'Color',
  'Card Type',
  'Set',
  'Level',
  'Play Cost',
  'Digivolve Cost',
  'DP',
  'Number in Collection',
  'Rarity',
  'Version',
  'Block',
  'Keyword',
  'Form',
  'Attribute',
  'Type',
  'Special Requirement',
  'Illustrator',
  'Restrictions',
].sort();

export const Operators = ['==', '!=', '>', '>=', '<', '<='];

export const Combiner = ['AND', 'OR'];

export const filterTypeMap = new Map<string, string[]>([
  ['Color', Colors],
  ['Card Type', CardTypes],
  ['Set', Sets],
  ['Level', []],
  ['Play Cost', []],
  ['Digivolve Cost', []],
  ['DP', []],
  ['Number in Collection', []],
  ['Rarity', Rarity],
  ['Version', Versions],
  ['Block', Blocks],
  ['Keyword', Keywords],
  ['Form', Forms],
  ['Attribute', Attributes],
  ['Type', Types],
  ['Special Requirement', SpecialRequirements],
  ['Illustrator', Illustrators],
  ['Restrictions', Restrictions],
]);
