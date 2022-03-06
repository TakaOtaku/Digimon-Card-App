import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'digimon-filter-box',
  templateUrl: './filter-box.component.html',
  styleUrls: ['./filter-box.component.scss']
})
export class FilterBoxComponent implements OnInit {
  setList: string[] = ['P', 'BT1', 'BT2', 'BT3', 'BT4', 'BT5', 'BT6', 'BT7', 'EX1', 'ST1', 'ST2', 'ST3', 'ST4', 'ST5', 'ST6', 'ST7', 'ST8'];
  colorList: string[] = ['Red', 'Blue', 'Yellow', 'Green', 'Black', 'Purple', 'White'];
  cardTypeList: string[] = ['Digitama', 'Digimon', 'Tamer', 'Option'];
  typeList: string[] = ['Data', 'Vaccine', 'Virus', 'Free', 'Variable'];
  lvList: number[] = [2, 3, 4, 5, 6, 7];
  rarityList: string[] = ['C', 'UC', 'R', 'SR', 'SEC'];
  versionList: string[] = ['Normal', 'AA', 'Stamped'];

  constructor() { }

  ngOnInit(): void {
  }
}
