import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { DigimonStoreModule } from '../../digimon-store.module';
import { AuthService } from '../../service/auth.service';
import { DigimonBackendService } from '../../service/digimon-backend.service';
import { BlogComponent } from './blog.component';
import { CKEditorComponent } from './ckeditor.component';
import { HeaderComponent } from './header.component';

@NgModule({
  declarations: [BlogComponent, HeaderComponent, CKEditorComponent],
  imports: [
    CommonModule,
    DigimonStoreModule,
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    CKEditorModule,
    ButtonModule,
    RippleModule,
    InputTextModule,
    ReactiveFormsModule,
  ],
  providers: [AuthService, MessageService, DigimonBackendService],
})
export class BlogModule {}
