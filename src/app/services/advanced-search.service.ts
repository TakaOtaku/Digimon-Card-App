import { Injectable } from '@angular/core';
import sift from 'sift';
import { DigimonCard } from '../../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class AdvancedSearchService {

  /**
   * Apply advanced search filters to a list of cards using natural language query
   * Example: "(cardType == Digimon AND color == Red) OR (color == Blue AND cardType == Option)"
   * Falls back to global text search if query doesn't match advanced syntax
   */
  applyAdvancedSearch(cards: DigimonCard[], searchQuery: string): DigimonCard[] {
    if (!searchQuery.trim()) {
      return cards;
    }

    try {
      console.log('Parsing search query:', searchQuery);

      // Check if this looks like an advanced search query with field operators
      const hasFieldOperators = /(\s+==\s+|\s+!=\s+|\s+>=\s+|\s+<=\s+|\s+>\s+|\s+<\s+|\s+contains\s+|\s+starts_with\s+|\s+ends_with\s+)/i.test(searchQuery);

      // Check if query has AND/OR logical operators (for combining text searches)
      const hasLogicalOperators = /(\s+AND\s+|\s+OR\s+)/i.test(searchQuery);

      if (hasFieldOperators) {
        // Try to parse as advanced search with field operators
        const siftQuery = this.parseSearchQuery(searchQuery);
        console.log('Generated sift query:', JSON.stringify(siftQuery, null, 2));

        const filterFn = sift(siftQuery);
        const result = cards.filter(card => filterFn(card));

        console.log(`Filtered ${result.length} cards from ${cards.length} total using advanced search`);
        return result;
      } else if (hasLogicalOperators) {
        // Handle AND/OR with global text search terms (e.g., "Agumon AND Gabumon")
        console.log('Logical operators detected without field operators, using combined text search');
        return this.globalTextSearchWithLogicalOperators(cards, searchQuery);
      } else {
        // Fall back to simple global text search
        console.log('No advanced syntax detected, using global text search');
        return this.globalTextSearch(cards, searchQuery);
      }
    } catch (error) {
      console.error('Error applying advanced search, falling back to global text search:', error);
      return this.globalTextSearch(cards, searchQuery);
    }
  }

  /**
   * Perform global text search across all card fields
   */
  private globalTextSearch(cards: DigimonCard[], searchText: string): DigimonCard[] {
    if (!searchText.trim()) return cards;

    const searchTerm = searchText.toLowerCase();
    console.log(`Global text search for: "${searchTerm}"`);

    const result = cards.filter(card => {
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
        card.block?.join(' '),
        card.digivolveCondition?.map(dc => `${dc.color} ${dc.cost} ${dc.level}`).join(' ')
      ];

      // Check if any field contains the search term
      return searchableFields.some(field => {
        if (field === null || field === undefined) return false;
        return String(field).toLowerCase().includes(searchTerm);
      });
    });

    console.log(`Global text search found ${result.length} cards from ${cards.length} total`);
    return result;
  }

  /**
   * Perform global text search with AND/OR logical operators
   * Example: "Agumon AND Gabumon" searches for cards containing both terms
   * Example: "Agumon OR Gabumon" searches for cards containing either term
   */
  private globalTextSearchWithLogicalOperators(cards: DigimonCard[], searchQuery: string): DigimonCard[] {
    // Split by OR first (lower precedence)
    const orParts = this.splitByLogicalOperator(searchQuery, 'OR');

    if (orParts.length > 1) {
      // OR: card must match at least one of the parts
      console.log(`OR search with ${orParts.length} parts:`, orParts);
      const result = cards.filter(card =>
        orParts.some(part => this.cardMatchesTextQuery(card, part))
      );
      console.log(`OR search found ${result.length} cards from ${cards.length} total`);
      return result;
    }

    // Split by AND
    const andParts = this.splitByLogicalOperator(searchQuery, 'AND');

    if (andParts.length > 1) {
      // AND: card must match all parts
      console.log(`AND search with ${andParts.length} parts:`, andParts);
      const result = cards.filter(card =>
        andParts.every(part => this.cardMatchesTextQuery(card, part))
      );
      console.log(`AND search found ${result.length} cards from ${cards.length} total`);
      return result;
    }

    // Single term, fall back to regular global search
    return this.globalTextSearch(cards, searchQuery);
  }

  /**
   * Check if a card matches a text query (searches all fields)
   */
  private cardMatchesTextQuery(card: DigimonCard, query: string): boolean {
    // Handle nested OR/AND in query part
    const orParts = this.splitByLogicalOperator(query, 'OR');
    if (orParts.length > 1) {
      return orParts.some(part => this.cardMatchesTextQuery(card, part));
    }

    const andParts = this.splitByLogicalOperator(query, 'AND');
    if (andParts.length > 1) {
      return andParts.every(part => this.cardMatchesTextQuery(card, part));
    }

    // Clean up the search term
    let searchTerm = query.trim().toLowerCase();

    // Remove surrounding parentheses if present
    if (searchTerm.startsWith('(') && searchTerm.endsWith(')')) {
      searchTerm = searchTerm.substring(1, searchTerm.length - 1).trim();
    }

    // Remove quotes if present
    searchTerm = searchTerm.replace(/^["']|["']$/g, '');

    if (!searchTerm) return true;

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
      card.block?.join(' '),
      card.digivolveCondition?.map(dc => `${dc.color} ${dc.cost} ${dc.level}`).join(' ')
    ];

    // Check if any field contains the search term
    return searchableFields.some(field => {
      if (field === null || field === undefined) return false;
      return String(field).toLowerCase().includes(searchTerm);
    });
  }

  /**
   * Parse natural language search query into MongoDB/Sift query
   * Example: "(cardType == Digimon AND color == Red) OR (color == Blue AND cardType == Option)"
   * Returns: { $or: [{ $and: [{ cardType: 'Digimon' }, { color: 'Red' }] }, { $and: [{ color: 'Blue' }, { cardType: 'Option' }] }] }
   */
  private parseSearchQuery(query: string): any {
    // Remove extra whitespace
    query = query.trim();

    // Check if the query contains OR at the top level (not inside parentheses)
    const orParts = this.splitByLogicalOperator(query, 'OR');

    if (orParts.length > 1) {
      // Multiple OR conditions
      return {
        $or: orParts.map(part => this.parseAndExpression(part))
      };
    }

    // Single expression or AND expressions
    return this.parseAndExpression(query);
  }

  /**
   * Split query by logical operator (OR/AND) respecting parentheses
   */
  private splitByLogicalOperator(query: string, operator: 'OR' | 'AND'): string[] {
    const parts: string[] = [];
    let currentPart = '';
    let parenthesesDepth = 0;
    let i = 0;

    const operatorRegex = new RegExp(`\\s+${operator}\\s+`, 'i');

    while (i < query.length) {
      const char = query[i];

      if (char === '(') {
        parenthesesDepth++;
        currentPart += char;
        i++;
      } else if (char === ')') {
        parenthesesDepth--;
        currentPart += char;
        i++;
      } else {
        // Check if we're at an operator
        const remaining = query.substring(i);
        const match = remaining.match(operatorRegex);

        if (match && match.index === 0 && parenthesesDepth === 0) {
          // Found operator at top level
          if (currentPart.trim()) {
            parts.push(currentPart.trim());
          }
          currentPart = '';
          i += match[0].length;
        } else {
          currentPart += char;
          i++;
        }
      }
    }

    if (currentPart.trim()) {
      parts.push(currentPart.trim());
    }

    return parts.length > 0 ? parts : [query];
  }

  /**
   * Parse an AND expression or a single expression
   */
  private parseAndExpression(expression: string): any {
    // Remove surrounding parentheses if present
    expression = expression.trim();
    if (expression.startsWith('(') && expression.endsWith(')')) {
      expression = expression.substring(1, expression.length - 1).trim();
    }

    // Check for OR within this expression (recursive)
    const orParts = this.splitByLogicalOperator(expression, 'OR');
    if (orParts.length > 1) {
      return {
        $or: orParts.map(part => this.parseAndExpression(part))
      };
    }

    // Split by AND
    const andParts = this.splitByLogicalOperator(expression, 'AND');

    if (andParts.length > 1) {
      // Multiple AND conditions
      const conditions = andParts.map(part => this.parseCondition(part)).filter(c => c !== null);
      return { $and: conditions };
    }

    // Single condition
    return this.parseCondition(expression);
  }

  /**
   * Parse a single condition like "color == Red" or "playCost > 5"
   */
  private parseCondition(condition: string): any {
    condition = condition.trim();

    // Remove surrounding parentheses if present
    if (condition.startsWith('(') && condition.endsWith(')')) {
      condition = condition.substring(1, condition.length - 1).trim();
    }

    // Define operators in order of precedence (longest first to avoid partial matches)
    const operators = [
      { op: '>=', siftOp: '$gte' },
      { op: '<=', siftOp: '$lte' },
      { op: '!=', siftOp: '$ne' },
      { op: '==', siftOp: '$eq' },
      { op: '>', siftOp: '$gt' },
      { op: '<', siftOp: '$lt' },
      { op: 'contains', siftOp: '$regex' },
      { op: 'not_contains', siftOp: '$not' },
      { op: 'starts_with', siftOp: '$regex' },
      { op: 'ends_with', siftOp: '$regex' },
      { op: 'includes', siftOp: '$in' },
      { op: 'not_includes', siftOp: '$nin' }
    ];

    for (const { op, siftOp } of operators) {
      const regex = new RegExp(`\\s+${op}\\s+`, 'i');
      const parts = condition.split(regex);

      if (parts.length === 2) {
        const field = this.normalizeFieldName(parts[0].trim());
        let value: any = parts[1].trim().replace(/^["']|["']$/g, ''); // Remove quotes

        // Handle special operators
        if (op === 'contains') {
          return { [field]: { $regex: value, $options: 'i' } };
        } else if (op === 'not_contains') {
          return { [field]: { $not: { $regex: value, $options: 'i' } } };
        } else if (op === 'starts_with') {
          return { [field]: { $regex: `^${value}`, $options: 'i' } };
        } else if (op === 'ends_with') {
          return { [field]: { $regex: `${value}$`, $options: 'i' } };
        } else if (op === 'includes' || op === 'not_includes') {
          // For array/string includes
          return { [field]: { [siftOp]: [value] } };
        } else if (op === '==' || op === '!=') {
          // Case-insensitive equality for strings
          if (isNaN(Number(value))) {
            // String comparison - use regex for case-insensitive
            if (op === '==') {
              return { [field]: { $regex: `^${this.escapeRegex(value)}$`, $options: 'i' } };
            } else {
              return { [field]: { $not: { $regex: `^${this.escapeRegex(value)}$`, $options: 'i' } } };
            }
          } else {
            // Numeric comparison
            value = Number(value);
            return { [field]: { [siftOp]: value } };
          }
        } else {
          // Numeric operators
          value = Number(value);
          return { [field]: { [siftOp]: value } };
        }
      }
    }

    console.warn('Could not parse condition:', condition);
    return null;
  }

  /**
   * Escape special regex characters
   */
  private escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Normalize field names to match DigimonCard properties
   */
  private normalizeFieldName(fieldName: string): string {
    const fieldMap: { [key: string]: string } = {
      'color': 'color',
      'colour': 'color',
      'rarity': 'rarity',
      'cardtype': 'cardType',
      'card-type': 'cardType',
      'card type': 'cardType',
      'type': 'cardType',
      'playcost': 'playCost',
      'play-cost': 'playCost',
      'play cost': 'playCost',
      'cost': 'playCost',
      'level': 'cardLv',
      'lv': 'cardLv',
      'dp': 'dp',
      'name': 'name.english',
      'effect': 'effect',
      'form': 'form',
      'attribute': 'attribute',
      'digimontype': 'type',
      'digimon-type': 'type',
      'digimon type': 'type',
      'illustrator': 'illustrator',
      'artist': 'illustrator',
      'block': 'block',
      'version': 'version',
      'cardnumber': 'cardNumber',
      'card-number': 'cardNumber',
      'card number': 'cardNumber',
      'number': 'cardNumber'
    };

    const normalized = fieldName.toLowerCase().replace(/[^a-z-\s]/g, '');
    return fieldMap[normalized] || fieldName;
  }
}
