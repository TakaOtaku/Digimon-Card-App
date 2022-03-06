import {Component} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {Store} from "@ngrx/store";
import {SaveDialogComponent} from "../save-dialog/save-dialog.component";

@Component({
  selector: 'digimon-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent {
  constructor(
    public store: Store,
    public dialog: MatDialog
  ) {}



  public save(): void {
    this.dialog.open(SaveDialogComponent, {
      height: '40%',
      width: '60%'
    });
  }
}
