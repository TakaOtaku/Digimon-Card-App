import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { BlockUIModule } from 'primeng/blockui';
import { ChartModule } from 'primeng/chart';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { PaginatorModule } from 'primeng/paginator';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SelectButtonModule } from 'primeng/selectbutton';
import { StyleClassModule } from 'primeng/styleclass';
import { TableModule } from 'primeng/table';
import { DigimonStoreModule } from '../../digimon-store.module';
import { AuthService } from '../../service/auth.service';
import { DigimonBackendService } from '../../service/digimon-backend.service';
import { SharedModule } from '../shared/shared.module';
import { CollectionCircleComponent } from './collection-circle.component';
import { CollectionComponent } from './collection.component';
import { CollectionPriceCheckDialogComponent } from './components/collection-price-check-dialog.component';
import { DeckFilterComponent } from './deck-filter.component';
import { DecksTableComponent } from './decks-table.component';
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
    DecksTableComponent,
    CollectionPriceCheckDialogComponent,
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
    TableModule,
    LazyLoadImageModule,
    BlockUIModule,
    ProgressSpinnerModule,
    StyleClassModule,
  ],
  providers: [AuthService, DigimonBackendService],
})
export class ProfileModule {}
