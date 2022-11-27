import { DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { AccordionModule } from 'primeng/accordion';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RippleModule } from 'primeng/ripple';
import { StyleClassModule } from 'primeng/styleclass';
import { TooltipModule } from 'primeng/tooltip';
import { DigimonStoreModule } from '../../digimon-store.module';
import { SharedModule } from '../shared/shared.module';
import { EventCalendarComponent } from './components/event-calendar.component';
import { FAQComponent } from './components/faq.component';
import { HomeIntroComponent } from './components/home-intro.component';
import { HomePageComponent } from './home-page.component';
import { SiteLinksComponent } from './components/site-links.component';
import { SplitBoxComponent } from './components/split-box.component';
import { TierlistComponent } from './components/tierlist.component';

@NgModule({
  declarations: [
    EventCalendarComponent,
    SplitBoxComponent,
    HomePageComponent,
    TierlistComponent,
    FAQComponent,
    SiteLinksComponent,
    HomeIntroComponent,
  ],
  imports: [
    SharedModule,
    DigimonStoreModule,

    TooltipModule,
    AccordionModule,
    CalendarModule,
    DialogModule,
    InputTextModule,
    StyleClassModule,
    RippleModule,
    RadioButtonModule,

    LazyLoadImageModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
  ],
  providers: [DatePipe],
})
export class HomeModule {}
