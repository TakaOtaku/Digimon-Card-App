import { DatePipe, NgIf, NgFor, NgStyle, NgClass, AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import * as uuid from 'uuid';
import { ADMINS, IUser } from '../../../../models';
import { AuthService } from '../../../service/auth.service';
import { DigimonBackendService } from '../../../service/digimon-backend.service';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CalendarModule } from 'primeng/calendar';
import { StyleClassModule } from 'primeng/styleclass';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';

export interface IEvent {
  uid: string;
  date: string;
  title: string;
  theme: string;
}

@Component({
  selector: 'digimon-event-calendar',
  template: `
    <div *ngIf="events$ | async as events" class="surface-card border-2 border-slate-500 p-2">
      <div class="flex flex-row">
        <h1 class="text-shadow my-2 text-lg font-black text-[#e2e4e6] lg:text-2xl">
          {{ MONTHS[month] + ' ' + year }}
        </h1>
        <div class="ml-auto mr-2 mt-4">
          <button class="mr-1" (click)="previousMonth()">
            <i class="fa-solid fa-circle-arrow-left h-6 text-[#e2e4e6]"></i>
          </button>
          <button *ngIf="editRights()" class="mr-1" (click)="openEventModal()">
            <i class="fa-solid fa-circle-plus h-6 text-[#e2e4e6]"></i>
          </button>
          <button class="mr-1" (click)="nextMonth()">
            <i class="fa-solid fa-circle-arrow-right h-6 text-[#e2e4e6]"></i>
          </button>
        </div>
      </div>

      <div class="lg:hidden" *ngIf="eventsInMonth(events) as eventsInMonth; else noEvents">
        <div
          *ngFor="let event of eventsInMonth"
          [ngStyle]="{ background: getThemeColor(event) }"
          class="my-1 flex w-full flex-row border px-1 px-3">
          <div class="text-shadow w-full truncate text-sm font-black text-[#e2e4e6]">
            {{ event.title }}
          </div>
          <div class="text-shadow ml-auto w-full truncate text-right text-sm font-black text-[#e2e4e6]">
            {{ event.date }}
          </div>
        </div>
      </div>
      <ng-template #noEvents>
        <h1 class="text-shadow my-2 text-lg font-black text-[#e2e4e6] lg:text-2xl">No events this month.</h1>
      </ng-template>

      <div class="no-gap hidden grid-cols-3 lg:grid lg:grid-cols-7">
        <div
          *ngFor="let day of DAYS"
          class="text-shadow my-2 hidden text-center font-black text-[#e2e4e6] lg:block lg:text-xl">
          {{ day }}
        </div>

        <div *ngFor="let blankDay of blankDays" class="min-h-[62px] w-full border border-black"></div>

        <div *ngFor="let date of noOfDays" class="min-h-[62px] w-full border  border-black">
          <span
            [ngClass]="{
              'rounded-full border border-slate-500 bg-slate-500 px-1': isToday(date)
            }"
            class="text-shadow ml-2 font-black text-[#e2e4e6] lg:text-xl"
            >{{ date }}</span
          >
          <div
            *ngFor="let event of getEvents(date, events)"
            [ngStyle]="{ background: getThemeColor(event) }"
            (click)="openEventModal(event)"
            class="m-1 rounded-full border border-black text-center">
            <div
              [pTooltip]="event.title"
              tooltipPosition="top"
              class="text-shadow w-full truncate px-2 text-xs font-black text-[#e2e4e6]">
              {{ event.title }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <p-dialog
      [(visible)]="eventModal"
      [baseZIndex]="10000"
      [modal]="true"
      [dismissableMask]="true"
      [resizable]="false"
      [header]="edit ? 'Edit Event' : 'Create Event'"
      styleClass="w-[400px]">
      <div class="mx-auto flex flex-col">
        <div class="w-full">
          <span class="p-float-label">
            <input id="title-input" type="text" pInputText pStyleClass="w-full" [(ngModel)]="title" />
            <label for="title-input">Title</label>
          </span>
        </div>

        <div>
          <p-calendar
            [(ngModel)]="date"
            [showIcon]="true"
            inputId="icon"
            styleClass="w-full"
            dateFormat="dd.MM.yy"
            appendTo="body"></p-calendar>
        </div>

        <div class="w-full">
          <p-radioButton name="theme" value="Release" label="Release" class="mr-4" [(ngModel)]="theme"></p-radioButton>
          <p-radioButton name="theme" value="Tournament" label="Tournament" [(ngModel)]="theme"></p-radioButton>
        </div>

        <div class="flex flex-row">
          <button
            *ngIf="edit"
            class="p-button mr-4 mt-3"
            icon="pi pi-trash"
            pButton
            pRipple
            type="button"
            label="Delete"
            (click)="removeEvent()"></button>
          <button
            class="p-button mt-3"
            icon="pi pi-save"
            pButton
            pRipple
            type="button"
            [label]="edit ? 'Save' : 'Create'"
            (click)="saveEvent()"></button>
        </div>
      </div>
    </p-dialog>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    NgStyle,
    NgClass,
    TooltipModule,
    DialogModule,
    FormsModule,
    InputTextModule,
    StyleClassModule,
    CalendarModule,
    RadioButtonModule,
    ButtonModule,
    RippleModule,
    AsyncPipe,
  ],
})
export class EventCalendarComponent implements OnInit, OnDestroy {
  MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  currentDate: Date;
  events$: Observable<IEvent[]> = this.digimonBackend.getEvents();

  year: number;
  month: number;
  blankDays: any;
  noOfDays: any;

  eventModal = false;
  uid = '';
  title = '';
  date = '';
  theme = 'Release';
  edit = false;

  user: IUser | null;
  private onDestroy$ = new Subject();

  constructor(
    private authService: AuthService,
    private datepipe: DatePipe,
    private digimonBackend: DigimonBackendService
  ) {
    this.currentDate = new Date();
    this.year = this.currentDate.getFullYear();
    this.month = this.currentDate.getMonth();
    this.getNoOfDays();
  }

  ngOnInit() {
    this.user = this.authService.userData;
    this.authService.authChange
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => (this.user = this.authService.userData));
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.unsubscribe();
  }

  isToday(date: number) {
    const today = new Date();
    const d = new Date(this.year, this.month, date);
    return today.toDateString() === d.toDateString();
  }

  getNoOfDays() {
    let daysInMonth = new Date(this.year, this.month + 1, 0).getDate();
    // find where to start calendar day of week
    let dayOfWeek = new Date(this.year, this.month).getDay() - 1;

    dayOfWeek = dayOfWeek >= 0 ? dayOfWeek : 6;

    let blankDaysArray = [];
    for (let i = 1; i <= dayOfWeek; i++) {
      blankDaysArray.push(i);
    }
    let daysArray = [];
    for (let i = 1; i <= daysInMonth; i++) {
      daysArray.push(i);
    }
    this.blankDays = blankDaysArray;
    this.noOfDays = daysArray;
  }

  previousMonth() {
    this.month--;
    if (this.month < 0) {
      this.month = 11;
      this.year--;
    }
    this.getNoOfDays();
  }

  nextMonth() {
    this.month++;
    if (this.month > 11) {
      this.month = 0;
      this.year++;
    }
    this.getNoOfDays();
  }

  getEvents(day: number, events: IEvent[]): IEvent[] {
    return events.filter((event) => {
      const date = `${day}.${this.addLeadingZeros(this.month + 1, 2)}.${this.year}`;
      return event.date === date;
    });
  }

  addLeadingZeros(num: number, totalLength: number): string {
    return String(num).padStart(totalLength, '0');
  }

  saveEvent() {
    const date = this.datepipe.transform(this.date, 'dd.MM.yyyy');
    if (!date) {
      return;
    }

    const newEvent = {
      title: this.title,
      theme: this.theme,
      date,
      uid: uuid.v4(),
    } as IEvent;

    this.digimonBackend.updateEvent(newEvent).subscribe();
    this.eventModal = false;
  }

  removeEvent() {
    this.digimonBackend.deleteEvent(this.uid).subscribe();
    this.eventModal = false;
  }

  openEventModal(event?: IEvent) {
    if (!this.editRights()) {
      return;
    }
    this.eventModal = true;
    this.uid = event ? event.uid : '';
    this.title = event ? event.title : '';
    this.date = event ? event.date : '';
    this.theme = event ? event.theme : 'Release';
    this.edit = !!event;
  }

  isAdmin(): boolean {
    return !!ADMINS.find((user) => {
      if (this.user?.uid === user.id) {
        return user.admin;
      }
      return false;
    });
  }

  editRights(): boolean {
    if (this.isAdmin()) {
      return true;
    }

    return !!ADMINS.find((user) => {
      if (this.user?.uid === user.id) {
        return user.editEvents;
      }
      return false;
    });
  }

  getThemeColor(event: IEvent) {
    const themeMap = new Map<string, string>([
      ['Release', '#ef1919'],
      ['Tournament', ' #19a0e3'],
    ]);
    return themeMap.get(event.theme);
  }

  eventsInMonth(events: IEvent[]): IEvent[] {
    return events.filter((event) => {
      const splitDate = event.date.split('.');
      const currentMonth = Number(splitDate[1]);
      const currentYear = Number(splitDate[2]);
      return currentMonth === this.month + 1 && currentYear === this.year;
    });
  }
}
