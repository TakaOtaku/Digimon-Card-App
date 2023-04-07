import { Component, Input } from '@angular/core';
import { FormControl, UntypedFormGroup } from '@angular/forms';
import { TAGS } from '../../../../models';

@Component({
  selector: 'digimon-decks-filter',
  template: `
    <div [formGroup]="form" class="my-1  grid max-w-6xl grid-cols-4 lg:flex lg:flex-row">
      <span
        [ngClass]="{
          'col-span-2': mode !== 'Tournament',
          'col-span-3': mode === 'Tournament'
        }"
        class="p-input-icon-left my-1 w-full">
        <i class="pi pi-search h-3"></i>
        <input
          formControlName="searchFilter"
          class="w-full text-xs"
          pInputText
          placeholder="Search (Title, Description, User, Card-Ids, Color)"
          type="text" />
      </span>
      <span *ngIf="mode === 'Tournament'" class="my-1 w-full max-w-[90px]">
        <input
          formControlName="placementFilter"
          class="w-full text-xs"
          pStyleClass="w-full"
          pInputText
          placeholder="Placement"
          type="number"
          min="1" />
      </span>
      <p-multiSelect
        *ngIf="mode === 'Tournament'"
        formControlName="sizeFilter"
        [options]="tournamentSizes"
        optionLabel="name"
        [showToggleAll]="false"
        defaultLabel="Tournament Size"
        display="chip"
        scrollHeight="250px"
        class="col-span-2 my-1 mx-auto w-full max-w-[250px]"
        styleClass="w-full h-[34px] text-sm max-w-[250px]">
      </p-multiSelect>
      <p-multiSelect
        *ngIf="mode === 'Tournament'"
        formControlName="formatFilter"
        [options]="tags"
        [showToggleAll]="false"
        defaultLabel="Tournament Format"
        display="chip"
        scrollHeight="250px"
        class="col-span-2 my-1 mx-auto w-full max-w-[250px]"
        styleClass="w-full h-[34px] text-sm max-w-[250px]">
      </p-multiSelect>
      <p-multiSelect
        *ngIf="mode === 'Community'"
        formControlName="tagFilter"
        [options]="tags"
        [showToggleAll]="false"
        defaultLabel="Select a Tag"
        display="chip"
        scrollHeight="250px"
        class="col-span-2 my-1 mx-auto w-full max-w-[250px]"
        styleClass="w-full h-[34px] text-sm max-w-[250px]">
      </p-multiSelect>
    </div>
  `,
})
export class DecksFilterComponent {
  @Input() form: UntypedFormGroup;
  @Input() mode = 'Community';

  tags = TAGS;
  tournamentSizes = [
    { name: 'Small (4-8 Player)', value: 'Small' },
    { name: 'Medium (8-16 Player)', value: 'Medium' },
    { name: 'Large (16-32 Player)', value: 'Large' },
    { name: 'Major Event (32+ Player)', value: 'Major' },
  ];
}
