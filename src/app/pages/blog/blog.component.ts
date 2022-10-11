import { Component, OnInit } from '@angular/core';
import { DataSnapshot } from '@angular/fire/compat/database/interfaces';
import { ActivatedRoute } from '@angular/router';
import { filter, first } from 'rxjs';
import { IBlog } from '../../../models/interfaces/blog-entry.interface';
import { DatabaseService } from '../../service/database.service';

@Component({
  selector: 'digimon-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
})
export class BlogComponent implements OnInit {
  title = '';
  content = [];
  author = '';
  date: Date;
  category = '';

  constructor(
    private active: ActivatedRoute,
    private databaseService: DatabaseService
  ) {}

  ngOnInit(): void {
    this.checkURL();
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
}
