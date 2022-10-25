import { Component, OnInit } from '@angular/core';
import firebase from 'firebase/compat';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../../service/auth.service';
import { DatabaseService } from '../../../../service/database.service';
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
    private dbService: DatabaseService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.load();
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

    this.messageService.add({
      severity: 'success',
      summary: 'Changelog saved!',
      detail: 'The Changelog was saved successfully!',
    });
  }
}
