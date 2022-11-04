import { Component, OnDestroy } from '@angular/core';
import { DataSnapshot } from '@angular/fire/compat/database/interfaces';

// @ts-ignore
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { filter, first, Subject, tap } from 'rxjs';
import { ISave } from '../../../models';
import {
  IBlog,
  IBlogWithText,
} from '../../../models/interfaces/blog-entry.interface';
import { AuthService } from '../../service/auth.service';
import { DatabaseService } from '../../service/database.service';
import { DigimonBackendService } from '../../service/digimon-backend.service';
import { emptySettings } from '../../store/reducers/save.reducer';

@Component({
  selector: 'digimon-test-page',
  templateUrl: './test-page.component.html',
})
export class TestPageComponent implements OnDestroy {
  private onDestroy$ = new Subject();
  constructor(
    public authService: AuthService,
    private databaseService: DatabaseService,
    private digimonBackendService: DigimonBackendService
  ) {}

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.unsubscribe();
  }

  transferAllDataToSQL() {
    this.transferDecks();
    this.transferUsers();
    this.transferBlogs();
    this.transferBlogsWithText();
    //this.transferFromSQLDecks();
    //this.transferFromSQLUsers();
    //this.transferFromSQLBlogs();
    //this.transferFromSQLBlogsWithText();
  }

  transferDecks() {
    this.databaseService
      .loadCommunityDecks()
      .pipe(filter((value) => value.length > 0))
      .subscribe((decks) => {
        decks.forEach((deck) => {
          this.digimonBackendService
            .updateDeckWithoutUser(deck)
            .pipe(
              first(),
              tap(() => console.log('Update Deck' + deck.id))
            )
            .subscribe((message) => console.log(message));
        });
      });
  }

  transferUsers() {
    this.databaseService.loadUsers().subscribe((r) => {
      const value: DataSnapshot = r;
      if (!value) {
        return;
      }
      const keys: any[] = Object.keys(value.val());
      const saves: ISave[] = Object.values(value.val());

      const savesWithID = saves.map((value, index) => {
        if (value.uid) {
          return value;
        } else {
          value.uid = keys[index];
          return value;
        }
      });

      const uniqueIds: any[] = [];
      const duplicatesRemoved = savesWithID.filter((element) => {
        const isDuplicate = uniqueIds.includes(element.uid);

        if (!isDuplicate) {
          uniqueIds.push(element.uid);
          return true;
        }

        return false;
      });

      duplicatesRemoved
        .filter((value1) => value1.uid)
        .forEach((save: ISave) => {
          if (!save.collection) {
            save.collection = [];
          }
          if (!save.decks) {
            save.decks = [];
          }
          if (!save.displayName) {
            save.displayName = '';
          }
          if (!save.photoURL) {
            save.photoURL = '';
          }
          if (!save.settings) {
            save.settings = emptySettings;
          }
          if (!save.version) {
            save.version = 1.3;
          }

          this.digimonBackendService
            .updateSave(save)
            .pipe(
              first(),
              tap(() => console.log('Update Save' + save.uid))
            )
            .subscribe((message) => console.log(message));
        });
    });
  }

  transferBlogs() {
    this.databaseService.loadBlogEntries().subscribe((value: DataSnapshot) => {
      const blogs: IBlog[] = Object.values(value.val());

      blogs.forEach((blog) => {
        this.digimonBackendService
          .updateBlog(blog)
          .pipe(
            first(),
            tap(() => console.log('Update Blog' + blog.uid))
          )
          .subscribe((message) => console.log(message));
      });
    });
  }

  transferBlogsWithText() {
    this.databaseService.loadBlogText().subscribe((value: DataSnapshot) => {
      const blogTexts: IBlogWithText[] = Object.values(value.val());

      blogTexts.forEach((blog) => {
        this.digimonBackendService
          .updateBlogWithText(blog)
          .pipe(
            first(),
            tap(() => console.log('Update BlogWithText' + blog.uid))
          )
          .subscribe((message) => console.log(message));
      });
    });
  }

  transferFromSQLDecks() {
    this.digimonBackendService
      .getDecks('https://backend.digimoncard.app/api/')
      .pipe(filter((value) => value.length > 0))
      .subscribe((decks) => {
        decks.forEach((deck) => {
          this.digimonBackendService
            .updateDeckWithoutUser(deck)
            .pipe(
              first(),
              tap(() => console.log('Update Deck' + deck.id))
            )
            .subscribe((message) => console.log(message));
        });
      });
  }

  transferFromSQLUsers() {
    this.digimonBackendService
      .getSaves('https://backend.digimoncard.app/api/')
      .pipe(filter((value) => value.length > 0))
      .subscribe((saves) => {
        saves.forEach((save) => {
          this.digimonBackendService
            .updateSave(save)
            .pipe(
              first(),
              tap(() => console.log('Update Save' + save.uid))
            )
            .subscribe((message) => console.log(message));
        });
      });
  }

  transferFromSQLBlogs() {
    this.digimonBackendService
      .getBlogEntries('https://backend.digimoncard.app/api/')
      .pipe(filter((value) => value.length > 0))
      .subscribe((blogs) => {
        blogs.forEach((blog) => {
          this.digimonBackendService
            .updateBlog(blog)
            .pipe(
              first(),
              tap(() => console.log('Update Blog' + blog.uid))
            )
            .subscribe((message) => console.log(message));
        });
      });
  }

  transferFromSQLBlogsWithText() {
    this.digimonBackendService
      .getBlogEntriesWithText('https://backend.digimoncard.app/api/')
      .pipe(filter((value) => value.length > 0))
      .subscribe((blogs) => {
        blogs.forEach((blog) => {
          this.digimonBackendService
            .updateBlogWithText(blog)
            .pipe(
              first(),
              tap(() => console.log('Update Blog' + blog.uid))
            )
            .subscribe((message) => console.log(message));
        });
      });
  }
}
