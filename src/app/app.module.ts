import {HttpClientModule} from "@angular/common/http";
import {NgModule} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule} from "@angular/router";
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {EffectsModule} from '@ngrx/effects';
import {StoreModule} from '@ngrx/store';
import {StoreDevtoolsModule} from "@ngrx/store-devtools";
import {CookieService} from "ngx-cookie-service";
import {environment} from "../environments/environment";
import {AppComponent} from './app.component';
import {CardListComponent} from './components/card-list/card-list.component';
import {FilterBoxComponent} from './components/filter-box/filter-box.component';
import {FullCardComponent} from './components/full-card/full-card.component';
import {MainPageComponent} from './components/main-page/main-page.component';
import {SaveDialogComponent} from './components/save-dialog/save-dialog.component';
import {MaterialModule} from "./material.module";
import {DigimonEffects} from "./store/digimon.effects";
import {digimonReducer} from "./store/digimon.reducers";
import {saveReducer} from "./store/save.reducer";

@NgModule({
  declarations: [
    AppComponent,
    FullCardComponent,
    MainPageComponent,
    FilterBoxComponent,
    CardListComponent,
    SaveDialogComponent
  ],
  imports: [
    FormsModule,
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot([
      { path: '', component: MainPageComponent },
    ]),
    FontAwesomeModule,
    MaterialModule,
    StoreModule.forRoot({ digimonCards: digimonReducer, save: saveReducer }),
    StoreDevtoolsModule.instrument({
      name: 'Digimon Card Collector',
      logOnly: environment.production
    }),
    EffectsModule.forRoot([DigimonEffects])
  ],
  providers: [
    CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
