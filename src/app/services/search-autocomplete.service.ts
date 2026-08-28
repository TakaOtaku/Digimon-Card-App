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
  private rarities = ['C', 'UC', 'R', 'SR', 'SEC'];
  private forms = ['Rookie', 'Champion', 'Ultimate', 'Mega'];
  private attributes = ['Vaccine', 'Virus', 'Data', 'Free'];

  getSuggestions(query: string, cursorPosition: number): SearchSuggestion[] {
    if (!query) {
      return this.getFieldSuggestions('');
    }

    // Find the current token being typed
    const token = this.getCurrentToken(query, cursorPosition);
    if (!token) {
      return [];
    }

    const { text, type } = token;

    // Suggest based on what the user is typing
    if (type === 'field') {
      return this.getFieldSuggestions(text);
    } else if (type === 'operator') {
      return this.getOperatorSuggestions(text);
    } else if (type === 'value') {
      // Try to get the field being used to suggest appropriate values
      const field = this.getFieldBeforeOperator(query, cursorPosition);
      return this.getValueSuggestions(text, field);
    } else if (type === 'logical') {
      return this.getLogicalOperatorSuggestions(text);
    }

    return [];
  }

  private getCurrentToken(query: string, cursorPosition: number): { text: string; type: string } | null {
    const beforeCursor = query.substring(0, cursorPosition).trimEnd();
    const lastChar = beforeCursor[beforeCursor.length - 1];

    // Check if we're after a space (likely starting a new token)
    if (lastChar === ' ' || lastChar === '(' || lastChar === ')') {
      // Suggest logical operators or fields
      const remaining = query.substring(cursorPosition).trim();
      if (remaining.match(/^AND|OR|and|or/i)) {
        return null; // Already typed
      }
      return { text: '', type: 'logical' };
    }

    // Get the current word being typed
    const words = beforeCursor.split(/\s+/);
    const currentWord = words[words.length - 1];

    if (!currentWord) {
      return null;
    }

    // Check if we're typing an operator (contains special chars)
    if (currentWord.includes('==') || currentWord.includes('!=') || currentWord.includes('>=') || 
        currentWord.includes('<=') || currentWord.includes('>') || currentWord.includes('<')) {
      // Find the part after the operator
      const opMatch = currentWord.match(/[=><!]+(.*)$/);
      if (opMatch) {
        return { text: opMatch[1], type: 'value' };
      }
      return null;
    }

    // Check if this looks like a field name
    if (!currentWord.includes('(') && !currentWord.includes(')')) {
      // Check if any known operators appear in this word
      const hasOperator = this.operators.some(o => currentWord.includes(o.op));
      if (hasOperator) {
        const opMatch = currentWord.match(/([=><!]+|contains|starts_with|ends_with)(.*)$/i);
        if (opMatch) {
          return { text: opMatch[2], type: 'value' };
        }
      }

      // Check for logical operators
      if (currentWord.toUpperCase() === 'AND' || currentWord.toUpperCase() === 'OR' ||
          ['AND', 'OR'].some(op => op.startsWith(currentWord.toUpperCase()))) {
        return { text: currentWord, type: 'logical' };
      }

      // Likely a field name
      return { text: currentWord, type: 'field' };
    }

    return null;
  }

  private getFieldBeforeOperator(query: string, cursorPosition: number): string | null {
    const beforeCursor = query.substring(0, cursorPosition);
    const words = beforeCursor.split(/\s+|==|!=|>=|<=|>|<|contains|starts_with|ends_with/i);
    
    if (words.length > 0) {
      const lastWord = words[words.length - 1].trim();
      const field = this.fieldNames.find(f => f.name.toLowerCase() === lastWord.toLowerCase());
      return field?.name || null;
    }
    return null;
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
