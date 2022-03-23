import {Component, Input} from '@angular/core';

@Component({
  selector: 'digimon-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  @Input() public compact = false;
  @Input() public site: number = 0;
}
