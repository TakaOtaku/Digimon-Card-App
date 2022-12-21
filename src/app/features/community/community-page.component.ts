import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ConfirmationService, MessageService } from 'primeng/api';
import { first, map, Observable, Subject, takeUntil } from 'rxjs';
import * as uuid from 'uuid';
import { ADMINS, IBlog, IBlogWithText, IUser } from '../../../models';
import { AuthService } from '../../service/auth.service';
import { DigimonBackendService } from '../../service/digimon-backend.service';
import { setBlogs } from '../../store/digimon.actions';
import { selectBlogs } from '../../store/digimon.selectors';

interface IBlogs {
  allBlogs: IBlog[];
  shownBlogs: IBlog[];
  hiddenBlogs: IBlog[];
}

@Component({
  selector: 'digimon-community-page',
  template: `
    <div
      class="min-h-[calc(100vh-50px)] w-full bg-gradient-to-b from-[#17212f] to-[#08528d]"
    >
      <div
        *ngIf="blogs$ | async as blogs"
        class="surface-ground mx-auto w-full max-w-7xl border border-slate-200"
      >
        <div class="flex flex-row">
          <h1
            class="mb-2 w-full text-center text-3xl font-extrabold uppercase text-[#e2e4e6]"
          >
            Tournament and Deck Reports
          </h1>
          <button
            *ngIf="showWrite()"
            class="p-button-outlined p-button-rounded mt-2 ml-auto mr-2"
            icon="pi pi-plus"
            pButton
            pRipple
            type="button"
            (click)="newEntry(blogs)"
          ></button>
        </div>

        <div class="inline-block h-full min-w-full overflow-auto py-2">
          <table class="min-w-full">
            <thead class="surface-card border-b">
              <tr>
                <th scope="col" class="w-7 px-1 py-2"></th>
                <th
                  scope="col"
                  class="px-6 py-2 text-left text-sm font-medium text-[#e2e4e6]"
                >
                  Title
                </th>
                <th
                  scope="col"
                  class="px-6 py-2 text-left text-sm font-medium text-[#e2e4e6]"
                >
                  Author
                </th>
                <th
                  scope="col"
                  class="px-6 py-2 text-left text-sm font-medium text-[#e2e4e6]"
                >
                  Date
                </th>
                <th
                  scope="col"
                  class="px-6 py-2 text-left text-sm font-medium text-[#e2e4e6]"
                ></th>
              </tr>
            </thead>
            <tbody>
              <ng-container>
                <tr
                  *ngFor="let blog of blogs.hiddenBlogs"
                  class="border-b transition duration-300 ease-in-out hover:hover:backdrop-brightness-150"
                >
                  <td class="w-7 whitespace-nowrap px-1 py-2">
                    <img
                      alt="Blog Category"
                      class="m-auto text-[#e2e4e6]"
                      [src]="getIcon(blog.category)"
                    />
                  </td>
                  <td
                    class="cursor-pointer whitespace-nowrap px-6 py-2 text-sm font-light text-[#e2e4e6]"
                    (click)="open(blog)"
                  >
                    <h2>{{ blog.title }}</h2>
                  </td>
                  <td
                    class="whitespace-nowrap px-6 py-2 text-sm font-light text-[#e2e4e6]"
                  >
                    {{ blog.author }}
                  </td>
                  <td
                    class="whitespace-nowrap px-6 py-2 text-sm font-light text-[#e2e4e6]"
                  >
                    {{ blog.date | date: 'dd.MM.yyyy' }}
                  </td>
                  <td
                    class="whitespace-nowrap px-6 py-2 text-sm font-light text-[#e2e4e6]"
                  >
                    <button
                      [disabled]="!isAdmin()"
                      class="p-button p-button-rounded ml-auto mr-2"
                      icon="pi pi-times"
                      pButton
                      pRipple
                      type="button"
                      (click)="approve(blog, blogs)"
                    ></button>
                    <button
                      class="p-button p-button-rounded ml-auto mr-2"
                      icon="pi pi-trash"
                      pButton
                      pRipple
                      type="button"
                      (click)="delete(blog, blogs, $event)"
                    ></button>
                  </td>
                </tr>
              </ng-container>
              <tr
                *ngFor="let blog of blogs.shownBlogs"
                class="border-b transition duration-300 ease-in-out hover:hover:backdrop-brightness-150"
              >
                <td class="w-7 whitespace-nowrap px-1 py-2">
                  <img
                    alt="Blog Category"
                    class="m-auto text-[#e2e4e6]"
                    [src]="getIcon(blog.category)"
                  />
                </td>
                <td
                  class="cursor-pointer whitespace-nowrap px-6 py-2 text-sm font-light text-[#e2e4e6]"
                  (click)="open(blog)"
                >
                  {{ blog.title }}
                </td>
                <td
                  class="whitespace-nowrap px-6 py-2 text-sm font-light text-[#e2e4e6]"
                >
                  {{ blog.author }}
                </td>
                <td
                  class="whitespace-nowrap px-6 py-2 text-sm font-light text-[#e2e4e6]"
                >
                  {{ blog.date | date: 'dd.MM.yyyy' }}
                </td>
                <td
                  *ngIf="isAdmin()"
                  class="whitespace-nowrap px-6 py-2 text-sm font-light text-[#e2e4e6]"
                >
                  <button
                    class="p-button p-button-rounded ml-auto mr-2"
                    icon="pi pi-check"
                    pButton
                    pRipple
                    type="button"
                    (click)="hide(blog, blogs)"
                  ></button>
                  <button
                    class="p-button p-button-rounded ml-auto mr-2"
                    icon="pi pi-trash"
                    pButton
                    pRipple
                    type="button"
                    (click)="delete(blog, blogs, $event)"
                  ></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div
        class="surface-ground mx-auto mt-5 w-full max-w-7xl border border-slate-200"
      >
        <div class="flex flex-row">
          <h1
            class="mb-2 w-full text-center text-3xl font-extrabold uppercase text-[#e2e4e6]"
          >
            Partners
          </h1>
        </div>

        <div class="mx-auto">
          <a
            class="mx-auto flex flex-col"
            href="https://discord.gg/digimon-tcg-dach-759562127513223168"
            target="_blank"
          >
            <img
              class="mx-auto max-h-24"
              src="assets/images/partners/dach.png"
              alt="Digimon DACH Discord"
            />
            <div
              class="text-shadow text-center text-xl font-black text-[#e2e4e6]"
            >
              Digimon TCG DACH
            </div>
          </a>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommunityPageComponent implements OnInit, OnDestroy {
  blogs$: Observable<IBlogs> = this.store.select(selectBlogs).pipe(
    map((entries) => {
      const allBlogs = entries;
      const shownBlogs = entries
        .filter((entry) => entry.approved)
        .sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
      const hiddenBlogs = entries
        .filter((entry) => !entry.approved)
        .filter((entry) =>
          this.isAdmin()
            ? true
            : entry.authorid === this.authService.userData?.uid
        )
        .sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
      return { allBlogs, shownBlogs, hiddenBlogs } as IBlogs;
    })
  );

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
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.unsubscribe();
  }

  private makeGoogleFriendly() {
    this.title.setTitle('Digimon Card Game - Community');

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

  newEntry(currentBlogs: IBlogs) {
    const newBlog: IBlog = {
      uid: uuid.v4(),
      date: new Date(),
      title: 'Empty Entry',
      approved: false,
      author: this.user!.displayName,
      authorid: this.user!.uid,
      category: 'Tournament Report',
    };
    const newBlogWithText: IBlogWithText = {
      ...newBlog,
      text: '<p>Hello World!</p>',
    };

    this.store.dispatch(
      setBlogs({ blogs: [...currentBlogs.allBlogs, newBlog] })
    );
    this.digimonBackendService.createBlog(newBlog).pipe(first()).subscribe();
    this.digimonBackendService
      .createBlogWithText(newBlogWithText)
      .pipe(first())
      .subscribe();
    this.messageService.add({
      severity: 'success',
      summary: 'Blog-Entry created!',
      detail: 'New Blog-Entry was created successfully!',
    });
  }

  approve(blog: IBlog, blogs: IBlogs) {
    blog.approved = true;

    const newBlogs = blogs.allBlogs.map((entry) => {
      if (blog.uid === entry.uid) {
        return blog;
      }
      return entry;
    });
    this.store.dispatch(setBlogs({ blogs: newBlogs }));
    this.digimonBackendService.updateBlog(blog).pipe(first()).subscribe();
  }

  open(blog: IBlog) {
    this.router.navigateByUrl('blog/' + blog.uid);
  }

  hide(blog: IBlog, blogs: IBlogs) {
    blog.approved = false;

    const newBlogs = blogs.allBlogs.map((entry) => {
      if (blog.uid === entry.uid) {
        return blog;
      }
      return entry;
    });
    this.store.dispatch(setBlogs({ blogs: newBlogs }));
    this.digimonBackendService.updateBlog(blog).pipe(first()).subscribe();
  }

  delete(blog: IBlog, blogs: IBlogs, event: any) {
    this.confirmationService.confirm({
      target: event!.target!,
      message:
        'You are about to permanently delete your this Blog-Entry. Are you sure?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const newBlogs = blogs.allBlogs.filter(
          (entry) => entry.uid !== blog.uid
        );
        this.store.dispatch(setBlogs({ blogs: newBlogs }));
        this.digimonBackendService
          .deleteBlogEntry(blog.uid)
          .pipe(first())
          .subscribe();
        this.digimonBackendService
          .deleteBlogEntryWithText(blog.uid)
          .pipe(first())
          .subscribe();

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

  showButtons(allBlogEntries: IBlog[]): boolean {
    if (this.isAdmin()) {
      return true;
    }

    const writeRights = !!ADMINS.find((user) => {
      if (this.user?.uid === user.id) {
        return user.writeBlog;
      }
      return false;
    });

    const entryWritten = !!allBlogEntries.find(
      (blog) => blog.authorid === this.user?.uid
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

    return writeRights ? blog.authorid === this.user?.uid : false;
  }

  getIcon(category: string): string {
    return category === 'Tournament Report'
      ? 'assets/icons/trophy-svgrepo-com.svg'
      : 'assets/icons/exam-svgrepo-com.svg';
  }
}
