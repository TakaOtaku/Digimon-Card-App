import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { IFilter } from '../../../../../models';
import { CARDSET } from '../../../../../models/enums/card-set.enum';
import { ISelectItem } from '../../../../../models/interfaces/select-item.interface';
import {
  changeCardSets,
  changeFilter,
} from '../../../../store/digimon.actions';
import {
  selectCardSet,
  selectCollectionMode,
  selectFilter,
} from '../../../../store/digimon.selectors';
import { emptyFilter } from '../../../../store/reducers/digimon.reducers';
import {
  Attributes,
  BlockButtons,
  CardTypeButtons,
  Colors,
  Forms,
  GroupedSets,
  Illustrators,
  Keywords,
  RarityButtons,
  Restrictions,
  SpecialRequirements,
  Types,
  VersionButtons,
} from './filterData';

@Component({
  selector: 'digimon-filter-side-box',
  templateUrl: './filter-side-box.component.html',
  styleUrls: ['./filter-side-box.component.scss'],
})
export class FilterSideBoxComponent implements OnInit, OnDestroy {
  @Input() public showColors: boolean;

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
  restrictionsFilter = new FormControl([]);
  sourceFilter = new FormControl([]);

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
    restrictionsFilter: this.restrictionsFilter,
    sourceFilter: this.sourceFilter,
  });

  groupedSets = GroupedSets;
  keywords = this.itemsAsSelectItem(Keywords);
  forms = this.itemsAsSelectItem(Forms);
  attributes = this.itemsAsSelectItem(Attributes);
  types = this.itemsAsSelectItem(Types);
  colors = this.itemsAsSelectItem(Colors);
  illustrators = this.itemsAsSelectItem(Illustrators);
  specialRequirements = this.itemsAsSelectItem(SpecialRequirements);
  restrictions = this.itemsAsSelectItem(Restrictions);

  collectionMode = false;
  selectedCardSet = 'English';

  cardSet = CARDSET;
  cardTypeButtons = CardTypeButtons;
  rarityButtons = RarityButtons;
  versionButtons = VersionButtons;
  blockButtons = BlockButtons;

  resetEmitter = new EventEmitter<void>();

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
        this.restrictionsFilter.setValue(filter.restrictionsFilter, {
          emitEvent: false,
        });
        this.sourceFilter.setValue(filter.sourceFilter, {
          emitEvent: false,
        });
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

    this.setCardSetSubscriptions();
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
  }

  private setCardSetSubscriptions() {
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

  reset() {
    this.resetEmitter.emit();
    this.store.dispatch(changeFilter({ filter: emptyFilter }));
    this.messageService.add({
      severity: 'info',
      detail: 'All filter were reset.',
    });
  }

  setCardSet(cardSet: string) {
    this.store.dispatch(changeCardSets({ cardSet }));
  }

  itemsAsSelectItem(array: string[]): ISelectItem[] {
    return array.map((item) => ({ label: item, value: item } as ISelectItem));
  }

  //region Slider Functions
  updateCardCountSlider(event: any) {
    this.store.dispatch(
      changeFilter({
        filter: { ...this.filter, cardCountFilter: event },
      })
    );
  }

  updateLevelSlider(event: any) {
    this.store.dispatch(
      changeFilter({ filter: { ...this.filter, levelFilter: event } })
    );
  }

  updatePlayCostSlider(event: any) {
    this.store.dispatch(
      changeFilter({ filter: { ...this.filter, playCostFilter: event } })
    );
  }

  updateDigivolutionSlider(event: any) {
    this.store.dispatch(
      changeFilter({
        filter: { ...this.filter, digivolutionFilter: event },
      })
    );
  }

  updateDPSlider(event: any) {
    this.store.dispatch(
      changeFilter({ filter: { ...this.filter, dpFilter: event } })
    );
  }

  //endregion

  //region Multi-Button Functions
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

  changeBlock(block: string) {
    let blocks = [];
    if (this.filter.blockFilter.includes(block)) {
      blocks = this.filter.blockFilter.filter((value) => value !== block);
    } else {
      blocks = [...new Set(this.filter.blockFilter), block];
    }

    const filter: IFilter = { ...this.filter, blockFilter: blocks };
    this.store.dispatch(changeFilter({ filter }));
  }
  //endregion
}
