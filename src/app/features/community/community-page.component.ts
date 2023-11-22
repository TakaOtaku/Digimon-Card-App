import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
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
import { BlogItemComponent } from './components/blog-item.component';

@Component({
  selector: 'digimon-blog-page',
  template: `
    <div *ngIf='blog$ | async' class="relative flex flex-col justify-center h-[100vh] w-[calc(100vw-6.5rem)] bg-gradient-to-b from-[#17212f] to-[#08528d]">
      <div class='mx-auto p-10 max-w-6xl grid grid-cols-4'>
        <div class='col-span-4 grid grid-cols-4 justify-center relative mb-3'>
          <h1 class='col-span-3 text-center text-white text-xl text-black-outline font-black'>Forum</h1>
          <p-button class="mx-auto" (click)='submitAPost()'>Submit a Post</p-button>
        </div>

        <div class='grid col-span-3 grid-cols-2 gap-3'>
          <digimon-blog-item *ngFor='let blog of showBlogs' [blog]="blog" (click)='openBlog(blog)'></digimon-blog-item>
        </div>

        <div class='pl-2 flex flex-col'>
          <h1 class='text-white text-black-outline font-black'>Categories</h1>
          <div *ngFor='let category of categories; let last=last'>
            <p-divider></p-divider>
            <button class='text-white text-xs p-1'>
              {{ category.text }} • ({{ category.count }})
            </button>
          </div>


          <h1 class='mt-3 text-white text-black-outline font-black'>Categories</h1>
          <div *ngFor='let author of authors'>
            <p-divider></p-divider>
            <button class='text-white text-xs p-1'>
              {{ author.author }} • ({{ author.count }})
            </button>
          </div>

        </div>
      </div>
      <p-paginator
        class='absolute bottom-0 w-full surface-ground'
        styleClass='surface-ground'
        (onPageChange)="onPageChange($event)"
        [first]="first" [rows]="rows"
        [totalRecords]="blogs.length"></p-paginator>
    </div>
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
    DividerModule
  ],
  providers: [MessageService],
})
export class CommunityPageComponent implements OnInit {
  categories = [
    {
      text: 'Archtype Review',
      count: 0
    },
    {
      text: 'Miscellaneous',
      count: 0
    },
    {
      text: 'News',
      count: 0
    },
    {
      text: 'Opinion',
      count: 0
    },
    {
      text: 'Tournament Report',
      count: 0
    },
    {
      text: 'Video',
      count: 0
    },
    {
      text: 'Website Update',
      count: 0
    }
  ];
  authors = [
    {
      author: 'TakaOtaku',
      count: 0
    }
  ];
  blog$ = this.store.select(selectBlogs).pipe(
    tap((blogs) => {
      //fill Authors and Categories
    }),
    tap((blogs) => this.showBlogs = blogs.slice(this.first, this.first + this.rows)),
    tap((blogs) => this.blogs = blogs)
  );

  first = 0;
  rows = 6;
  blogs: IBlog[] = [];
  showBlogs: IBlog[] = []

  router = inject(Router);

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

    this.store.dispatch(WebsiteActions.loadBlogs());
  }

  private makeGoogleFriendly() {
    this.metaTitle.setTitle(
      'Digimon Card Game - Forum'
    );

    this.meta.addTags([
      {
        name: 'description',
        content: 'Share your thoughts about the Digimon Card Game with the community, write Tournament Reports or Archtype Reviews.'
      },
      { name: 'author', content: 'TakaOtaku' },
      {
        name: 'keywords',
        content: 'forum, decks, tournament',
      },
    ]);
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
