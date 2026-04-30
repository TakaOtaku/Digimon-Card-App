/**
 * Single source of truth for all card set definitions.
 *
 * To add a new set, just add an entry to CARD_SETS below.
 * ReleaseOrder, TAGS, tagsList, and GroupedSets are all derived automatically.
 */
import { ITag } from '../interfaces';

export type SetCategory = 'Standard' | 'Extra' | 'Starter' | 'Misc';

export interface CardSet {
  /** Set code as used in card IDs, e.g. 'BT1', 'EX12', 'ST24' */
  name: string;
  category: SetCategory;
}

/**
 * Master list of all card sets, ordered from NEWEST to OLDEST.
 * This order is used for release-order sorting and "newest set" detection.
 */
export const CARD_SETS: CardSet[] = [
  // ---- Newest ----
  { name: 'EX12', category: 'Extra' },
  { name: 'BT25', category: 'Standard' },
  { name: 'ST24', category: 'Starter' },
  { name: 'ST23', category: 'Starter' },
  { name: 'AD1', category: 'Misc' },
  { name: 'EX11', category: 'Extra' },
  { name: 'BT24', category: 'Standard' },
  { name: 'ST22', category: 'Starter' },
  { name: 'BT23', category: 'Standard' },
  { name: 'EX10', category: 'Extra' },
  { name: 'BT22', category: 'Standard' },
  { name: 'EX9', category: 'Extra' },
  { name: 'BT21', category: 'Standard' },
  { name: 'ST21', category: 'Starter' },
  { name: 'ST20', category: 'Starter' },
  { name: 'BT20', category: 'Standard' },
  { name: 'EX8', category: 'Extra' },
  { name: 'BT19', category: 'Standard' },
  { name: 'BT18', category: 'Standard' },
  { name: 'EX7', category: 'Extra' },
  { name: 'ST19', category: 'Starter' },
  { name: 'ST18', category: 'Starter' },
  { name: 'BT17', category: 'Standard' },
  { name: 'EX6', category: 'Extra' },
  { name: 'BT16', category: 'Standard' },
  { name: 'ST17', category: 'Starter' },
  { name: 'BT15', category: 'Standard' },
  { name: 'EX5', category: 'Extra' },
  { name: 'BT14', category: 'Standard' },
  { name: 'ST16', category: 'Starter' },
  { name: 'ST15', category: 'Starter' },
  { name: 'RB1', category: 'Misc' },
  { name: 'BT13', category: 'Standard' },
  { name: 'EX4', category: 'Extra' },
  { name: 'BT12', category: 'Standard' },
  { name: 'ST14', category: 'Starter' },
  { name: 'BT11', category: 'Standard' },
  { name: 'EX3', category: 'Extra' },
  { name: 'BT10', category: 'Standard' },
  { name: 'ST13', category: 'Starter' },
  { name: 'ST12', category: 'Starter' },
  { name: 'BT9', category: 'Standard' },
  { name: 'EX2', category: 'Extra' },
  { name: 'BT8', category: 'Standard' },
  { name: 'ST11', category: 'Starter' },
  { name: 'ST10', category: 'Starter' },
  { name: 'ST9', category: 'Starter' },
  { name: 'BT7', category: 'Standard' },
  { name: 'EX1', category: 'Extra' },
  { name: 'BT6', category: 'Standard' },
  { name: 'ST8', category: 'Starter' },
  { name: 'ST7', category: 'Starter' },
  { name: 'BT5', category: 'Standard' },
  { name: 'BT4', category: 'Standard' },
  { name: 'ST6', category: 'Starter' },
  { name: 'ST5', category: 'Starter' },
  { name: 'ST4', category: 'Starter' },
  { name: 'BT3', category: 'Standard' },
  { name: 'BT2', category: 'Standard' },
  { name: 'BT1', category: 'Standard' },
  { name: 'ST3', category: 'Starter' },
  { name: 'ST2', category: 'Starter' },
  { name: 'ST1', category: 'Starter' },
  { name: 'LM', category: 'Misc' },
  { name: 'P', category: 'Misc' },
  // ---- Oldest ----
];

// ---------------------------------------------------------------------------
// Derived exports — consumers should use these instead of hand-maintained lists
// ---------------------------------------------------------------------------

/** Set names ordered newest → oldest (same order as CARD_SETS). */
export const ReleaseOrder: string[] = CARD_SETS.map((s) => s.name);

/** Alphabetically sorted set names (excluding 'P'). */
export const TAGS: string[] = CARD_SETS
  .filter((s) => s.name !== 'P')
  .map((s) => s.name)
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

/** Tag objects for each set + the synthetic 'Illegal' tag. */
export const tagsList: ITag[] = [
  ...TAGS.map((name) => ({ name, color: 'Primary' })),
  { name: 'Illegal', color: 'Primary' },
];

/** Helper to build the label shown in grouped set dropdowns. */
const setLabel = (name: string): string => name;

/** Sets grouped by category for dropdown / filter UI. */
export const GroupedSets = (() => {
  const categoryConfig: { label: string; value: string; category: SetCategory }[] = [
    { label: 'Standard', value: 'displays', category: 'Standard' },
    { label: 'Extra', value: 'extra', category: 'Extra' },
    { label: 'Starter Decks', value: 'starter', category: 'Starter' },
  ];

  const groups = categoryConfig.map(({ label, value, category }) => ({
    label,
    value,
    items: CARD_SETS
      .filter((s) => s.category === category)
      .map((s) => ({ label: setLabel(s.name), value: s.name }))
      .sort((a, b) => a.value.localeCompare(b.value, undefined, { numeric: true })),
  }));

  // Misc group (no label/value on the group itself, matching the original shape)
  const misc = {
    items: CARD_SETS
      .filter((s) => s.category === 'Misc')
      .map((s) => ({ label: setLabel(s.name), value: s.name }))
      .sort((a, b) => a.value.localeCompare(b.value, undefined, { numeric: true })),
  };

  return [...groups, misc];
})();
