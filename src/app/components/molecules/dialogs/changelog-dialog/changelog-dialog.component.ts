import { Component, EventEmitter, Input, OnInit } from '@angular/core';

// @ts-ignore
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import firebase from 'firebase/compat';
import { MessageService } from 'primeng/api';
import { first } from 'rxjs';
import { Base64Adapter } from '../../../../functions/base64-adapter';
import { AuthService } from '../../../../service/auth.service';
import { DatabaseService } from '../../../../service/database.service';
import DataSnapshot = firebase.database.DataSnapshot;

@Component({
  selector: 'digimon-changelog-dialog',
  templateUrl: './changelog-dialog.component.html',
})
export class ChangelogDialogComponent implements OnInit {
  @Input() loadChangelog: EventEmitter<boolean>;
  public Editor = DecoupledEditor;

  content: any;

  constructor(
    public authService: AuthService,
    private dbService: DatabaseService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadChangelog.pipe(first()).subscribe(() => {
      this.load();
    });
  }

  load() {
    this.dbService.loadChangelog().then((r) => {
      const value: DataSnapshot = r;
      if (!value) {
        return;
      }
      this.content = value.val().text;
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

  public onReady(editor: any) {
    editor.ui
      .getEditableElement()
      .parentElement.insertBefore(
        editor.ui.view.toolbar.element,
        editor.ui.getEditableElement()
      );

    editor.plugins.get('FileRepository').createUploadAdapter = (
      loader: any
    ) => {
      return new Base64Adapter(loader);
    };
  }
}
