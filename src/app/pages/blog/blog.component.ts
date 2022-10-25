import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataSnapshot } from '@angular/fire/compat/database/interfaces';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { filter, first, Subject, takeUntil } from 'rxjs';
import { ADMINS, IUser } from '../../../models';
import { IBlog } from '../../../models/interfaces/blog-entry.interface';
import { AuthService } from '../../service/auth.service';
import { DatabaseService } from '../../service/database.service';

@Component({
  selector: 'digimon-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
})
export class BlogComponent implements OnInit, OnDestroy {
  blog: IBlog;

  title = '';
  content = [];
  author = '';
  date: Date;
  category = '';
  edit = false;

  user: IUser | null;

  private onDestroy$ = new Subject();
  constructor(
    public router: Router,
    private active: ActivatedRoute,
    private databaseService: DatabaseService,
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
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
        first(),
        filter((params) => !!params['id'])
      )
      .subscribe((params) => {
        this.databaseService.loadBlogEntry(params['id']).subscribe((blog) => {
          try {
            const value: DataSnapshot = blog;

            if (!value) {
              return;
            }

            const newBlog: IBlog = value.val();
            this.blog = newBlog;
            this.title = newBlog.title;
            this.content = newBlog.text;
            this.author = newBlog.author;
            this.date = newBlog.date;
            this.category = newBlog.category;
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

  save() {
    const newBlog = {
      ...this.blog,
      text: this.content,
      title: this.title,
      date: new Date(),
    } as IBlog;

    this.databaseService.saveBlogEntry(newBlog);
    this.messageService.add({
      severity: 'success',
      summary: 'Blog-Entry saved!',
      detail: 'The Blog-Entry was saved successfully!',
    });
  }
}
