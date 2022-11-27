import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { ADMINS, IBlogWithText, IUser } from '../../../models';
import { AuthService } from '../../service/auth.service';
import { DigimonBackendService } from '../../service/digimon-backend.service';

@Component({
  selector: 'digimon-header',
  template: `
    <div *ngIf="edit$ | async; else editView" class="relative">
      <button
        class="p-button-outlined p-button-rounded absolute left-[5px] top-[20px]"
        icon="pi pi-arrow-left"
        pButton
        pRipple
        type="button"
        (click)="router.navigateByUrl('/community')"
      ></button>
      <h1
        class="mb-2 w-full text-center text-3xl font-extrabold text-[#e2e4e6]"
      >
        {{ title }}
      </h1>
      <button
        *ngIf="showEdit(blog)"
        class="p-button-outlined p-button-rounded absolute right-[5px] top-[20px]"
        icon="pi pi-pencil"
        pButton
        pRipple
        type="button"
        (click)="edit$.next(true)"
      ></button>
    </div>
    <ng-template #editView class="relative">
      <button
        class="p-button-outlined p-button-rounded mr-2"
        icon="pi pi-arrow-left"
        pButton
        pRipple
        type="button"
        (click)="router.navigateByUrl('/community')"
      ></button>
      <span class="w-full">
        <input
          [(ngModel)]="title"
          placeholder="Title:"
          class="mb-3 h-8 w-full text-sm"
          pInputText
          type="text"
        />
      </span>
      <button
        *ngIf="showEdit(blog)"
        class="p-button-outlined p-button-rounded ml-2"
        icon="pi pi-pencil"
        pButton
        pRipple
        type="button"
        (click)="edit$.next(false)"
      ></button>
    </ng-template>

    <div *ngIf="edit$ | async" class="mb-3">
      <div class="flex inline-flex w-full justify-center">
        <button
          (click)="category = 'Tournament Report'"
          [ngClass]="{
            'primary-background': category === 'Tournament Report'
          }"
          class="min-w-auto mt-2 h-8 w-36 rounded-l-sm border border-slate-100 p-2 text-xs font-semibold text-[#e2e4e6]"
        >
          Tournament Report
        </button>
        <button
          (click)="category = 'Deck-Review'"
          [ngClass]="{
            'primary-background': category === 'Deck-Review'
          }"
          class="min-w-auto mt-2 h-8 w-36 border border-slate-100 p-2 text-xs font-semibold text-[#e2e4e6]"
        >
          Deck-Review
        </button>
      </div>
    </div>

    <div class="flex flex-row">
      <span class="mb-2 w-full text-center font-bold text-[#e2e4e6]"
        >{{ author }} / {{ date | date: 'dd.MM.yyyy' }}</span
      >
    </div>
  `,
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() edit$: BehaviorSubject<boolean>;
  @Input() form: FormGroup;

  blog: IBlogWithText;

  title = '';
  content: any;
  author = '';
  date: Date;
  category = '';

  user: IUser | null;

  private onDestroy$ = new Subject();
  constructor(
    public router: Router,
    private active: ActivatedRoute,
    private digimonBackendService: DigimonBackendService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.userData;
    this.authService.authChange
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => (this.user = this.authService.userData));
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.unsubscribe();
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
}
