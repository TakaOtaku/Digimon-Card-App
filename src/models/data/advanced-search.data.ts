import { IFilterOption, IOperatorOption } from '../interfaces/advanced-search.interface';
import {
  Colors,
  Rarity,
  CardTypes,
  Blocks,
  Forms,
  Attributes,
  Types,
  Illustrators,
  Keywords,
  SpecialRequirements,
  Restrictions,
  Versions
} from './filter.data';

export const FILTER_OPTIONS: IFilterOption[] = [
  // String filters
  { label: 'Card Name', value: 'name.english', type: 'string' },
  { label: 'Card ID', value: 'id', type: 'string' },
  { label: 'Card Number', value: 'cardNumber', type: 'string' },
  { label: 'Illustrator', value: 'illustrator', type: 'string', options: Illustrators },
  { label: 'Notes', value: 'notes', type: 'string' },
  { label: 'Effect', value: 'effect', type: 'string' },
  { label: 'Digivolve Effect', value: 'digivolveEffect', type: 'string' },
  { label: 'Security Effect', value: 'securityEffect', type: 'string' },
  { label: 'ACE Effect', value: 'aceEffect', type: 'string' },

  // Array filters with predefined options
  { label: 'Color', value: 'color', type: 'array', options: Colors },
  { label: 'Rarity', value: 'rarity', type: 'array', options: Rarity },
  { label: 'Card Type', value: 'cardType', type: 'array', options: CardTypes },
  { label: 'Block', value: 'block', type: 'array', options: Blocks },
  { label: 'Form', value: 'form', type: 'array', options: Forms },
  { label: 'Attribute', value: 'attribute', type: 'array', options: Attributes },
  { label: 'Type', value: 'type', type: 'array', options: Types },
  { label: 'Version', value: 'version', type: 'array', options: Versions },
  { label: 'Keywords', value: 'keywords', type: 'array', options: Keywords },
  { label: 'Special Requirements', value: 'specialRequirements', type: 'array', options: SpecialRequirements },
  { label: 'Restrictions', value: 'restrictions.english', type: 'array', options: Restrictions },

  // Number filters
  { label: 'Play Cost', value: 'playCost', type: 'number' },
  { label: 'DP', value: 'dp', type: 'number' },
  { label: 'Level', value: 'cardLv', type: 'number' },

  // Range filters
  { label: 'Digivolution Cost', value: 'digivolveCondition', type: 'range' },
];

export const OPERATOR_OPTIONS: IOperatorOption[] = [
  // String operators
  { label: 'equals', value: '==', compatibleTypes: ['string', 'array'] },
  { label: 'not equals', value: '!=', compatibleTypes: ['string', 'array'] },
  { label: 'contains', value: 'contains', compatibleTypes: ['string'] },
  { label: 'does not contain', value: 'not_contains', compatibleTypes: ['string'] },
  { label: 'starts with', value: 'starts_with', compatibleTypes: ['string'] },
  { label: 'ends with', value: 'ends_with', compatibleTypes: ['string'] },

  // Number operators
  { label: 'equals', value: '==', compatibleTypes: ['number'] },
  { label: 'not equals', value: '!=', compatibleTypes: ['number'] },
  { label: 'greater than', value: '>', compatibleTypes: ['number', 'range'] },
  { label: 'greater than or equal', value: '>=', compatibleTypes: ['number', 'range'] },
  { label: 'less than', value: '<', compatibleTypes: ['number', 'range'] },
  { label: 'less than or equal', value: '<=', compatibleTypes: ['number', 'range'] },
  { label: 'between', value: 'between', compatibleTypes: ['number', 'range'] },

  // Array operators
  { label: 'includes', value: 'includes', compatibleTypes: ['array'] },
  { label: 'does not include', value: 'not_includes', compatibleTypes: ['array'] },
];

export const LOGIC_OPTIONS = [
  { label: 'AND', value: 'AND', icon: 'pi pi-plus' },
  { label: 'OR', value: 'OR', icon: 'pi pi-minus' },
];
