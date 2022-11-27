import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { DigimonStoreModule } from '../../digimon-store.module';
import { AuthService } from '../../service/auth.service';
import { DigimonBackendService } from '../../service/digimon-backend.service';
import { SharedModule } from '../shared/shared.module';
import { CardListComponent } from './card-list.component';
import { CollectionPageComponent } from './collection-page.component';
import { CollectionViewComponent } from './collection-view.component';
import { PaginationCardListComponent } from './pagination-card-list.component';
import { SearchComponent } from './search.component';

@NgModule({
  declarations: [
    PaginationCardListComponent,
    CollectionViewComponent,
    SearchComponent,
    CollectionPageComponent,
    CardListComponent,
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
  ],
  exports: [CollectionViewComponent, CardListComponent],
  providers: [AuthService, DigimonBackendService],
})
export class CollectionModule {}
