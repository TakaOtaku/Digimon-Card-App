import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  inject,
  OnInit,
} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { PaginatorModule } from 'primeng/paginator';
import { RippleModule } from 'primeng/ripple';
import { map, tap } from 'rxjs';
import { IBlog } from '../../../models';
import { DigimonBackendService } from '../../services/digimon-backend.service';
import { WebsiteActions } from '../../store/digimon.actions';
import { selectBlogs } from '../../store/digimon.selectors';
import { PageComponent } from '../shared/page.component';
import { BlogItemComponent } from './components/blog-item.component';

@Component({
  selector: 'digimon-blog-page',
  template: `
    <digimon-page *ngIf="blog$ | async">
      <div
        class="self-start mx-auto p-3 w-[calc(100vw-0.75rem)] md:p-10 md:w-[calc(100vw-2.5rem)] max-w-xl md:max-w-6xl grid grid-cols-4">
        <div class="col-span-4 grid grid-cols-4 justify-center relative mb-3">
          <h1
            class="col-span-4 text-center text-white text-xl text-black-outline font-black">
            Forum
          </h1>
          @if (display) {
            <p-button
              class="hidden sm:block col-span-2 md:col-span-1 mx-auto"
              (click)="submitAPost()"
              >Submit a Post</p-button
            >
          }
        </div>

        <div class="grid col-span-4 md:grid-cols-2 gap-3">
          <digimon-blog-item
            class="w-full"
            *ngFor="let blog of showBlogs"
            [blog]="blog"
            (click)="openBlog(blog)"></digimon-blog-item>

          <p-paginator
            class="md:col-span-2 mx-auto w-full h-8 surface-ground"
            styleClass="surface-ground p-0"
            (onPageChange)="onPageChange($event)"
            [first]="first"
            [rows]="rows"
            [totalRecords]="blogs.length"></p-paginator>
        </div>

        @if (display) {
          <div class="hidden md:flex pl-2 flex-col">
            <h1 class="text-white text-black-outline font-black">Categories</h1>
            <div *ngFor="let category of categories; let last = last">
              <p-divider></p-divider>
              <button class="text-white text-xs p-1">
                {{ category.text }} • ({{ category.count }})
              </button>
            </div>

            <h1 class="mt-3 text-white text-black-outline font-black">
              Categories
            </h1>
            <div *ngFor="let author of authors">
              <p-divider></p-divider>
              <button class="text-white text-xs p-1">
                {{ author.author }} • ({{ author.count }})
              </button>
            </div>
          </div>
        }
      </div>
    </digimon-page>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    ButtonModule,
    RippleModule,
    AsyncPipe,
    BlogItemComponent,
    NgForOf,
    PaginatorModule,
    DividerModule,
    PageComponent,
  ],
  providers: [MessageService],
})
export class CommunityPageComponent implements OnInit {
  categories = [
    {
      text: 'Archtype Review',
      count: 0,
    },
    {
      text: 'Miscellaneous',
      count: 0,
    },
    {
      text: 'News',
      count: 0,
    },
    {
      text: 'Opinion',
      count: 0,
    },
    {
      text: 'Tournament Report',
      count: 0,
    },
    {
      text: 'Video',
      count: 0,
    },
    {
      text: 'Website Update',
      count: 0,
    },
  ];
  authors = [
    {
      author: 'TakaOtaku',
      count: 0,
    },
  ];
  blog$ = this.store.select(selectBlogs).pipe(
    tap((blogs) => {
      //fill Authors and Categories
    }),
    tap(
      (blogs) =>
        (this.showBlogs = blogs.slice(this.first, this.first + this.rows)),
    ),
    tap((blogs) => (this.blogs = blogs)),
  );

  first = 0;
  rows = 6;
  blogs: IBlog[] = [];
  showBlogs: IBlog[] = [];

  router = inject(Router);

  display = false;

  constructor(
    private active: ActivatedRoute,
    private digimonBackendService: DigimonBackendService,
    private messageService: MessageService,
    private store: Store,
    private meta: Meta,
    private metaTitle: Title,
  ) {}

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.checkScreenWidth((event.target as Window).innerWidth);
  }

  ngOnInit(): void {
    this.makeGoogleFriendly();
    this.checkScreenWidth(window.innerWidth);
    this.store.dispatch(WebsiteActions.loadBlogs());
  }

  private makeGoogleFriendly() {
    this.metaTitle.setTitle('Digimon Card Game - Forum');

    this.meta.addTags([
      {
        name: 'description',
        content:
          'Share your thoughts about the Digimon Card Game with the community, write Tournament Reports or Archtype Reviews.',
      },
      { name: 'author', content: 'TakaOtaku' },
      {
        name: 'keywords',
        content: 'forum, decks, tournament',
      },
    ]);
  }

  private checkScreenWidth(innerWidth: number) {
    const md = innerWidth >= 768;
    if (md) {
      this.rows = 6;
    } else {
      this.rows = 3;
    }
    this.showBlogs = this.blogs.slice(this.first, this.first + this.rows);
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.showBlogs = this.blogs.slice(this.first, this.first + this.rows);
  }

  openBlog(blog: IBlog) {
    this.router.navigateByUrl(`/community/${blog.uid}`);
  }

  submitAPost() {
    this.router.navigateByUrl(`/community/new`);
  }
}
