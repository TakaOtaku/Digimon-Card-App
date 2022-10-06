import { Component, OnInit } from "@angular/core";
import firebase from "firebase/compat";
import { EditorChangeContent, EditorChangeSelection } from "ngx-quill";
import Quill from "quill";
import { AuthService } from "../../../../service/auth.service";
import { DatabaseService } from "../../../../service/database.service";
import DataSnapshot = firebase.database.DataSnapshot;

@Component({
  selector: 'digimon-changelog-dialog',
  templateUrl: './changelog-dialog.component.html',
})
export class ChangelogDialogComponent implements OnInit {
  content: Object = [
    { insert: 'Hello ' },
    { insert: 'World!', attributes: { bold: true } },
    { insert: '\n' },
  ];

  blurred = false;
  focused = false;

  constructor(
    public authService: AuthService,
    private dbService: DatabaseService
  ) {}

  ngOnInit() {
    this.load();
  }

  created(event: Quill) {
    // tslint:disable-next-line:no-console
    console.log('editor-created', event);
  }

  changedEditor(event: EditorChangeContent | EditorChangeSelection) {
    // tslint:disable-next-line:no-console
    console.log('editor-change', event);
  }

  focus($event: any) {
    // tslint:disable-next-line:no-console
    console.log('focus', $event);
    this.focused = true;
    this.blurred = false;
  }

  blur($event: any) {
    // tslint:disable-next-line:no-console
    console.log('blur', $event);
    this.focused = false;
    this.blurred = true;
    debugger;
  }

  load() {
    this.dbService.loadChangelog().then((r) => {
      const value: DataSnapshot = r;
      if (!value) {
        return;
      }
      this.content = value.val();
    });
  }

  save() {
    this.dbService.saveChangelog(this.content);
  }
}
