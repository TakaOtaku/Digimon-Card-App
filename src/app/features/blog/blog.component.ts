import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import { MessageService } from 'primeng/api';
import {
  BehaviorSubject,
  Observable,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs';
import { IBlog, IBlogWithText } from '../../../models';
import { DigimonBackendService } from '../../service/digimon-backend.service';

@Component({
  selector: 'digimon-blog',
  template: `
    <div
      *ngIf="blog$ | async as blog"
      class="w-full overflow-y-scroll bg-gradient-to-b from-[#17212f] to-[#08528d]"
    >
      <div class="mx-auto h-[calc(100vh-50px)] max-w-7xl">
        <digimon-header [edit$]="edit" [form]="form"></digimon-header>

        <div
          *ngIf="(edit | async) === false; else editor"
          class="list-disc text-[#e2e4e6]"
          [innerHTML]="form.get('content')"
        ></div>
        <ng-template #editor>
          <digimon-ckeditor [content]="form.get('content')"></digimon-ckeditor>
        </ng-template>

        <button
          *ngIf="edit | async"
          class="p-button mt-3"
          icon="pi pi-save"
          pButton
          pRipple
          type="button"
          label="Save"
          (click)="save(blog)"
        ></button>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogComponent implements OnInit {
  blog$: Observable<IBlogWithText>;
  edit = new BehaviorSubject(false);

  form = new FormGroup({
    title: new FormControl(''),
    content: new FormControl(),
    author: new FormControl(''),
    date: new FormControl(new Date()),
    category: new FormControl(''),
  });

  constructor(
    private active: ActivatedRoute,
    private digimonBackendService: DigimonBackendService,
    private messageService: MessageService,
    private meta: Meta,
    private metaTitle: Title
  ) {}

  ngOnInit(): void {
    this.makeGoogleFriendly();
    this.checkURL();
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
      authorId: blog.authorId,
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
}
