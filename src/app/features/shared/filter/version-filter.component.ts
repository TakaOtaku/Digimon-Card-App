import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { VersionButtons } from '../../../../models';
import { changeVersionFilter } from '../../../store/digimon.actions';
import { selectVersionFilter } from '../../../store/digimon.selectors';

@Component({
  selector: 'digimon-version-filter',
  template: `
    <digimon-multi-buttons
      *ngIf="{ value: versionFilter$ | async } as versionFilter"
      (clickEvent)="changeVersion($event, versionFilter.value ?? [])"
      [buttonArray]="versionButtons"
      [value]="versionFilter.value"
      [perRow]="3"
      title="Version"></digimon-multi-buttons>
  `,
})
export class VersionFilterComponent {
  versionFilter$ = this.store.select(selectVersionFilter);

  versionButtons = VersionButtons;

  constructor(private store: Store) {}

  changeVersion(version: string, versionFilter: string[]) {
    let versions = [];
    if (versionFilter && versionFilter.includes(version)) {
      versions = versionFilter.filter((value) => value !== version);
    } else {
      versions = [...new Set(versionFilter), version];
    }

    this.store.dispatch(changeVersionFilter({ versionFilter: versions }));
  }
}
