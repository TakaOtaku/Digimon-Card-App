import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';

import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { first, Observable, switchMap, tap, withLatestFrom } from 'rxjs';
import { WebsiteActions } from 'src/app/store/digimon.actions';
import { IBlog, IBlogWithText } from '../../../models';
import { DigimonBackendService } from '../../services/digimon-backend.service';
import { CKEditorComponent } from './components/ckeditor.component';
import { HeaderComponent } from './components/header.component';

@Component({
  selector: 'digimon-blog-page',
  template: `
    <div
      *ngIf="blog$ | async as blog"
      class="w-full bg-gradient-to-b from-[#17212f] to-[#08528d] pt-5">
      <div class="mx-auto max-w-7xl">
        <digimon-header
          [edit]="edit"
          [form]="form"
          (editChanged)="edit = $event"
          [authorid]="blog.authorid"></digimon-header>

        <digimon-ckeditor [edit]="edit" [content]="form"></digimon-ckeditor>

        <button
          *ngIf="edit"
          class="p-button mt-3"
          icon="pi pi-save"
          pButton
          pRipple
          type="button"
          label="Save"
          (click)="save(blog)"></button>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    HeaderComponent,
    CKEditorComponent,
    ButtonModule,
    RippleModule,
    AsyncPipe,
  ],
  providers: [MessageService],
})
export class BlogPageComponent implements OnInit {
  blog$: Observable<IBlogWithText>;
  edit = false;

  form = new UntypedFormGroup({
    title: new UntypedFormControl(''),
    content: new UntypedFormControl(),
    author: new UntypedFormControl(''),
    date: new UntypedFormControl(new Date()),
    category: new UntypedFormControl(''),
  });

  constructor(
    private active: ActivatedRoute,
    private digimonBackendService: DigimonBackendService,
    private messageService: MessageService,
    private store: Store,
    private meta: Meta,
    private metaTitle: Title
  ) {}

  ngOnInit(): void {
    this.makeGoogleFriendly();
    this.checkURL();

    this.digimonBackendService
      .getBlogEntries()
      .pipe(first())
      .subscribe((blogs) => {
        this.store.dispatch(WebsiteActions.setBlogs({ blogs }));
      });
  }

  checkURL() {
    this.blog$ = this.active.params.pipe(
      switchMap((params) =>
        this.digimonBackendService.getBlogEntryWithText(params['id'])
      ),
      tap((blog) => {
        this.form.setValue({
          title: blog.title,
          content: blog.text,
          author: blog.author,
          date: blog.date,
          category: blog.category,
        });
      })
    );
  }

  save(blog: IBlogWithText) {
    const formValue = this.form.value;
    const newBlog = {
      ...blog,
      text: formValue.content,
      title: formValue.title,
      category: formValue.category,
      date: new Date(),
    } as IBlogWithText;

    const newBlogWithoutText = {
      uid: blog.uid,
      date: new Date(),
      title: formValue.title,
      approved: blog.approved,
      author: blog.author,
      authorid: blog.authorid,
      category: formValue.category,
    } as IBlog;

    this.digimonBackendService
      .updateBlogWithText(newBlog)
      .pipe(
        withLatestFrom(
          this.digimonBackendService.updateBlog(newBlogWithoutText)
        )
      )
      .subscribe(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Blog-Entry saved!',
          detail: 'The Blog-Entry was saved successfully!',
        });
      });
  }

  private makeGoogleFriendly() {
    this.metaTitle.setTitle(
      'Digimon Card Game - ' + this.form.get('title')?.value
    );

    this.meta.addTags([
      {
        name: 'description',
        content: this.form.get('title')?.value,
      },
      { name: 'author', content: 'TakaOtaku' },
      {
        name: 'keywords',
        content: 'Forum, decks, tournament',
      },
    ]);
  }
}
