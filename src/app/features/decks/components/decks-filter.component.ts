import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TAGS } from '../../../../models';

@Component({
  selector: 'digimon-decks-filter',
  template: `
    <div class="my-1 mx-auto flex max-w-6xl flex-row">
      <div class="my-1 flex w-full flex-col px-2">
        <span class="p-input-icon-left w-full">
          <i class="pi pi-search h-3"></i>
          <input
            [formControl]="searchFilter"
            class="w-full text-xs"
            pInputText
            placeholder="Search (Title, Description, User, Card-Ids, Color)"
            type="text"
          />
        </span>
      </div>
      <p-multiSelect
        [formControl]="tagFilter"
        [options]="tags"
        [showToggleAll]="false"
        defaultLabel="Select a Tag"
        display="chip"
        scrollHeight="250px"
        class="my-1 mx-auto w-full max-w-[250px]"
        styleClass="w-full h-[34px] text-sm max-w-[250px]"
      >
      </p-multiSelect>
    </div>
  `,
})
export class DecksFilterComponent {
  @Input() searchFilter: FormControl;
  @Input() tagFilter: FormControl;

  tags = TAGS;
}
