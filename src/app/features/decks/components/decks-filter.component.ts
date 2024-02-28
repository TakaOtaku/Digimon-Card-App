import { NgClass, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormGroup,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { StyleClassModule } from 'primeng/styleclass';
import { TAGS } from '../../../../models';

@Component({
  selector: 'digimon-decks-filter',
  template: `
    <div
      [formGroup]="form"
      class="my-1 grid max-w-7xl grid-cols-5 lg:flex lg:flex-row">
      <span class="col-span-5 sm:col-span-2 p-input-icon-left my-1 w-full">
        <i class="pi pi-search h-3"></i>
        <input
          formControlName="searchFilter"
          class="w-full text-xs"
          pInputText
          placeholder="Search (Title, Description, User, Card-Ids, Color)"
          type="text" />
      </span>
      <p-multiSelect
        formControlName="tagFilter"
        [options]="tags"
        [showToggleAll]="false"
        placeholder="Select a Tag"
        display="chip"
        scrollHeight="250px"
        class="col-span-3 sm:col-span-2 sm:mx-auto sm:my-1 w-full max-w-[250px]"
        styleClass="w-full h-[34px] text-sm max-w-[250px]">
      </p-multiSelect>
      <button
        (click)="applyFilter.emit(true)"
        class="col-span-2 sm:col-span-1 min-w-auto primary-background my-auto ml-2 h-8 sm:w-32 rounded p-2 text-xs font-semibold text-[#e2e4e6]">
        Filter
      </button>
    </div>
  `,
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgClass,
    InputTextModule,
    NgIf,
    StyleClassModule,
    MultiSelectModule,
  ],
})
export class DecksFilterComponent {
  @Input() form: UntypedFormGroup;

  @Output() applyFilter = new EventEmitter<any>();

  tags = TAGS;
}
