import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { ChipModule } from 'primeng/chip';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MultiSelectModule } from 'primeng/multiselect';
import { PaginatorModule } from 'primeng/paginator';
import { RippleModule } from 'primeng/ripple';
import { StyleClassModule } from 'primeng/styleclass';
import { TableModule } from 'primeng/table';
import { DigimonStoreModule } from '../../digimon-store.module';
import { AuthService } from '../../service/auth.service';
import { DigimonBackendService } from '../../service/digimon-backend.service';
import { DeckbuilderModule } from '../deckbuilder/deckbuilder.module';
import { SharedModule } from '../shared/shared.module';
import { DeckStatisticsComponent } from './components/deck-statistics.component';
import { DeckSubmissionComponent } from '../shared/dialogs/deck-submission.component';
import { DecksFilterComponent } from './components/decks-filter.component';
import { DecksPageComponent } from './decks-page.component';

@NgModule({
  declarations: [
    DecksPageComponent,
    DeckStatisticsComponent,
    DecksFilterComponent,
  ],
  imports: [
    CommonModule,
    DigimonStoreModule,
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    TableModule,
    ReactiveFormsModule,
    InputTextModule,
    DropdownModule,
    ChipModule,
    DeckbuilderModule,
    ButtonModule,
    RippleModule,
    ContextMenuModule,
    SharedModule,
    MultiSelectModule,
    DialogModule,
    PaginatorModule,
    CalendarModule,
    InputTextareaModule,
    StyleClassModule,
  ],
  providers: [AuthService, DigimonBackendService],
})
export class DecksModule {}
