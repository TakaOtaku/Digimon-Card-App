import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {Store} from "@ngrx/store";
import {Subject, takeUntil} from "rxjs";
import {changeFilter} from "../../store/digimon.actions";
import {selectFilter} from "../../store/digimon.selectors";

@Component({
  selector: 'digimon-filter-box',
  templateUrl: './filter-box.component.html',
  styleUrls: ['./filter-box.component.scss']
})
export class FilterBoxComponent implements OnInit, OnDestroy {
  @Input() public compact = false;

  display = false;

  private formGroup: FormGroup;
  searchFilter = new FormControl('');
  countFilter = new FormControl();

  setFilter = new FormControl([]);
  groupedSets = [
    {
      label: 'Standard', value: 'displays',
      items: [
        {label: 'BT1', value: 'BT1'},
        {label: 'BT2', value: 'BT2'},
        {label: 'BT3', value: 'BT3'},
        {label: 'BT4', value: 'BT4'},
        {label: 'BT5', value: 'BT5'},
        {label: 'BT6', value: 'BT6'},
        {label: 'BT7', value: 'BT7'},
        {label: 'BT8', value: 'BT8'}
      ]
    },
    {
      label: 'Extra', value: 'extra',
      items: [
        {label: 'EX1', value: 'EX1'}
      ]
    },
    {
      label: 'Starter Decks', value: 'starter',
      items: [
        {label: 'ST1', value: 'ST1'},
        {label: 'ST2', value: 'ST2'},
        {label: 'ST3', value: 'ST3'},
        {label: 'ST4', value: 'ST4'},
        {label: 'ST5', value: 'ST5'},
        {label: 'ST6', value: 'ST6'},
        {label: 'ST7', value: 'ST7'},
        {label: 'ST8', value: 'ST8'},
        {label: 'ST9', value: 'ST9'}
      ]
    }
  ];

  cardTypeFilter = new FormControl([]);
  cardTypes: string[] = ['Digi-Egg', 'Digimon', 'Tamer', 'Option'];

  colorFilter = new FormControl([]);
  colors: string[] = ['Red', 'Blue', 'Yellow', 'Green', 'Black', 'Purple', 'White', 'Multi'];

  formFilter = new FormControl([]);
  forms: string[] = ["In-Training", "Rookie", "Champion", "Ultimate", "Mega", "Hybrid"];

  attributeFilter = new FormControl([]);
  attributes: string[] = ['Data', 'Vaccine', 'Virus', 'Free', 'Variable'];

  typeFilter = new FormControl([]);
  types: string[] = [
    "Bulb",
    "Baby Dragon",
    "Amphibian",
    "Lesser",
    "Mini Angel",
    "Unidentified",
    "Mini Dragon",
    "Reptile",
    "Dinosaur",
    "Bird",
    "Avian",
    "Giant Bird",
    "Fire Dragon",
    "Earth Dragon",
    "Cyborg",
    "Birdkin",
    "Undead",
    "Dragonkin",
    "Machine Dragon",
    "Mammal",
    "Sea Beast",
    "Beast",
    "Ice-Snow",
    "Sea Animal",
    "Beastkin",
    "Puppet",
    "Dark Animal",
    "Machine",
    "Ancient Animal",
    "Holy Beast",
    "Fairy",
    "Angel",
    "Shaman",
    "Archangel",
    "Magic Warrior",
    "Authority",
    "Seraph",
    "Demon",
    "Vegetation",
    "Insectoid",
    "Carnivorous Plant",
    "Perfect",
    "Royal Knight",
    "Mythical Dragon",
    "Dark Dragon",
    "Four Great Dragons",
    "Rock",
    "Mollusk",
    "Evil",
    "Wizard",
    "Fallen Angel",
    "Composite",
    "Seven Great Demon Lords",
    "Evil Dragon",
    "-",
    "Mutant",
    "Mini Bird",
    "Larva",
    "Armor",
    "Flame",
    "Rock Dragon",
    "Holy Dragon",
    "Three Great Angels",
    "Thron",
    "Light Dragon",
    "Legend-Arms",
    "Holy Sword",
    "Warrior",
    "Unique",
    "Mythical Beast",
    "Ancient Dragon",
    "Ankylosaur",
    "Cherub",
    "Virtue",
    "Olympos XII",
    "Boss",
    "D-Brigade",
    "Armor/Legend-Arms",
    "Abnormal",
    "Mine",
    "Beast Knight",
    "Demon Lord",
    "Holy Warrior",
    "Weapon",
    "Dragon",
    "Crustacean",
    "Ancient Bird",
    "Unknown",
    "Mysterious Bird",
    "Throne",
    "Holy Bird",
    "Mineral",
    "Machine",
    "Ghost",
    "Ten Warriors",
    "Minor",
    "Ceratopsian",
    "Big Death-Stars",
    "Ancient Fish",
    "Aquabeast",
    "Magic Knight",
    "Major",
    "Mysterious Beast",
    "Super Major",
    "Ancient",
    "Boss",
    "CRT",
    "Deva",
    "Dark Knight",
    "Evil Dragon",
    "X-Antibody",
    "Three Musketeers",
    "Elusive Beast",
    "Four Sovereigns",
    "Ancient Plant",
    "Invader",
    "Lesser",
    "Plesiosaur",
    "Dragon Warrior",
    "Ancient Birdkin",
    "Mutant",
    "Dinosaur",
    "Ancient Insect",
    "Beast",
    "Beast Dragon",
    "Ancient Mineral",
    "Ancient Mythical Beast",
    "Ancient Dragonkin",
    "Ancient Holy Warrior",
    "Bird Dragon",
    "Sky Dragon"
  ].sort();

  lvFilter = new FormControl([]);
  lvs: string[] = ['Lv.2', 'Lv.3', 'Lv.4', 'Lv.5', 'Lv.6', 'Lv.7'];

  rarityFilter = new FormControl([]);
  rarities: string[] = ['P', 'C', 'U', 'R', 'SR', 'SEC'];

  versionFilter = new FormControl([]);
  versions: string[] = ['Normal', 'AA', 'Stamp'];

  private destroy$ = new Subject();

  constructor(private store: Store) {
    this.formGroup = new FormGroup({
      searchFilter: this.searchFilter,
      cardCountFilter: this.countFilter,
      setFilter: this.setFilter,
      colorFilter: this.colorFilter,
      cardTypeFilter: this.cardTypeFilter,
      formFilter: this.formFilter,
      attributeFilter: this.attributeFilter,
      typeFilter: this.typeFilter,
      lvFilter: this.lvFilter,
      rarityFilter: this.rarityFilter,
      versionFilter: this.versionFilter,
    })
  }

  ngOnInit(): void {
    this.store.select(selectFilter).pipe(takeUntil(this.destroy$))
      .subscribe((filter) => {
        this.formGroup.setValue(filter, {emitEvent: false});
      });

    this.formGroup.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((filter) => {
        this.store.dispatch(changeFilter({filter}))
      });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }

  openFilterDialog() {
    this.display = true;
  }
}
