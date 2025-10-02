import { Injectable } from '@angular/core';
import { DigimonCard } from '../../models/interfaces';
import { IAdvancedSearch, ISearchFilter, ISearchExpression } from '../../models/interfaces/advanced-search.interface';

@Injectable({
  providedIn: 'root'
})
export class AdvancedSearchService {

  /**
   * Apply advanced search filters to a list of cards
   */
  applyAdvancedSearch(cards: DigimonCard[], advancedSearch: IAdvancedSearch): DigimonCard[] {
    if (!advancedSearch.expressions.length) {
      return cards;
    }

    console.log('Applying advanced search:', advancedSearch);
    console.log('Input cards count:', cards.length);

    const result = cards.filter(card => this.evaluateAdvancedSearch(card, advancedSearch));
    
    console.log('Filtered cards count:', result.length);
    return result;
  }

  /**
   * Evaluate if a card matches the advanced search criteria
   */
  private evaluateAdvancedSearch(card: DigimonCard, advancedSearch: IAdvancedSearch): boolean {
    const expressionResults = advancedSearch.expressions.map(expression => 
      this.evaluateExpression(card, expression)
    );

    // Apply global logic between expressions
    if (advancedSearch.globalLogic === 'AND') {
      return expressionResults.every(result => result);
    } else {
      return expressionResults.some(result => result);
    }
  }

  /**
   * Evaluate a single expression (group of filters with logic)
   */
  private evaluateExpression(card: DigimonCard, expression: ISearchExpression): boolean {
    const filterResults = expression.filters.map(filter => 
      this.evaluateFilter(card, filter)
    );

    // Apply logic within the expression
    if (expression.logic === 'AND') {
      return filterResults.every(result => result);
    } else {
      return filterResults.some(result => result);
    }
  }

  /**
   * Evaluate a single filter against a card
   */
  private evaluateFilter(card: DigimonCard, filter: ISearchFilter): boolean {
    // Handle global text search specially
    if (filter.field === 'global_text_search') {
      return this.globalTextSearch(card, filter.value);
    }

    const fieldValue = this.getFieldValue(card, filter.field);
    const filterValue = filter.value;

    switch (filter.operator) {
      case '==':
        return this.equalityCheck(fieldValue, filterValue);
      case '!=':
        return !this.equalityCheck(fieldValue, filterValue);
      case 'contains':
        return this.containsCheck(fieldValue, filterValue);
      case 'not_contains':
        return !this.containsCheck(fieldValue, filterValue);
      case 'starts_with':
        return this.startsWithCheck(fieldValue, filterValue);
      case 'ends_with':
        return this.endsWithCheck(fieldValue, filterValue);
      case '>':
        return this.greaterThanCheck(fieldValue, filterValue);
      case '>=':
        return this.greaterThanOrEqualCheck(fieldValue, filterValue);
      case '<':
        return this.lessThanCheck(fieldValue, filterValue);
      case '<=':
        return this.lessThanOrEqualCheck(fieldValue, filterValue);
      case 'between':
        return this.betweenCheck(fieldValue, filterValue);
      case 'includes':
        return this.includesCheck(fieldValue, filterValue);
      case 'not_includes':
        return !this.includesCheck(fieldValue, filterValue);
      default:
        return false;
    }
  }

  /**
   * Perform global text search across all card fields
   */
  private globalTextSearch(card: DigimonCard, searchText: string): boolean {
    if (!searchText.trim()) return true;
    
    const searchTerm = searchText.toLowerCase();
    console.log(`Searching for "${searchTerm}" in card:`, card.name?.english || card.id);
    
    // Define all searchable text fields on the card
    const searchableFields = [
      card.name?.english,
      card.name?.japanese,
      card.name?.korean,
      card.name?.simplifiedChinese,
      card.name?.traditionalChinese,
      card.id,
      card.cardNumber,
      card.illustrator,
      card.notes,
      card.effect,
      card.digivolveEffect,
      card.securityEffect,
      card.aceEffect,
      card.linkEffect,
      card.linkRequirement,
      card.rule,
      card.color,
      card.rarity,
      card.cardType,
      card.form,
      card.attribute,
      card.type,
      card.version,
      card.restrictions?.english,
      card.restrictions?.japanese,
      card.restrictions?.korean,
      card.restrictions?.chinese,
      card.specialDigivolve,
      card.dnaDigivolve,
      card.burstDigivolve,
      card.digiXros,
      card.assembly,
      String(card.playCost),
      String(card.dp),
      String(card.linkDP),
      String(card.cardLv),
      // Also search in block array
      card.block?.join(' '),
      // Also search in digivolution conditions
      card.digivolveCondition?.map(dc => `${dc.color} ${dc.cost} ${dc.level}`).join(' ')
    ];
    
    // Check if any field contains the search term
    const found = searchableFields.some(field => {
      if (field === null || field === undefined) return false;
      const fieldString = String(field).toLowerCase();
      const result = fieldString.includes(searchTerm);
      if (result) {
        console.log(`Found "${searchTerm}" in field:`, fieldString.substring(0, 100));
      }
      return result;
    });
    
    console.log(`Global search result for "${searchTerm}" in ${card.name?.english || card.id}:`, found);
    return found;
  }

