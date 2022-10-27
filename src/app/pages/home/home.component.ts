import { Component, OnDestroy, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ConfirmationService, MessageService } from 'primeng/api';
import { first, Subject, Subscription, takeUntil } from 'rxjs';
import * as uuid from 'uuid';
import { ADMINS, IUser, RIGHTS } from '../../../models';
import {
  IBlog,
  IBlogWithText,
} from '../../../models/interfaces/blog-entry.interface';
import { AuthService } from '../../service/auth.service';
import { DigimonBackendService } from '../../service/digimon-backend.service';
import { selectBlogs } from '../../store/digimon.selectors';

@Component({
  selector: 'digimon-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, OnDestroy {
  allBlogEntries: IBlog[] = [];
  blogEntries: IBlog[] = [];
  blogEntriesHidden: IBlog[] = [];

  user: IUser | null;
  rights = RIGHTS;

  editView = false;
  currentBlog: IBlog;
  currentTitle = 'Empty Title';
  currentQuill: any[] = [];

  private onDestroy$ = new Subject();
  constructor(
    private authService: AuthService,
    private digimonBackendService: DigimonBackendService,
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

    this.store
      .select(selectBlogs)
      .pipe(first())
      .subscribe((entries) => {
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
    const newBlog: IBlog = {
      uid: uuid.v4(),
      date: new Date(),
      title: 'Empty Entry',
      approved: false,
      author: this.user!.displayName,
      authorId: this.user!.uid,
      category: 'Tournament Report',
    };
    const newBlogWithText: IBlogWithText = {
      ...newBlog,
      text: '<p>Hello World!</p>',
    };

    this.blogEntriesHidden.push(newBlog);
    const sub: Subscription = this.digimonBackendService
      .createBlog(newBlog)
      .subscribe((value) => sub.unsubscribe());
    const sub2: Subscription = this.digimonBackendService
      .createBlogWithText(newBlogWithText)
      .subscribe((value) => sub2.unsubscribe());
    this.messageService.add({
      severity: 'success',
      summary: 'Blog-Entry created!',
      detail: 'New Blog-Entry was created successfully!',
    });
  }

  open(blog: IBlog) {
    this.router.navigateByUrl('blog/' + blog.uid);
  }

  approve(blog: IBlog) {
    blog.approved = true;
    this.blogEntriesHidden = this.blogEntriesHidden.filter(
      (entry) => entry.uid !== blog.uid
    );
    this.blogEntries = this.blogEntries.filter(
      (entry) => entry.uid !== blog.uid
    );
    this.blogEntries.push(blog);
    const sub: Subscription = this.digimonBackendService
      .updateBlog(blog)
      .subscribe((value) => sub.unsubscribe());
  }

  hide(blog: IBlog) {
    blog.approved = false;
    this.blogEntriesHidden = this.blogEntriesHidden.filter(
      (entry) => entry.uid !== blog.uid
    );
    this.blogEntries = this.blogEntries.filter(
      (entry) => entry.uid !== blog.uid
    );
    this.blogEntriesHidden.push(blog);
    const sub: Subscription = this.digimonBackendService
      .updateBlog(blog)
      .subscribe((value) => sub.unsubscribe());
  }

  delete(blog: IBlog, event: any) {
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

        const sub: Subscription = this.digimonBackendService
          .deleteBlogEntry(blog.uid)
          .subscribe((value) => sub.unsubscribe());
        const sub2: Subscription = this.digimonBackendService
          .deleteBlogEntryWithText(blog.uid)
          .subscribe((value) => sub2.unsubscribe());

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

  showEdit(blog: IBlog): boolean {
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
