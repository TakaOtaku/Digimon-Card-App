import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DragDropModule } from 'primeng/dragdrop';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { DigimonStoreModule } from '../../digimon-store.module';
import { AuthService } from '../../service/auth.service';
import { DigimonBackendService } from '../../service/digimon-backend.service';
import { SharedModule } from '../shared/shared.module';
import { CollectionPageComponent } from './collection-page.component';
import { CardListComponent } from './components/card-list.component';
import { CollectionViewComponent } from './components/collection-view.component';
import { PaginationCardListHeaderComponent } from './components/pagination-card-list-header.component';
import { PaginationCardListComponent } from './components/pagination-card-list.component';
import { SearchComponent } from './components/search.component';

@NgModule({
  declarations: [
    PaginationCardListComponent,
    CollectionViewComponent,
    SearchComponent,
    CollectionPageComponent,
    CardListComponent,
    PaginationCardListHeaderComponent,
  ],
  imports: [
    SharedModule,
    CommonModule,
    DigimonStoreModule,
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,

    PaginatorModule,
    DialogModule,
    InputTextModule,
    ButtonModule,
    DragDropModule,
  ],
  exports: [CollectionViewComponent, CardListComponent, SearchComponent],
  providers: [AuthService, DigimonBackendService],
})
export class CollectionModule {}
