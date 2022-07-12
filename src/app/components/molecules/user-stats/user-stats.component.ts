import { Component, Input, OnInit } from '@angular/core';
import { ICountCard, IUser } from '../../../../models';

@Component({
  selector: 'digimon-user-stats',
  templateUrl: './user-stats.component.html',
  styleUrls: ['./user-stats.component.css'],
})
export class UserStatsComponent implements OnInit {
  @Input() user: IUser | null;
  @Input() collection: ICountCard[];

  constructor() {}

  ngOnInit(): void {}
}
