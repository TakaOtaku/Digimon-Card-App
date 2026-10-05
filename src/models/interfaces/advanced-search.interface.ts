export interface ISearchFilter {
  field: string;
  operator: string;
  value: string;
  displayText?: string;
}

export interface ISearchExpression {
  filters: ISearchFilter[];
  logic: 'AND' | 'OR';
}

export interface IAdvancedSearch {
  expressions: ISearchExpression[];
  globalLogic: 'AND' | 'OR';
}

export interface IFilterOption {
  label: string;
  value: string;
  type: 'string' | 'number' | 'array' | 'range';
  options?: string[]; // For predefined options like colors, rarities, etc.
}

export interface IOperatorOption {
  label: string;
  value: string;
  compatibleTypes: ('string' | 'number' | 'array' | 'range')[];
}

export interface IAutocompleteItem {
  type: 'filter' | 'operator' | 'value' | 'logic';
  label: string;
  value: string;
  icon?: string;
  data?: any;
}
