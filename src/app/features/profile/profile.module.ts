import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChartModule } from 'primeng/chart';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { PaginatorModule } from 'primeng/paginator';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DigimonStoreModule } from '../../digimon-store.module';
import { AuthService } from '../../service/auth.service';
import { DigimonBackendService } from '../../service/digimon-backend.service';
import { SharedModule } from '../shared/shared.module';
import { CollectionCircleComponent } from './collection-circle.component';
import { CollectionComponent } from './collection.component';
import { DeckFilterComponent } from './deck-filter.component';
import { DecksComponent } from './decks.component';
import { ProfilePageComponent } from './profile-page.component';
import { UserStatsComponent } from './user-stats.component';

@NgModule({
  declarations: [
    DeckFilterComponent,
    DecksComponent,
    ProfilePageComponent,
    UserStatsComponent,
    CollectionCircleComponent,
    CollectionComponent,
  ],
  imports: [
    SharedModule,
    DigimonStoreModule,

    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,

    ChartModule,
    MultiSelectModule,
    SelectButtonModule,
    InputTextModule,
    ContextMenuModule,
    DialogModule,
    PaginatorModule,
  ],
  providers: [AuthService, DigimonBackendService],
})
export class ProfileModule {}
