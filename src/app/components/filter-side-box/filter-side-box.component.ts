import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { IFilter } from '../../../models';
import { CARDSET } from '../../../models/card-set.enum';
import {
  changeCardSets,
  changeCollectionMode,
  changeFilter,
} from '../../store/digimon.actions';
import {
  selectCardSet,
  selectCollectionMode,
  selectFilter,
} from '../../store/digimon.selectors';
import { emptyFilter } from '../../store/reducers/digimon.reducers';
import {
  Attributes,
  Blocks,
  CardTypes,
  Colors,
  Forms,
  GroupedSets,
  Illustrators,
  Keywords,
  Rarities,
  SpecialRequirements,
  Types,
  Versions,
} from './filterData';

@Component({
  selector: 'digimon-filter-side-box',
  templateUrl: './filter-side-box.component.html',
  styleUrls: ['./filter-side-box.component.scss'],
})
export class FilterSideBoxComponent implements OnInit, OnDestroy {
  @Input() public showColors: boolean;

  selectedCardSet = 'English';

  setFilter = new FormControl([]);
  rarityFilter = new FormControl([]);
  versionFilter = new FormControl([]);
  keywordFilter = new FormControl([]);
  formFilter = new FormControl([]);
  attributeFilter = new FormControl([]);
  typeFilter = new FormControl([]);
  colorFilter = new FormControl([]);
  cardTypeFilter = new FormControl([]);
  illustratorFilter = new FormControl([]);
  specialRequirementsFilter = new FormControl([]);
  blockFilter = new FormControl([]);

  filterFormGroup: FormGroup = new FormGroup({
    setFilter: this.setFilter,
    rarityFilter: this.rarityFilter,
    versionFilter: this.versionFilter,
    keywordFilter: this.keywordFilter,
    formFilter: this.formFilter,
    attributeFilter: this.attributeFilter,
    typeFilter: this.typeFilter,
    cardTypeFilter: this.cardTypeFilter,
    colorFilter: this.colorFilter,
    illustratorFilter: this.illustratorFilter,
    specialRequirementsFilter: this.specialRequirementsFilter,
    blockFilter: this.blockFilter,
  });

  cardCountSlider: number[] = [0, 5];
  levelSlider: number[] = [2, 7];
  playCostSlider: number[] = [0, 20];
  digivolutionSlider: number[] = [0, 7];
  dpSlider: number[] = [1, 16];

  groupedSets = GroupedSets;
  rarities = Rarities;
  versions = Versions;
  keywords = Keywords;
  forms = Forms;
  attributes = Attributes;
  types = Types;
  cardTypes = CardTypes;
  colors = Colors;
  illustrators = Illustrators;
  specialRequirements = SpecialRequirements;
  blocks = Blocks;

  cardSet = CARDSET;

  collectionMode = false;

  private filter: IFilter;
  private onDestroy$ = new Subject();

  constructor(private store: Store, private messageService: MessageService) {}

