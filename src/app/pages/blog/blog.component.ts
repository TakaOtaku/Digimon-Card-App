import { Component, OnDestroy, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

// @ts-ignore
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { MessageService } from 'primeng/api';
import { filter, first, Subject, Subscription, takeUntil } from 'rxjs';
import { Base64Adapter } from 'src/app/functions/base64-adapter';
import { ADMINS, IUser } from '../../../models';
import { IBlogWithText } from '../../../models/interfaces/blog-entry.interface';
import { AuthService } from '../../service/auth.service';
import { DigimonBackendService } from '../../service/digimon-backend.service';

@Component({
  selector: 'digimon-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
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
      date: new Date(),
    } as IBlogWithText;

    const sub: Subscription = this.digimonBackendService
      .updateBlogWithText(newBlog)
      .subscribe((value) => sub.unsubscribe());
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
