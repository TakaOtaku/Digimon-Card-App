import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

// @ts-ignore
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { Base64Adapter } from 'src/app/functions/base64-adapter';

@Component({
  selector: 'digimon-ckeditor',
  template: `
    <div [formGroup]="content">
      <ckeditor
        *ngIf="!edit"
        [editor]="Editor"
        class="list-disc text-[#e2e4e6]"
        formControlName="content"
        [disabled]="true"></ckeditor>

      <ckeditor
        *ngIf="edit"
        [editor]="Editor"
        class="list-disc text-[#e2e4e6]"
        formControlName="content"
        (ready)="onReady($event)"></ckeditor>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CKEditorComponent {
  @Input() edit = false;
  @Input() content: any;
  public Editor = DecoupledEditor;

  onReady(editor: any) {
    editor.ui
      .getEditableElement()
      .parentElement.insertBefore(editor.ui.view.toolbar.element, editor.ui.getEditableElement());

    editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
      return new Base64Adapter(loader);
    };
  }
}
