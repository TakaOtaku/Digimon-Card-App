import {Component, Input, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {changeCardSize} from "../../store/digimon.actions";

@Component({
  selector: 'digimon-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @Input() public compact = false;
  @Input() public site: number = 0;

  constructor(private store: Store) {}

  ngOnInit() {
    if(!this.compact) {return}
    this.store.dispatch(changeCardSize({cardSize: 100}))
  }
}
