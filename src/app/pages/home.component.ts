import { Component, OnDestroy, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject, Subscription, takeUntil } from 'rxjs';
import * as uuid from 'uuid';
import { IBlog, IBlogWithText, ADMINS, IUser } from '../../models';
import { AuthService } from '../service/auth.service';
import { DigimonBackendService } from '../service/digimon-backend.service';
import { selectBlogs } from '../store/digimon.selectors';

@Component({
  selector: 'digimon-home',
  template: `
    <div class="h-[calc(100vh-50px)] w-full overflow-y-scroll bg-repeat">
      <div class="mx-auto flex max-w-7xl flex-col">
        <div class="bg mb-5 w-full border-2 border-slate-500 p-1">
          <div class="flex flex-row">
            <h1
              class="mb-2 w-full text-center text-3xl font-extrabold uppercase text-white"
            >
              Digimon Card Game Forum
            </h1>
            <button
              *ngIf="showWrite()"
              class="p-button-outlined p-button-rounded ml-auto mr-2"
              icon="pi pi-plus"
              pButton
              pRipple
              type="button"
              (click)="newEntry()"
            ></button>
          </div>

          <div class="overflow-x-auto">
            <div class="inline-block h-64 min-w-full overflow-auto py-2">
              <table class="min-w-full">
                <thead class="surface-card border-b">
                  <tr>
                    <th scope="col" class="w-7 px-1 py-2"></th>
                    <th
                      scope="col"
                      class="px-6 py-2 text-left text-sm font-medium text-white"
                    >
                      Title
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-2 text-left text-sm font-medium text-white"
                    >
                      Author
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-2 text-left text-sm font-medium text-white"
                    >
                      Date
                    </th>
                    <th
                      *ngIf="showButtons()"
                      scope="col"
                      class="px-6 py-2 text-left text-sm font-medium text-white"
                    ></th>
                  </tr>
                </thead>
                <tbody>
                  <ng-container *ngIf="showWrite()">
                    <tr
                      *ngFor="let blog of blogEntriesHidden"
                      class="border-b transition duration-300 ease-in-out hover:hover:backdrop-brightness-150"
                    >
                      <td class="w-7 whitespace-nowrap px-1 py-2">
                        <img
                          alt="Blog Category"
                          class="m-auto text-white"
                          [src]="getIcon(blog.category)"
                        />
                      </td>
                      <td
                        class="cursor-pointer whitespace-nowrap px-6 py-2 text-sm font-light text-white"
                        (click)="open(blog)"
                      >
                        <h2>{{ blog.title }}</h2>
                      </td>
                      <td
                        class="whitespace-nowrap px-6 py-2 text-sm font-light text-white"
                      >
                        {{ blog.author }}
                      </td>
                      <td
                        class="whitespace-nowrap px-6 py-2 text-sm font-light text-white"
                      >
                        {{ blog.date | date: 'dd.MM.yyyy' }}
                      </td>
                      <td
                        *ngIf="showButtons()"
                        class="whitespace-nowrap px-6 py-2 text-sm font-light text-white"
                      >
                        <button
                          *ngIf="showButtons()"
                          [disabled]="!isAdmin()"
                          class="p-button p-button-rounded ml-auto mr-2"
                          icon="pi pi-times"
                          pButton
                          pRipple
                          type="button"
                          (click)="approve(blog)"
                        ></button>
                        <button
                          *ngIf="isAdmin()"
                          class="p-button p-button-rounded ml-auto mr-2"
                          icon="pi pi-trash"
                          pButton
                          pRipple
                          type="button"
                          (click)="delete(blog, $event)"
                        ></button>
                      </td>
                    </tr>
                  </ng-container>
                  <tr
                    *ngFor="let blog of blogEntries"
                    class="border-b transition duration-300 ease-in-out hover:hover:backdrop-brightness-150"
                  >
                    <td class="w-7 whitespace-nowrap px-1 py-2">
                      <img
                        alt="Blog Category"
                        class="m-auto text-white"
                        [src]="getIcon(blog.category)"
                      />
                    </td>
                    <td
                      class="cursor-pointer whitespace-nowrap px-6 py-2 text-sm font-light text-white"
                      (click)="open(blog)"
                    >
                      {{ blog.title }}
                    </td>
                    <td
                      class="whitespace-nowrap px-6 py-2 text-sm font-light text-white"
                    >
                      {{ blog.author }}
                    </td>
                    <td
                      class="whitespace-nowrap px-6 py-2 text-sm font-light text-white"
                    >
                      {{ blog.date | date: 'dd.MM.yyyy' }}
                    </td>
                    <td
                      *ngIf="showButtons()"
                      class="whitespace-nowrap px-6 py-2 text-sm font-light text-white"
                    >
                      <button
                        *ngIf="showButtons()"
                        [disabled]="!isAdmin()"
                        class="p-button p-button-rounded ml-auto mr-2"
                        icon="pi pi-check"
                        pButton
                        pRipple
                        type="button"
                        (click)="hide(blog)"
                      ></button>
                      <button
                        *ngIf="isAdmin()"
                        class="p-button p-button-rounded ml-auto mr-2"
                        icon="pi pi-trash"
                        pButton
                        pRipple
                        type="button"
                        (click)="delete(blog, $event)"
                      ></button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <digimon-tierlist class="bg mb-5"></digimon-tierlist>

        <digimon-deck-statistics class="bg"></digimon-deck-statistics>
      </div>
      <div class="h-24 w-full lg:hidden"></div>
    </div>
  `,
})
export class HomeComponent implements OnInit, OnDestroy {
  allBlogEntries: IBlog[] = [];
  blogEntries: IBlog[] = [];
  blogEntriesHidden: IBlog[] = [];

  user: IUser | null;

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
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((entries) => {
        this.allBlogEntries = entries;
        this.blogEntriesHidden = entries
          .filter((entry) => !entry.approved)
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );
        this.blogEntries = entries
          .filter((entry) => entry.approved)
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );
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

  getIcon(category: string): string {
    return category === 'Tournament Report'
      ? 'assets/icons/trophy-svgrepo-com.svg'
      : 'assets/icons/exam-svgrepo-com.svg';
  }
}
