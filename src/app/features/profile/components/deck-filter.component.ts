import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { UntypedFormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { TAGS } from '@models';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'digimon-deck-filter',
  template: `
    <div class="mx-auto flex flex-row">
      <p-icon-field class="my-1 mr-1 w-full">
        <p-inputicon styleClass="pi pi-search"></p-inputicon>
        <input
          [formControl]="searchFilter"
          class="w-full"
          pInputText
          placeholder="Search (Title, Description, Card-Ids, Color))"
          type="text" />
      </p-icon-field>
      <p-multiSelect
        [formControl]="tagFilter"
        [options]="tags"
        [showToggleAll]="false"
        placeholder="Select a Tag"
        display="chip"
        scrollHeight="250px"
        class="mx-auto my-1 ml-1 max-w-[250px]"
        styleClass="max-w-[250px]">
      </p-multiSelect>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FormsModule, InputTextModule, ReactiveFormsModule, MultiSelectModule, IconField, InputIcon]
})
export class DeckFilterComponent {
  @Input() searchFilter: UntypedFormControl;
  @Input() tagFilter: UntypedFormControl;

  tags = TAGS;
}
