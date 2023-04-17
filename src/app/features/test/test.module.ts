import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogModule } from 'primeng/dialog';
import { SafePipe } from '../../pipes/safe.pipe';
import { AuthService } from '../../service/auth.service';
import { CardMarketService } from '../../service/card-market.service';
import { DatabaseService } from '../../service/database.service';
import { DigimonBackendService } from '../../service/digimon-backend.service';
import { TestPageComponent } from './test-page.component';

@NgModule({
  declarations: [TestPageComponent, SafePipe],
  imports: [CommonModule, FormsModule, BrowserModule, BrowserAnimationsModule, DialogModule],
  providers: [AuthService, DatabaseService, DigimonBackendService, CardMarketService],
})
export class TestModule {}
