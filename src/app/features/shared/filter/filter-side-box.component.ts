import { WebsiteActions } from './../../../store/digimon.actions';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { MessageService } from 'primeng/api';
import { MultiSelectModule } from 'primeng/multiselect';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { itemsAsSelectItem } from 'src/app/functions/digimon-card.functions';
import { IFilter } from '../../../../models';
import {
  Attributes,
  Colors,
  Forms,
  Illustrators,
  Keywords,
  Restrictions,
  SpecialRequirements,
  Types,
} from '../../../../models/data/filter.data';
import { selectFilter } from '../../../store/digimon.selectors';
import { emptyFilter } from '../../../store/reducers/digimon.reducers';
import { RangeSliderComponent } from '../range-slider.component';
import { SortButtonsComponent } from '../sort-buttons.component';
import { BlockFilterComponent } from './block-filter.component';
import { CardTypeFilterComponent } from './card-type-filter.component';
import { ColorFilterComponent } from './color-filter.component';
import { LanguageFilterComponent } from './language-filter.component';
import { RarityFilterComponent } from './rarity-filter.component';
import { SetFilterComponent } from './set-filter.component';
import { VersionFilterComponent } from './version-filter.component';

@Component({
  selector: 'digimon-filter-side-box',
  template: `
    <div class="mx-1 flex h-full w-full flex-col pt-1">
      <div class="mt-1 grid w-full grid-cols-4">
        <div></div>

        <digimon-sort-buttons class="col-span-2 mx-auto"></digimon-sort-buttons>

        <button
          (click)="reset()"
          class="ml-auto mr-5 text-[#e2e4e6]"
          type="button">
          <i class="pi pi-refresh"></i>
        </button>
      </div>

      <digimon-language-filter></digimon-language-filter>
      <digimon-color-filter></digimon-color-filter>
      <digimon-card-type-filter></digimon-card-type-filter>
      <digimon-set-filter></digimon-set-filter>

      <div class="flex flex-row">
        <digimon-range-slider
          [reset]="resetEmitter"
          [minMax]="[2, 7]"
          [filterFormControl]="levelFilter"
          title="Level:"
          class="w-full"></digimon-range-slider>
        <button
          (click)="levelFilter.setValue([2, 7], { emitEvent: false })"
          class="w-12 text-[#e2e4e6]"
          type="button">
          <i class="pi pi-refresh"></i>
        </button>
      </div>

      <div class="flex flex-row">
        <digimon-range-slider
          [reset]="resetEmitter"
          [minMax]="[0, 20]"
          [filterFormControl]="playCostFilter"
          title="Play Cost:"
          class="w-full"></digimon-range-slider>
        <button
          (click)="playCostFilter.setValue([0, 20], { emitEvent: false })"
          class="w-12 text-[#e2e4e6]"
          type="button">
          <i class="pi pi-refresh"></i>
        </button>
      </div>

      <div class="flex flex-row">
        <digimon-range-slider
          [reset]="resetEmitter"
          [minMax]="[0, 7]"
          [filterFormControl]="digivolutionFilter"
          title="Digivolution Cost:"
          class="w-full"></digimon-range-slider>
        <button
          (click)="digivolutionFilter.setValue([0, 7], { emitEvent: false })"
          class="w-12 text-[#e2e4e6]"
          type="button">
          <i class="pi pi-refresh"></i>
        </button>
      </div>

      <div class="flex flex-row">
        <digimon-range-slider
          [reset]="resetEmitter"
          [minMax]="[1, 17]"
          [filterFormControl]="dpFilter"
          suffix="000"
          title="DP:"
          class="w-full"></digimon-range-slider>
        <button
          (click)="dpFilter.setValue([1, 17], { emitEvent: false })"
          class="w-12 text-[#e2e4e6]"
          type="button">
          <i class="pi pi-refresh"></i>
        </button>
      </div>

      <div class="flex flex-row">
        <digimon-range-slider
          [reset]="resetEmitter"
          [minMax]="[0, 5]"
          [filterFormControl]="cardCountFilter"
          title="Number in Collection:"
          class="w-full"></digimon-range-slider>
        <button
          (click)="cardCountFilter.setValue([0, 5], { emitEvent: false })"
          class="w-12 text-[#e2e4e6]"
          type="button">
          <i class="pi pi-refresh"></i>
        </button>
      </div>

      <digimon-rarity-filter></digimon-rarity-filter>
      <digimon-version-filter></digimon-version-filter>
      <digimon-block-filter></digimon-block-filter>

      <p-multiSelect
        [formControl]="keywordFilter"
        [options]="keywords"
        [showToggleAll]="false"
        defaultLabel="Select a Keyword"
        display="chip"
        scrollHeight="250px"
        class="mx-auto my-1 w-full max-w-[250px]"
        styleClass="w-full mt-1 h-8 text-sm max-w-[250px]">
      </p-multiSelect>

      <p-multiSelect
        [formControl]="formFilter"
        [options]="forms"
        [showToggleAll]="false"
        defaultLabel="Select a Form"
        display="chip"
        scrollHeight="250px"
        class="mx-auto mb-1 w-full max-w-[250px]"
        styleClass="w-full mt-1 h-8 text-sm max-w-[250px]">
      </p-multiSelect>

      <p-multiSelect
        [formControl]="attributeFilter"
        [options]="attributes"
        [showToggleAll]="false"
        defaultLabel="Select an Attribute"
        display="chip"
        scrollHeight="250px"
        class="mx-auto mb-1 w-full max-w-[250px]"
        styleClass="w-full mt-1 h-8 text-sm max-w-[250px]">
      </p-multiSelect>

      <p-multiSelect
        [formControl]="typeFilter"
        [options]="types"
        [showToggleAll]="false"
        defaultLabel="Select a Type"
        display="chip"
        scrollHeight="250px"
        class="mx-auto mb-1 w-full max-w-[250px]"
        styleClass="w-full mt-1 h-8 text-sm max-w-[250px]">
      </p-multiSelect>

      <p-multiSelect
        [formControl]="specialRequirementsFilter"
        [options]="specialRequirements"
        [showToggleAll]="false"
        defaultLabel="Select a Special Requirement"
        display="chip"
        scrollHeight="250px"
        class="mx-auto mb-1 w-full max-w-[250px]"
        styleClass="w-full mt-1 h-8 text-sm max-w-[250px]">
      </p-multiSelect>

      <p-multiSelect
        [formControl]="illustratorFilter"
        [options]="illustrators"
        [showToggleAll]="false"
        defaultLabel="Select an Illustrator"
        display="chip"
        scrollHeight="250px"
        class="mx-auto mb-1 w-full max-w-[250px]"
        styleClass="w-full mt-1 h-8 text-sm max-w-[250px]">
      </p-multiSelect>

      <p-multiSelect
        [formControl]="restrictionsFilter"
        [options]="restrictions"
        [showToggleAll]="false"
        defaultLabel="Select a Restrictions"
        display="chip"
        scrollHeight="250px"
        class="mx-auto mb-1 w-full max-w-[250px]"
        styleClass="w-full mt-1 h-8 text-sm max-w-[250px]">
      </p-multiSelect>
    </div>
  `,
  styleUrls: ['filter-side-box.component.scss'],
  standalone: true,
  imports: [
    SortButtonsComponent,
    LanguageFilterComponent,
    ColorFilterComponent,
    CardTypeFilterComponent,
    SetFilterComponent,
    RangeSliderComponent,
    RarityFilterComponent,
    VersionFilterComponent,
    BlockFilterComponent,
    MultiSelectModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [MessageService],
})
export class FilterSideBoxComponent implements OnInit, OnDestroy {
  @Input() public showColors: boolean;

  keywordFilter = new UntypedFormControl([]);
  formFilter = new UntypedFormControl([]);
  attributeFilter = new UntypedFormControl([]);
  typeFilter = new UntypedFormControl([]);
  illustratorFilter = new UntypedFormControl([]);
  specialRequirementsFilter = new UntypedFormControl([]);
  restrictionsFilter = new UntypedFormControl([]);
  sourceFilter = new UntypedFormControl([]);
  levelFilter = new UntypedFormControl([]);
  playCostFilter = new UntypedFormControl([]);
  digivolutionFilter = new UntypedFormControl([]);
  dpFilter = new UntypedFormControl([]);
  cardCountFilter = new UntypedFormControl([]);

  filterFormGroup: UntypedFormGroup = new UntypedFormGroup({
    keywordFilter: this.keywordFilter,
    formFilter: this.formFilter,
    attributeFilter: this.attributeFilter,
    typeFilter: this.typeFilter,
    illustratorFilter: this.illustratorFilter,
    specialRequirementsFilter: this.specialRequirementsFilter,
    restrictionsFilter: this.restrictionsFilter,
    sourceFilter: this.sourceFilter,
    levelFilter: this.levelFilter,
    playCostFilter: this.playCostFilter,
    digivolutionFilter: this.digivolutionFilter,
    dpFilter: this.dpFilter,
    cardCountFilter: this.cardCountFilter,
  });

  keywords = itemsAsSelectItem(Keywords);
  forms = itemsAsSelectItem(Forms);
  attributes = itemsAsSelectItem(Attributes);
  types = itemsAsSelectItem(Types);
  colors = itemsAsSelectItem(Colors);
  illustrators = itemsAsSelectItem(Illustrators);
  specialRequirements = itemsAsSelectItem(SpecialRequirements);
  restrictions = itemsAsSelectItem(Restrictions);

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

        this.levelFilter.setValue(filter.levelFilter, { emitEvent: false });
        this.playCostFilter.setValue(filter.playCostFilter, {
          emitEvent: false,
        });
        this.digivolutionFilter.setValue(filter.digivolutionFilter, {
          emitEvent: false,
        });
        this.dpFilter.setValue(filter.dpFilter, { emitEvent: false });
        this.cardCountFilter.setValue(filter.cardCountFilter, {
          emitEvent: false,
        });

        this.keywordFilter.setValue(filter.keywordFilter, { emitEvent: false });
        this.formFilter.setValue(filter.formFilter, { emitEvent: false });
        this.attributeFilter.setValue(filter.attributeFilter, {
          emitEvent: false,
        });
        this.typeFilter.setValue(filter.typeFilter, { emitEvent: false });
        this.illustratorFilter.setValue(filter.illustratorFilter, {
          emitEvent: false,
        });
        this.specialRequirementsFilter.setValue(
          filter.specialRequirementsFilter,
          { emitEvent: false }
        );
        this.restrictionsFilter.setValue(filter.restrictionsFilter, {
          emitEvent: false,
        });
        this.sourceFilter.setValue(filter.sourceFilter, {
          emitEvent: false,
        });
      });

    this.filterFormGroup.valueChanges
      .pipe(debounceTime(500), takeUntil(this.onDestroy$))
      .subscribe((filterValue) => {
        const filter: IFilter = { ...this.filter, ...filterValue };
        this.store.dispatch(WebsiteActions.setfilter({ filter }));
      });
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  reset() {
    this.resetEmitter.emit();
    this.store.dispatch(WebsiteActions.setfilter({ filter: emptyFilter }));
    this.messageService.add({
      severity: 'info',
      detail: 'All filter were reset.',
    });
  }
}