  /**
   * Get field value from card using dot notation
   */
  private getFieldValue(card: DigimonCard, field: string): any {
    const keys = field.split('.');
    let value: any = card;
    
    for (const key of keys) {
      if (value === null || value === undefined) {
        return null;
      }
      value = value[key];
    }

    // Handle special cases
    if (field === 'cardLv') {
      // Extract number from level string (e.g., "Lv.3" -> 3)
      const match = String(value).match(/\d+/);
      return match ? parseInt(match[0], 10) : 0;
    }

    if (field === 'keywords') {
      // Combine effect and digivolve effect for keyword search
      return `${card.effect} ${card.digivolveEffect} ${card.securityEffect} ${card.aceEffect}`;
    }

    if (field === 'digivolveCondition') {
      // Return array of digivolution costs
      return card.digivolveCondition?.map(condition => parseInt(condition.cost, 10) || 0) || [];
    }

    return value;
  }

  /**
   * Check equality with case-insensitive string comparison
   */
  private equalityCheck(fieldValue: any, filterValue: string): boolean {
    if (fieldValue === null || fieldValue === undefined) return false;
    return String(fieldValue).toLowerCase() === filterValue.toLowerCase();
  }

  /**
   * Check if field contains filter value (case-insensitive)
   */
  private containsCheck(fieldValue: any, filterValue: string): boolean {
    if (fieldValue === null || fieldValue === undefined) return false;
    return String(fieldValue).toLowerCase().includes(filterValue.toLowerCase());
  }

  /**
   * Check if field starts with filter value (case-insensitive)
   */
  private startsWithCheck(fieldValue: any, filterValue: string): boolean {
    if (fieldValue === null || fieldValue === undefined) return false;
    return String(fieldValue).toLowerCase().startsWith(filterValue.toLowerCase());
  }

  /**
   * Check if field ends with filter value (case-insensitive)
   */
  private endsWithCheck(fieldValue: any, filterValue: string): boolean {
    if (fieldValue === null || fieldValue === undefined) return false;
    return String(fieldValue).toLowerCase().endsWith(filterValue.toLowerCase());
  }

  /**
   * Numeric greater than check
   */
  private greaterThanCheck(fieldValue: any, filterValue: string): boolean {
    const numValue = this.parseNumber(fieldValue);
    const filterNum = parseFloat(filterValue);
    return numValue !== null && filterNum !== null && numValue > filterNum;
  }

  /**
   * Numeric greater than or equal check
   */
  private greaterThanOrEqualCheck(fieldValue: any, filterValue: string): boolean {
    const numValue = this.parseNumber(fieldValue);
    const filterNum = parseFloat(filterValue);
    return numValue !== null && filterNum !== null && numValue >= filterNum;
  }

  /**
   * Numeric less than check
   */
  private lessThanCheck(fieldValue: any, filterValue: string): boolean {
    const numValue = this.parseNumber(fieldValue);
    const filterNum = parseFloat(filterValue);
    return numValue !== null && filterNum !== null && numValue < filterNum;
  }

  /**
   * Numeric less than or equal check
   */
  private lessThanOrEqualCheck(fieldValue: any, filterValue: string): boolean {
    const numValue = this.parseNumber(fieldValue);
    const filterNum = parseFloat(filterValue);
    return numValue !== null && filterNum !== null && numValue <= filterNum;
  }

