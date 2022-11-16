import { Component, OnDestroy, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

// @ts-ignore
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { MessageService } from 'primeng/api';
import { filter, first, Subject, Subscription, takeUntil } from 'rxjs';
import { Base64Adapter } from 'src/app/functions/base64-adapter';
import { ADMINS, IUser } from '../../models';
import {
  IBlog,
  IBlogWithText,
} from '../../models/interfaces/blog-entry.interface';
import { AuthService } from '../service/auth.service';
import { DigimonBackendService } from '../service/digimon-backend.service';

@Component({
  selector: 'digimon-blog',
  template: `
    <div *ngIf="!edit" class="w-full">
      <div class="mx-auto h-[calc(100vh-50px)] max-w-7xl overflow-y-scroll">
        <div class="relative">
          <h1
            class="mb-2 w-full text-center text-3xl font-extrabold text-white"
          >
            {{ title }}
          </h1>
          <button
            class="p-button-outlined p-button-rounded absolute left-[5px] top-[20px]"
            icon="pi pi-arrow-left"
            pButton
            pRipple
            type="button"
            (click)="router.navigateByUrl('')"
          ></button>
          <button
            *ngIf="showEdit(blog)"
            class="p-button-outlined p-button-rounded absolute right-[5px] top-[20px]"
            icon="pi pi-pencil"
            pButton
            pRipple
            type="button"
            (click)="edit = true"
          ></button>
        </div>
        <div class="flex flex-row">
          <span class="mb-2 w-full text-center font-bold text-white"
            >{{ author }} / {{ date | date: 'dd.MM.yyyy' }}</span
          >
        </div>

        <ckeditor
          [editor]="Editor"
          class="list-disc text-white"
          [(ngModel)]="content"
          [disabled]="true"
        ></ckeditor>

        <div class="h-24 w-full lg:hidden"></div>
      </div>
    </div>

    <div
      *ngIf="edit"
      class="mx-auto h-[calc(100vh-50px)] max-w-7xl overflow-y-scroll"
    >
      <div class="t-5 flex flex-row">
        <button
          class="p-button-outlined p-button-rounded mr-2"
          icon="pi pi-arrow-left"
          pButton
          pRipple
          type="button"
          (click)="router.navigateByUrl('')"
        ></button>
        <span class="w-full">
          <input
            [(ngModel)]="title"
            placeholder="Title:"
            class="mb-3 h-8 w-full text-sm"
            pInputText
            type="text"
          />
        </span>
        <button
          *ngIf="showEdit(blog)"
          class="p-button-outlined p-button-rounded ml-2"
          icon="pi pi-pencil"
          pButton
          pRipple
          type="button"
          (click)="edit = false"
        ></button>
      </div>
      <div class="mb-3">
        <div class="flex inline-flex w-full justify-center">
          <button
            (click)="category = 'Tournament Report'"
            [ngClass]="{
              'primary-background': category === 'Tournament Report'
            }"
            class="min-w-auto mt-2 h-8 w-36 rounded-l-sm border border-slate-100 p-2 text-xs font-semibold text-white"
          >
            Tournament Report
          </button>
          <button
            (click)="category = 'Deck-Review'"
            [ngClass]="{
              'primary-background': category === 'Deck-Review'
            }"
            class="min-w-auto mt-2 h-8 w-36 border border-slate-100 p-2 text-xs font-semibold text-white"
          >
            Deck-Review
          </button>
        </div>
      </div>

      <ckeditor
        [editor]="Editor"
        class="list-disc text-white"
        [(ngModel)]="content"
        (ready)="onReady($event)"
      ></ckeditor>

      <button
        class="p-button mt-3"
        icon="pi pi-save"
        pButton
        pRipple
        type="button"
        label="Save"
        (click)="save()"
      ></button>
    </div>
  `,
})
export class BlogComponent implements OnInit, OnDestroy {
  public Editor = DecoupledEditor;

  blog: IBlogWithText;

  title = '';
  content: any;
  author = '';
  date: Date;
  category = '';
  edit = false;

  user: IUser | null;

  private onDestroy$ = new Subject();
  constructor(
    public router: Router,
    private active: ActivatedRoute,
    private digimonBackendService: DigimonBackendService,
    private authService: AuthService,
    private messageService: MessageService,
    private meta: Meta,
    private metaTitle: Title
  ) {}

  ngOnInit(): void {
    this.makeGoogleFriendly();

    this.checkURL();

    this.user = this.authService.userData;
    this.authService.authChange
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => (this.user = this.authService.userData));
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.unsubscribe();
  }

  private makeGoogleFriendly() {
    this.metaTitle.setTitle('Digimon Card Game - ' + this.title);

    this.meta.addTags([
      {
        name: 'description',
        content: this.title,
      },
      { name: 'author', content: 'TakaOtaku' },
      {
        name: 'keywords',
        content: 'Forum, decks, tournament',
      },
    ]);
  }

  checkURL() {
    this.active.params
      .pipe(
        first(),
        filter((params) => !!params['id'])
      )
      .subscribe((params) => {
        this.digimonBackendService
          .getBlogEntryWithText(params['id'])
          .subscribe((blog) => {
            try {
              this.blog = blog;
              this.title = blog.title;
              this.content = blog.text;
              this.author = blog.author;
              this.date = blog.date;
              this.category = blog.category;
            } catch (e) {
              // eslint-disable-next-line no-console
              console.log(e);
            }
          });
      });
  }

  isAdmin(): boolean {
    return !!ADMINS.find((user) => {
      if (this.user?.uid === user.id) {
        return user.admin;
      }
      return false;
    });
  }

  showEdit(blog: IBlogWithText): boolean {
    if (this.isAdmin()) {
      return true;
    }

    const writeRights = !!ADMINS.find((user) => {
      if (this.user?.uid === user.id) {
        return user.writeBlog;
      }
      return false;
    });

    return writeRights ? blog.authorId === this.user?.uid : false;
  }

  save() {
    const newBlog = {
      ...this.blog,
      text: this.content,
      title: this.title,
      category: this.category,
      date: new Date(),
    } as IBlogWithText;

    const newBlogWithoutText = {
      uid: this.blog.uid,
      date: new Date(),
      title: this.title,
      approved: this.blog.approved,
      author: this.blog.author,
      authorId: this.blog.authorId,
      category: this.category,
    } as IBlog;

    const sub: Subscription = this.digimonBackendService
      .updateBlogWithText(newBlog)
      .subscribe((value) => sub.unsubscribe());
    const sub2: Subscription = this.digimonBackendService
      .updateBlog(newBlogWithoutText)
      .subscribe((value) => sub2.unsubscribe());
    this.messageService.add({
      severity: 'success',
      summary: 'Blog-Entry saved!',
      detail: 'The Blog-Entry was saved successfully!',
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
