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
import { IFilter } from '../../../../models';
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
} from '../../../../models/data/filter.data';
import { CARDSET } from '../../../../models/enums/card-set.enum';
import { ISelectItem } from '../../../../models/interfaces/select-item.interface';
import { changeCardSets, changeFilter } from '../../../store/digimon.actions';
import {
  selectCardSet,
  selectCollectionMode,
  selectFilter,
} from '../../../store/digimon.selectors';
import { emptyFilter } from '../../../store/reducers/digimon.reducers';

@Component({
  selector: 'digimon-filter-side-box',
  template: `
    <div class="surface-card mx-1 flex h-full w-full flex-col pt-1">
      <div class="w-ful mt-1 grid grid-cols-4">
        <div></div>

        <digimon-sort-buttons class="col-span-2 mx-auto"></digimon-sort-buttons>

        <button (click)="reset()" class="ml-auto mr-5 text-white" type="button">
          <i class="pi pi-refresh"></i>
        </button>
      </div>

      <!-- Language Select -->
      <div class="mb-3">
        <h1 class="text-center text-xs font-bold text-white">Language:</h1>
        <div class="flex inline-flex w-full justify-center">
          <button
            (click)="setCardSet(cardSet.English)"
            [ngClass]="{
              'primary-background': selectedCardSet === cardSet.English
            }"
            class="min-w-auto mt-2 h-8 w-20 rounded-l-sm border border-slate-100 p-2 text-xs font-semibold text-white"
          >
            English
          </button>
          <button
            (click)="setCardSet(cardSet.Japanese)"
            [ngClass]="{
              'primary-background': selectedCardSet === cardSet.Japanese
            }"
            class="min-w-auto mt-2 h-8 w-20 border border-slate-100 p-2 text-xs font-semibold text-white"
          >
            日本語
          </button>
          <button
            (click)="setCardSet(cardSet.Both)"
            [ngClass]="{
              'primary-background': selectedCardSet === cardSet.Both
            }"
            class="min-w-auto mt-2 h-8 w-20 rounded-r-sm border border-slate-100 p-2 text-xs font-semibold text-white"
          >
            Both
          </button>
        </div>
      </div>

      <!-- Colors Select -->
      <div class="mb-3">
        <h1 class="mb-2 text-center text-xs font-bold text-white">Color:</h1>
        <div class="flex inline-flex w-full justify-center">
          <button
            (click)="changeColor('Red')"
            [ngClass]="{
              'border-selected': colorFilter.value.includes('Red'),
              'border-unselected': !colorFilter.value.includes('Red')
            }"
            class="Red mr-1 h-7 w-7 rounded-full"
          ></button>
          <button
            (click)="changeColor('Blue')"
            [ngClass]="{
              'border-selected': colorFilter.value.includes('Blue'),
              'border-unselected': !colorFilter.value.includes('Blue')
            }"
            class="Blue mr-1 h-7 w-7 rounded-full"
          ></button>
          <button
            (click)="changeColor('Yellow')"
            [ngClass]="{
              'border-selected': colorFilter.value.includes('Yellow'),
              'border-unselected': !colorFilter.value.includes('Yellow')
            }"
            class="Yellow mr-1 h-7 w-7 rounded-full"
          ></button>
          <button
            (click)="changeColor('Green')"
            [ngClass]="{
              'border-selected': colorFilter.value.includes('Green'),
              'border-unselected': !colorFilter.value.includes('Green')
            }"
            class="Green mr-1 h-7 w-7 rounded-full"
          ></button>
          <button
            (click)="changeColor('Black')"
            [ngClass]="{
              'border-selected': colorFilter.value.includes('Black'),
              'border-unselected': !colorFilter.value.includes('Black')
            }"
            class="Black mr-1 h-7 w-7 rounded-full"
          ></button>
          <button
            (click)="changeColor('Purple')"
            [ngClass]="{
              'border-selected': colorFilter.value.includes('Purple'),
              'border-unselected': !colorFilter.value.includes('Purple')
            }"
            class="Purple mr-1 h-7 w-7 rounded-full"
          ></button>
          <button
            (click)="changeColor('White')"
            [ngClass]="{
              'border-selected': colorFilter.value.includes('White'),
              'border-unselected': !colorFilter.value.includes('White')
            }"
            class="White mr-1 h-7 w-7 rounded-full"
          ></button>
          <button
            (click)="changeColor('Multi')"
            [ngClass]="{
              'border-selected': colorFilter.value.includes('Multi'),
              'border-unselected': !colorFilter.value.includes('Multi')
            }"
            class="Multi h-7 w-7 rounded-full"
          ></button>
        </div>
      </div>

      <digimon-multi-buttons
        (clickEvent)="changeCardType($event)"
        [buttonArray]="cardTypeButtons"
        [filterFormControl]="cardTypeFilter"
        [perRow]="4"
        title="Card-Types"
      ></digimon-multi-buttons>

      <p-multiSelect
        [filter]="false"
        [formControl]="setFilter"
        [group]="true"
        [options]="groupedSets"
        [showHeader]="false"
        [showToggleAll]="false"
        defaultLabel="Select a Set"
        display="chip"
        scrollHeight="250px"
        class="mx-auto mb-2 w-full max-w-[250px]"
        styleClass="w-full max-w-[250px] h-8 text-sm"
      >
        <ng-template let-group pTemplate="group">
          <div class="align-items-center flex">
            <span>{{ group.label }}</span>
          </div>
        </ng-template>
      </p-multiSelect>

      <digimon-range-slider
        (change)="updateLevelSlider($event)"
        [reset]="resetEmitter"
        [minMax]="[2, 7]"
        title="Level:"
      ></digimon-range-slider>

      <digimon-range-slider
        (change)="updatePlayCostSlider($event)"
        [reset]="resetEmitter"
        [minMax]="[0, 20]"
        title="Play Cost:"
      ></digimon-range-slider>

      <digimon-range-slider
        (change)="updateDigivolutionSlider($event)"
        [reset]="resetEmitter"
        [minMax]="[0, 7]"
        title="Digivolution Cost:"
      ></digimon-range-slider>

      <digimon-range-slider
        (change)="updateDPSlider($event)"
        [reset]="resetEmitter"
        [minMax]="[1, 16]"
        suffix="000"
        title="DP:"
      ></digimon-range-slider>

      <digimon-range-slider
        (change)="updateCardCountSlider($event)"
        [reset]="resetEmitter"
        [minMax]="[0, 5]"
        title="Number in Collection:"
      ></digimon-range-slider>

      <digimon-multi-buttons
        (clickEvent)="changeRarity($event)"
        [buttonArray]="rarityButtons"
        [filterFormControl]="rarityFilter"
        [perRow]="6"
        title="Rarity"
      ></digimon-multi-buttons>

      <digimon-multi-buttons
        (clickEvent)="changeVersion($event)"
        [buttonArray]="versionButtons"
        [filterFormControl]="versionFilter"
        [perRow]="4"
        title="Version"
      ></digimon-multi-buttons>

      <digimon-multi-buttons
        (clickEvent)="changeBlock($event)"
        [buttonArray]="blockButtons"
        [filterFormControl]="blockFilter"
        title="Block"
      ></digimon-multi-buttons>

      <p-multiSelect
        [formControl]="keywordFilter"
        [options]="keywords"
        [showToggleAll]="false"
        defaultLabel="Select a Keyword"
        display="chip"
        scrollHeight="250px"
        class="mx-auto my-1 w-full max-w-[250px]"
        styleClass="w-full mt-1 h-8 text-sm max-w-[250px]"
      >
      </p-multiSelect>

      <p-multiSelect
        [formControl]="formFilter"
        [options]="forms"
        [showToggleAll]="false"
        defaultLabel="Select a Form"
        display="chip"
        scrollHeight="250px"
        class="mx-auto mb-1 w-full max-w-[250px]"
        styleClass="w-full mt-1 h-8 text-sm max-w-[250px]"
      >
      </p-multiSelect>

      <p-multiSelect
        [formControl]="attributeFilter"
        [options]="attributes"
        [showToggleAll]="false"
        defaultLabel="Select an Attribute"
        display="chip"
        scrollHeight="250px"
        class="mx-auto mb-1 w-full max-w-[250px]"
        styleClass="w-full mt-1 h-8 text-sm max-w-[250px]"
      >
      </p-multiSelect>

      <p-multiSelect
        [formControl]="typeFilter"
        [options]="types"
        [showToggleAll]="false"
        defaultLabel="Select a Type"
        display="chip"
        scrollHeight="250px"
        class="mx-auto mb-1 w-full max-w-[250px]"
        styleClass="w-full mt-1 h-8 text-sm max-w-[250px]"
      >
      </p-multiSelect>

      <p-multiSelect
        [formControl]="specialRequirementsFilter"
        [options]="specialRequirements"
        [showToggleAll]="false"
        defaultLabel="Select a Special Requirement"
        display="chip"
        scrollHeight="250px"
        class="mx-auto mb-1 w-full max-w-[250px]"
        styleClass="w-full mt-1 h-8 text-sm max-w-[250px]"
      >
      </p-multiSelect>

      <p-multiSelect
        [formControl]="illustratorFilter"
        [options]="illustrators"
        [showToggleAll]="false"
        defaultLabel="Select an Illustrator"
        display="chip"
        scrollHeight="250px"
        class="mx-auto mb-1 w-full max-w-[250px]"
        styleClass="w-full mt-1 h-8 text-sm max-w-[250px]"
      >
      </p-multiSelect>

      <p-multiSelect
        [formControl]="restrictionsFilter"
        [options]="restrictions"
        [showToggleAll]="false"
        defaultLabel="Select a Restrictions"
        display="chip"
        scrollHeight="250px"
        class="mx-auto mb-1 w-full max-w-[250px]"
        styleClass="w-full mt-1 h-8 text-sm max-w-[250px]"
      >
      </p-multiSelect>
    </div>
  `,
  styles: [
    `
      .Colors::ng-deep {
        .p-selectbutton {
          .p-element:nth-child(1) {
            border-color: white !important;
            color: black !important;
            background: #ef1919 !important;
          }

          .p-element:nth-child(2) {
            border-color: white !important;
            color: black !important;
            background: #19a0e3 !important;
          }

          .p-element:nth-child(3) {
            border-color: white !important;
            color: black !important;
            background: #ffd619 !important;
          }

          .p-element:nth-child(4) {
            border-color: white !important;
            color: black !important;
            background: #19b383 !important;
          }

          .p-element:nth-child(5) {
            border-color: white !important;
            color: white !important;
            background: #191919 !important;
          }

          .p-element:nth-child(6) {
            border-color: white !important;
            color: black !important;
            background: #8d6fdb !important;
          }

          .p-element:nth-child(7) {
            border-color: white !important;
            color: black !important;
            background: #ffffff !important;
          }

          .p-element:nth-child(8) {
            border-color: white !important;
            color: black !important;
            background: linear-gradient(
              90deg,
              #ef1919 14%,
              #19a0e3 28%,
              #ffd619 42%,
              #19b383 56%,
              #191919 70%,
              #8d6fdb 84%,
              #ffffff 100%
            ) !important;
          }
        }
      }

      .cm {
        ::ng-deep .pi-circle-fill {
          color: green !important;
        }

        ::ng-deep .pi-circle {
          color: red !important;
        }
      }
    `,
  ],
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