  ngOnInit(): void {
    this.store
      .select(selectFilter)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((filter) => {
        this.filter = filter;

        this.setFilter.setValue(filter.setFilter, { emitEvent: false });
        this.rarityFilter.setValue(filter.rarityFilter, { emitEvent: false });
        this.versionFilter.setValue(filter.versionFilter, { emitEvent: false });
        this.keywordFilter.setValue(filter.keywordFilter, { emitEvent: false });
        this.formFilter.setValue(filter.formFilter, { emitEvent: false });
        this.attributeFilter.setValue(filter.attributeFilter, {
          emitEvent: false,
        });
        this.typeFilter.setValue(filter.typeFilter, { emitEvent: false });
        this.cardTypeFilter.setValue(filter.cardTypeFilter, {
          emitEvent: false,
        });
        this.colorFilter.setValue(filter.colorFilter, { emitEvent: false });
        this.illustratorFilter.setValue(filter.illustratorFilter, {
          emitEvent: false,
        });
        this.specialRequirementsFilter.setValue(
          filter.specialRequirementsFilter,
          { emitEvent: false }
        );
        this.blockFilter.setValue(filter.blockFilter, { emitEvent: false });

        this.cardCountSlider = [...new Set(filter.cardCountFilter)];
        this.levelSlider = [...new Set(filter.levelFilter)];
        this.playCostSlider = [...new Set(filter.playCostFilter)];
        this.digivolutionSlider = [...new Set(filter.digivolutionFilter)];
        this.dpSlider = [...new Set(filter.dpFilter)];
      });

    this.filterFormGroup.valueChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((filterValue) => {
        const filter: IFilter = { ...this.filter, ...filterValue };
        this.store.dispatch(changeFilter({ filter }));
      });

    this.store
      .select(selectCollectionMode)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((collectionMode) => {
        this.collectionMode = collectionMode;
      });

    this.store
      .select(selectCardSet)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((set) => {
        if (+set >>> 0) {
          this.selectedCardSet = CARDSET.Both;
        } else {
          this.selectedCardSet = set;
        }
      });
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
  }

  reset() {
    this.store.dispatch(changeFilter({ filter: emptyFilter }));
    this.messageService.add({
      severity: 'info',
      detail: 'All filter were reset.',
    });
  }

  updateCardCountSlider(event: any) {
    this.store.dispatch(
      changeFilter({
        filter: { ...this.filter, cardCountFilter: event.values },
      })
    );
  }

  updateLevelSlider(event: any) {
    this.store.dispatch(
      changeFilter({ filter: { ...this.filter, levelFilter: event.values } })
    );
  }

  updatePlayCostSlider(event: any) {
    this.store.dispatch(
      changeFilter({ filter: { ...this.filter, playCostFilter: event.values } })
    );
  }

  updateDigivolutionSlider(event: any) {
    this.store.dispatch(
      changeFilter({
        filter: { ...this.filter, digivolutionFilter: event.values },
      })
    );
  }

  updateDPSlider(event: any) {
    this.store.dispatch(
      changeFilter({ filter: { ...this.filter, dpFilter: event.values } })
    );
  }

  setCardSet(cardSet: string) {
    this.store.dispatch(changeCardSets({ cardSet }));
  }

  changeColor(color: string) {
    let colors = [];
    if (this.filter.colorFilter.includes(color)) {
      colors = this.filter.colorFilter.filter((value) => value !== color);
    } else {
      colors = [...new Set(this.filter.colorFilter), color];
    }

    const filter: IFilter = { ...this.filter, colorFilter: colors };
    this.store.dispatch(changeFilter({ filter }));
  }

  changeCardType(type: string) {
    let types = [];
    if (this.filter.cardTypeFilter.includes(type)) {
      types = this.filter.cardTypeFilter.filter((value) => value !== type);
    } else {
      types = [...new Set(this.filter.cardTypeFilter), type];
    }

    const filter: IFilter = { ...this.filter, cardTypeFilter: types };
    this.store.dispatch(changeFilter({ filter }));
  }

  changeRarity(rarity: string) {
    let rarities = [];
    if (this.filter.rarityFilter.includes(rarity)) {
      rarities = this.filter.rarityFilter.filter((value) => value !== rarity);
    } else {
      rarities = [...new Set(this.filter.rarityFilter), rarity];
    }

    const filter: IFilter = { ...this.filter, rarityFilter: rarities };
    this.store.dispatch(changeFilter({ filter }));
  }

  changeVersion(version: string) {
    let versions = [];
    if (this.filter.versionFilter.includes(version)) {
      versions = this.filter.versionFilter.filter((value) => value !== version);
    } else {
      versions = [...new Set(this.filter.versionFilter), version];
    }

    const filter: IFilter = { ...this.filter, versionFilter: versions };
    this.store.dispatch(changeFilter({ filter }));
  }
}
