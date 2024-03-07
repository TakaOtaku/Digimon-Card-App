import { AsyncPipe, NgIf } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { VersionButtons } from '../../../../models';
import { FilterStore } from '../../../store/filter.store';
import { MultiButtonsComponent } from '../multi-buttons.component';

@Component({
  selector: 'digimon-version-filter',
  template: `
    <digimon-multi-buttons
      (clickEvent)="changeVersion($event, versionFilter)"
      [buttonArray]="versionButtons"
      [value]="versionFilter"
      [perRow]="3"
      title="Version"></digimon-multi-buttons>
  `,
  standalone: true,
  imports: [NgIf, MultiButtonsComponent, AsyncPipe],
})
export class VersionFilterComponent {
  filterStore = inject(FilterStore);
  versionFilter: string[] = this.filterStore.versionFilter();

  versionButtons = VersionButtons;

  filterChange = effect(() => {
    this.versionFilter = this.filterStore.versionFilter();
  });

  changeVersion(version: string, versionFilter: string[]) {
    let versions = [];
    if (versionFilter && versionFilter.includes(version)) {
      versions = versionFilter.filter((value) => value !== version);
    } else {
      versions = [...new Set(versionFilter), version];
    }

    this.filterStore.updateVersionFilter(versions);
  }
}