  /**
   * Numeric between check (expects "min,max" format)
   */
  private betweenCheck(fieldValue: any, filterValue: string): boolean {
    const numValue = this.parseNumber(fieldValue);
    if (numValue === null) return false;
    
    const [min, max] = filterValue.split(',').map(v => parseFloat(v.trim()));
    if (isNaN(min) || isNaN(max)) return false;
    
    return numValue >= min && numValue <= max;
  }

  /**
   * Array includes check (for multi-value fields like color, type)
   */
  private includesCheck(fieldValue: any, filterValue: string): boolean {
    if (fieldValue === null || fieldValue === undefined) return false;
    
    // Handle array fields
    if (Array.isArray(fieldValue)) {
      return fieldValue.some(item => 
        String(item).toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    
    // Handle string fields that might contain multiple values (like color: "Red/Blue")
    const fieldStr = String(fieldValue).toLowerCase();
    return fieldStr.includes(filterValue.toLowerCase());
  }

  /**
   * Parse number from various formats
   */
  private parseNumber(value: any): number | null {
    if (value === null || value === undefined || value === '' || value === '-') {
      return null;
    }
    
    const num = parseFloat(String(value));
    return isNaN(num) ? null : num;
  }

  /**
   * Parse advanced search string into structured object
   * Example: "Color == Red AND Color != Blue OR Rarity == SR"
   */
  parseSearchString(searchString: string): IAdvancedSearch | null {
    if (!searchString.trim()) {
      return null;
    }

    try {
      // Split by OR first (lowest precedence)
      const orParts = searchString.split(/\s+OR\s+/i);
      
      const expressions: ISearchExpression[] = orParts.map(orPart => {
        // Split each OR part by AND
        const andParts = orPart.split(/\s+AND\s+/i);
        
        const filters: ISearchFilter[] = andParts.map(andPart => {
          return this.parseFilterString(andPart.trim());
        }).filter(f => f !== null) as ISearchFilter[];

        return {
          filters,
          logic: 'AND' as const
        };
      });

      return {
        expressions: expressions.filter(expr => expr.filters.length > 0),
        globalLogic: 'OR' as const
      };
    } catch (error) {
      console.error('Error parsing search string:', error);
      return null;
    }
  }

  /**
   * Parse individual filter string
   * Example: "Color == Red" or "PlayCost > 5"
   */
  private parseFilterString(filterString: string): ISearchFilter | null {
    const operators = ['>=', '<=', '==', '!=', '>', '<', 'contains', 'not_contains', 'starts_with', 'ends_with', 'includes', 'not_includes', 'between'];
    
    for (const operator of operators) {
      const parts = filterString.split(new RegExp(`\\s+${operator}\\s+`, 'i'));
      if (parts.length === 2) {
        const field = parts[0].trim();
        const value = parts[1].trim().replace(/^["']|["']$/g, ''); // Remove quotes
        
        return {
          field: this.normalizeFieldName(field),
          operator: operator.toLowerCase(),
          value,
          displayText: filterString
        };
      }
    }

    return null;
  }

  /**
   * Normalize field names to match card properties
   */
  private normalizeFieldName(fieldName: string): string {
    const fieldMap: { [key: string]: string } = {
      'global search': 'global_text_search',
      'globalsearch': 'global_text_search',
      'global_text_search': 'global_text_search',
      'color': 'color',
      'rarity': 'rarity',
      'cardtype': 'cardType',
      'card type': 'cardType',
      'playcost': 'playCost',
      'play cost': 'playCost',
      'level': 'cardLv',
      'dp': 'dp',
      'name': 'name.english',
      'effect': 'effect',
      'form': 'form',
      'attribute': 'attribute',
      'type': 'type',
      'illustrator': 'illustrator',
      'block': 'block',
      'version': 'version',
      'keywords': 'keywords',
      'digivolve': 'digivolveCondition',
      'digivolution': 'digivolveCondition'
    };

    const normalized = fieldName.toLowerCase().replace(/[^a-z\s]/g, '');
    return fieldMap[normalized] || normalized;
  }

  /**
   * Convert advanced search object back to readable string
   */
  stringifyAdvancedSearch(advancedSearch: IAdvancedSearch): string {
    const expressionStrings = advancedSearch.expressions.map(expression => {
      const filterStrings = expression.filters.map(filter => 
        filter.displayText || `${filter.field} ${filter.operator} ${filter.value}`
      );
      return filterStrings.join(` ${expression.logic} `);
    });

    return expressionStrings.join(` ${advancedSearch.globalLogic} `);
  }
}
