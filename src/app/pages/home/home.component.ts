import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataSnapshot } from '@angular/fire/compat/database/interfaces';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ConfirmationService, MessageService } from 'primeng/api';
import { first, Subject, takeUntil } from 'rxjs';
import * as uuid from 'uuid';
import { ADMINS, IUser, RIGHTS } from '../../../models';
import { IBlogWithText } from '../../../models/interfaces/blog-entry.interface';
import { AuthService } from '../../service/auth.service';
import { DatabaseService } from '../../service/database.service';

@Component({
  selector: 'digimon-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, OnDestroy {
  allBlogEntries: IBlogWithText[] = [];
  blogEntries: IBlogWithText[] = [];
  blogEntriesHidden: IBlogWithText[] = [];

  user: IUser | null;
  rights = RIGHTS;

  editView = false;
  currentBlog: IBlogWithText;
  currentTitle = 'Empty Title';
  currentQuill: any[] = [];

  private onDestroy$ = new Subject();
  constructor(
    private authService: AuthService,
    private dbService: DatabaseService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router,
    private store: Store,
    private meta: Meta,
    private title: Title
  ) {}

  ngOnInit() {
    this.makeGoogleFriendly();

    this.user = this.authService.userData;
    this.authService.authChange
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => (this.user = this.authService.userData));

    this.dbService
      .loadBlogEntries()
      .pipe(first())
      .subscribe((r) => {
        const value: DataSnapshot = r;
        if (!value) {
          return;
        }
        const entries: IBlogWithText[] = Object.values(value.val());

        this.allBlogEntries = entries;
        this.blogEntriesHidden = entries.filter((entry) => !entry.approved);
        this.blogEntries = entries.filter((entry) => entry.approved);
      });
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
  }

  private makeGoogleFriendly() {
    this.title.setTitle('Digimon Card Game - Home');

    this.meta.addTags([
      {
        name: 'description',
        content:
          'Tournament Reports, Deck Builder, Collection Tracker, Tier list, Card Statistics and many more things at the Digimon TCG site.',
      },
      { name: 'author', content: 'TakaOtaku' },
      {
        name: 'keywords',
        content:
          'Tournament, Reports, Deck Builder, Collection Tracker, Tier list, Card, Statistics, Digimon, TCG',
      },
    ]);
  }

  newEntry() {
    const newBlog: IBlogWithText = {
      uid: uuid.v4(),
      date: new Date(),
      title: 'Empty Entry',
      text: '<p>Hello World!</p>',
      approved: false,
      author: this.user!.displayName,
      authorId: this.user!.uid,
      category: 'Tournament Report',
    };
    this.blogEntriesHidden.push(newBlog);
    this.dbService.saveBlogEntry(newBlog);
    this.messageService.add({
      severity: 'success',
      summary: 'Blog-Entry created!',
      detail: 'New Blog-Entry was created successfully!',
    });
  }

  open(blog: IBlogWithText) {
    this.router.navigateByUrl('blog/' + blog.uid);
  }

  approve(blog: IBlogWithText) {
    blog.approved = true;
    this.blogEntriesHidden = this.blogEntriesHidden.filter(
      (entry) => entry.uid !== blog.uid
    );
    this.blogEntries = this.blogEntries.filter(
      (entry) => entry.uid !== blog.uid
    );
    this.blogEntries.push(blog);
    this.dbService.saveBlogEntry(blog);
  }

  hide(blog: IBlogWithText) {
    blog.approved = false;
    this.blogEntriesHidden = this.blogEntriesHidden.filter(
      (entry) => entry.uid !== blog.uid
    );
    this.blogEntries = this.blogEntries.filter(
      (entry) => entry.uid !== blog.uid
    );
    this.blogEntriesHidden.push(blog);
    this.dbService.saveBlogEntry(blog);
  }

  edit(blog: IBlogWithText) {
    this.editView = true;
    this.currentQuill = blog.text;
    this.currentTitle = blog.title;
    this.currentBlog = blog;
  }

  delete(blog: IBlogWithText, event: any) {
    this.confirmationService.confirm({
      target: event!.target!,
      message:
        'You are about to permanently delete your this Blog-Entry. Are you sure?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.blogEntriesHidden = this.blogEntriesHidden.filter(
          (entry) => entry.uid !== blog.uid
        );
        this.blogEntries = this.blogEntries.filter(
          (entry) => entry.uid !== blog.uid
        );
        this.dbService.deleteBlogEntry(blog.uid);
        this.messageService.add({
          severity: 'success',
          summary: 'Blog-Entry deleted!',
          detail: 'The Blog-Entry was deleted successfully!',
        });
      },
      reject: () => {},
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

  showWrite(): boolean {
    if (this.isAdmin()) {
      return true;
    }

    return !!ADMINS.find((user) => {
      if (this.user?.uid === user.id) {
        return user.writeBlog;
      }
      return false;
    });
  }

  showButtons(): boolean {
    if (this.isAdmin()) {
      return true;
    }

    const writeRights = !!ADMINS.find((user) => {
      if (this.user?.uid === user.id) {
        return user.writeBlog;
      }
      return false;
    });

    const entryWritten = !!this.allBlogEntries.find(
      (blog) => blog.authorId === this.user?.uid
    );
    return writeRights ? entryWritten : false;
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
}
