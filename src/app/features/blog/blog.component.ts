import { Component, OnDestroy, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

// @ts-ignore
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { MessageService } from 'primeng/api';
import { first, Subject, switchMap, takeUntil, withLatestFrom } from 'rxjs';
import { merge } from 'rxjs/operators';
import { Base64Adapter } from 'src/app/functions/base64-adapter';
import { ADMINS, IBlog, IBlogWithText, IUser } from '../../../models';
import { AuthService } from '../../service/auth.service';
import { DigimonBackendService } from '../../service/digimon-backend.service';

@Component({
  selector: 'digimon-blog',
  template: `
    <div class="w-full bg-gradient-to-b from-[#17212f] to-[#08528d]">
      <div
        *ngIf="!edit"
        class="mx-auto h-[calc(100vh-50px)] max-w-7xl overflow-y-scroll"
      >
        <div class="relative">
          <h1
            class="mb-2 w-full text-center text-3xl font-extrabold text-[#e2e4e6]"
          >
            {{ title }}
          </h1>
          <button
            class="p-button-outlined p-button-rounded absolute left-[5px] top-[20px]"
            icon="pi pi-arrow-left"
            pButton
            pRipple
            type="button"
            (click)="router.navigateByUrl('/community')"
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
          <span class="mb-2 w-full text-center font-bold text-[#e2e4e6]"
            >{{ author }} / {{ date | date: 'dd.MM.yyyy' }}</span
          >
        </div>

        <ckeditor
          [editor]="Editor"
          class="list-disc text-[#e2e4e6]"
          [(ngModel)]="content"
          [disabled]="true"
        ></ckeditor>

        <div class="h-24 w-full lg:hidden"></div>
      </div>

      <div
        *ngIf="edit"
        class="mx-auto h-[calc(100vh-50px)] max-w-7xl overflow-y-scroll bg-gradient-to-b from-[#17212f] to-[#08528d]"
      >
        <div class="t-5 flex flex-row">
          <button
            class="p-button-outlined p-button-rounded mr-2"
            icon="pi pi-arrow-left"
            pButton
            pRipple
            type="button"
            (click)="router.navigateByUrl('/community')"
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
              class="min-w-auto mt-2 h-8 w-36 rounded-l-sm border border-slate-100 p-2 text-xs font-semibold text-[#e2e4e6]"
            >
              Tournament Report
            </button>
            <button
              (click)="category = 'Deck-Review'"
              [ngClass]="{
                'primary-background': category === 'Deck-Review'
              }"
              class="min-w-auto mt-2 h-8 w-36 border border-slate-100 p-2 text-xs font-semibold text-[#e2e4e6]"
            >
              Deck-Review
            </button>
          </div>
        </div>

        <ckeditor
          [editor]="Editor"
          class="list-disc text-[#e2e4e6]"
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

  checkURL() {
    this.active.params
      .pipe(
        switchMap((params) =>
          this.digimonBackendService.getBlogEntryWithText(params['id'])
        )
      )
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

    this.digimonBackendService
      .updateBlogWithText(newBlog)
      .pipe(
        withLatestFrom(
          this.digimonBackendService.updateBlog(newBlogWithoutText)
        )
      )
      .subscribe((value) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Blog-Entry saved!',
          detail: 'The Blog-Entry was saved successfully!',
        });
      });
  }

  onReady(editor: any) {
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
}
