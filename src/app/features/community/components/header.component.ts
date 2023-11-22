import { DatePipe, NgClass, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormGroup,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { Subject, takeUntil } from 'rxjs';
import { ADMINS, IUser } from '../../../../models';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'digimon-header',
  template: `
    <div [formGroup]="form">
      <div *ngIf="!edit; else editView" class="relative flex flex-row">
        <button
          class="p-button-outlined p-button-rounded mr-2"
          icon="pi pi-arrow-left"
          pButton
          pRipple
          type="button"
          (click)="router.navigateByUrl('/community')"></button>
        <h1
          class="mb-2 w-full text-center text-3xl font-extrabold text-[#e2e4e6]">
          {{ form.get('title')!.value }}
        </h1>
        <button
          *ngIf="showEdit()"
          class="p-button-outlined p-button-rounded absolute right-[5px] top-[20px]"
          icon="pi pi-pencil"
          pButton
          pRipple
          type="button"
          (click)="editChanged.emit(true)"></button>
      </div>
      <ng-template #editView class="relative">
        <button
          class="p-button-outlined p-button-rounded mr-2"
          icon="pi pi-arrow-left"
          pButton
          pRipple
          type="button"
          (click)="router.navigateByUrl('/community')"></button>
        <span class="w-full">
          <input
            formControlName="title"
            placeholder="Title:"
            class="mb-3 h-8 w-full text-sm"
            pInputText
            type="text" />
        </span>
        <button
          *ngIf="showEdit()"
          class="p-button-outlined p-button-rounded ml-2"
          icon="pi pi-pencil"
          pButton
          pRipple
          type="button"
          (click)="editChanged.emit(false)"></button>
      </ng-template>

      <div *ngIf="edit" class="mb-3">
        <div class="flex inline-flex w-full justify-center">
          <button
            (click)="form.get('category')!.setValue('Tournament Report')"
            [ngClass]="{
              'primary-background':
                form.get('category')!.value === 'Tournament Report'
            }"
            class="min-w-auto mt-2 h-8 w-36 rounded-l-sm border border-slate-100 p-2 text-xs font-semibold text-[#e2e4e6]">
            Tournament Report
          </button>
          <button
            (click)="form.get('category')!.setValue('Deck-Review')"
            [ngClass]="{
              'primary-background':
                form.get('category')!.value === 'Deck-Review'
            }"
            class="min-w-auto mt-2 h-8 w-36 border border-slate-100 p-2 text-xs font-semibold text-[#e2e4e6]">
            Deck-Review
          </button>
        </div>
      </div>

      <div class="flex flex-row">
        <span class="mb-2 w-full text-center font-bold text-[#e2e4e6]"
          >{{ form.get('author')!.value }} /
          {{ form.get('date')!.value | date : 'dd.MM.yyyy' }}</span
        >
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    ButtonModule,
    RippleModule,
    InputTextModule,
    NgClass,
    DatePipe,
  ],
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() edit: boolean;
  @Input() form: UntypedFormGroup;
  @Input() authorid: string;

  @Output() editChanged = new EventEmitter<boolean>();

  user: IUser | null;

  private onDestroy$ = new Subject();

  constructor(public router: Router, private authService: AuthService) {}

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

  showEdit(): boolean {
    if (this.isAdmin()) {
      return true;
    }

    const writeRights = !!ADMINS.find((user) => {
      if (this.user?.uid === user.id) {
        return user.writeBlog;
      }
      return false;
    });

    return writeRights ? this.authorid === this.user?.uid : false;
  }
}
