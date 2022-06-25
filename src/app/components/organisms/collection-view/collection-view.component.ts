import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'digimon-collection-view',
  templateUrl: './collection-view.component.html',
  styleUrls: ['./collection-view.component.css'],
})
export class CollectionViewComponent {
  @Input() deckView: boolean;
  @Output() onCardClick = new EventEmitter<string>();
}
