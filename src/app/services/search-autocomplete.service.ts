import { Injectable } from '@angular/core';

export interface SearchSuggestion {
  label: string;
  value: string;
  category: 'field' | 'operator' | 'logical' | 'value';
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SearchAutocompleteService {
  private fieldNames = [
    { name: 'name', description: 'Card name' },
    { name: 'cardType', description: 'Type of card (Digimon, Option, Tamer, Digi-Egg)' },
    { name: 'color', description: 'Card color (Red, Blue, Yellow, Green, Purple, Black, White)' },
    { name: 'rarity', description: 'Card rarity (C, UC, R, SR, SEC)' },
    { name: 'playCost', description: 'Play cost (numeric)' },
    { name: 'dp', description: 'Digimon Power (numeric)' },
    { name: 'cardLv', description: 'Card level (numeric)' },
    { name: 'form', description: 'Digimon form (Rookie, Champion, Ultimate, Mega)' },
    { name: 'attribute', description: 'Digimon attribute (Vaccine, Virus, Data, Free)' },
    { name: 'type', description: 'Digimon type' },
    { name: 'effect', description: 'Card effect text' },
    { name: 'illustrator', description: 'Artist name' },
    { name: 'block', description: 'Block/Set name' },
  ];

  private operators = [
    { op: '==', description: 'Equals' },
    { op: '!=', description: 'Not equals' },
    { op: '>', description: 'Greater than' },
    { op: '>=', description: 'Greater than or equal' },
    { op: '<', description: 'Less than' },
    { op: '<=', description: 'Less than or equal' },
    { op: 'contains', description: 'Text contains' },
    { op: 'starts_with', description: 'Text starts with' },
    { op: 'ends_with', description: 'Text ends with' },
  ];

  private logicalOperators = [
    { op: 'AND', description: 'All conditions must be true' },
    { op: 'OR', description: 'At least one condition must be true' },
  ];

  private cardTypes = ['Digimon', 'Option', 'Tamer', 'Digi-Egg'];
  private colors = ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Black', 'White'];
  private rarities = ['C', 'U', 'R', 'SR', 'UR', 'SEC', 'P'];
  private forms = ['Rookie', 'Champion', 'Ultimate', 'Mega'];
  private attributes = ['Vaccine', 'Virus', 'Data', 'Free'];

  getSuggestions(query: string, cursorPosition: number): SearchSuggestion[] {
    const raw = (query ?? '').substring(0, cursorPosition);

    // The partial is the trailing run of characters the user is currently typing
    // (empty if the text ends with a space or parenthesis).
    const partialMatch = raw.match(/[^\s()]*$/);
    const partial = partialMatch ? partialMatch[0] : '';
    const completed = raw.substring(0, raw.length - partial.length);

    // Handle an operator glued to a field with no spaces, e.g. "color==re"
    const glued = partial.match(/^(.*?)(==|!=|>=|<=|>|<)(.*)$/);
    if (glued) {
      const field = this.resolveField(glued[1]);
      return this.getValueSuggestions(glued[3], field);
    }

    const { expected, field } = this.analyzeContext(completed);

    switch (expected) {
      case 'operator':
        return this.getOperatorSuggestions(partial);
      case 'value':
        return this.getValueSuggestions(partial, field);
      case 'logical':
        return this.getLogicalOperatorSuggestions(partial);
      case 'field':
      default:
        return this.getFieldSuggestions(partial);
    }
  }

  /**
   * Walk the already-completed part of the query and determine what kind of
   * token should come next, plus the field the current clause refers to.
   */
  private analyzeContext(completed: string): { expected: 'field' | 'operator' | 'value' | 'logical'; field: string | null } {
    const tokens = this.tokenize(completed);
    let state: 'field' | 'operator' | 'value' | 'logical' = 'field';
    let field: string | null = null;

    for (const token of tokens) {
      if (token === '(') {
        state = 'field';
        continue;
      }
      if (token === ')') {
        state = 'logical';
        continue;
      }

      const upper = token.toUpperCase();
      if (upper === 'AND' || upper === 'OR') {
        state = 'field';
        continue;
      }

      if (state === 'field') {
        const resolved = this.resolveField(token);
        if (resolved) field = resolved;
        state = 'operator';
      } else if (state === 'operator') {
        state = 'value';
      } else if (state === 'value') {
        state = 'logical';
      } else {
        // Stray token after a completed clause; assume a new field begins
        const resolved = this.resolveField(token);
        field = resolved;
        state = 'operator';
      }
    }

    return { expected: state, field };
  }

  private tokenize(text: string): string[] {
    return text
      .replace(/([()])/g, ' $1 ')
      .replace(/(==|!=|>=|<=|>|<)/g, ' $1 ')
      .split(/\s+/)
      .filter(Boolean);
  }

  private resolveField(token: string): string | null {
    const field = this.fieldNames.find(f => f.name.toLowerCase() === token.trim().toLowerCase());
    return field ? field.name : null;
  }

  private getFieldSuggestions(partial: string): SearchSuggestion[] {
    return this.fieldNames
      .filter(f => f.name.toLowerCase().startsWith(partial.toLowerCase()))
      .map(f => ({
        label: f.name,
        value: f.name,
        category: 'field',
        description: f.description,
      }));
  }

  private getOperatorSuggestions(partial: string): SearchSuggestion[] {
    return this.operators
      .filter(o => o.op.toLowerCase().startsWith(partial.toLowerCase()))
      .map(o => ({
        label: o.op,
        value: o.op,
        category: 'operator',
        description: o.description,
      }));
  }

  private getLogicalOperatorSuggestions(partial: string): SearchSuggestion[] {
    return this.logicalOperators
      .filter(o => o.op.toLowerCase().startsWith(partial.toLowerCase()))
      .map(o => ({
        label: o.op,
        value: o.op,
        category: 'logical',
        description: o.description,
      }));
  }

  private getValueSuggestions(partial: string, field: string | null): SearchSuggestion[] {
    if (!field) {
      return [];
    }

    const fieldLower = field.toLowerCase();
    let values: string[] = [];

    if (fieldLower === 'cardtype') {
      values = this.cardTypes;
    } else if (fieldLower === 'color') {
      values = this.colors;
    } else if (fieldLower === 'rarity') {
      values = this.rarities;
    } else if (fieldLower === 'form') {
      values = this.forms;
    } else if (fieldLower === 'attribute') {
      values = this.attributes;
    }

    return values
      .filter(v => v.toLowerCase().startsWith(partial.toLowerCase()))
      .map(v => ({
        label: v,
        value: v,
        category: 'value',
      }));
  }
}
