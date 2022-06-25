import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { ColorList, tagsList } from '../../../../models';
import { ITag } from '../../../../models/interfaces/tag.interface';
import { selectDeck } from '../../../store/digimon.selectors';

@Component({
  selector: 'digimon-deck-metadata',
  templateUrl: './deck-metadata.component.html',
})
export class DeckMetadataComponent {
  @Input() title = '';
  @Input() description = '';
  @Input() tags: ITag[];
  @Input() selectedColor: any;

  tagsList: ITag[] = tagsList;
  colors = ColorList;

  changeColor(color: any) {
    this.selectedColor = color;
  }
}
