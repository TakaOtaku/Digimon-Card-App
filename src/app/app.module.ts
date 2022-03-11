import {HttpClientModule} from "@angular/common/http";
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule} from "@angular/router";
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {EffectsModule} from '@ngrx/effects';
import {StoreModule} from '@ngrx/store';
import {StoreDevtoolsModule} from "@ngrx/store-devtools";
import {CookieService} from "ngx-cookie-service";
import {ToastrModule} from "ngx-toastr";
import {environment} from "../environments/environment";
import {AppComponent} from './app.component';
import {CardListComponent} from './components/cards/card-list/card-list.component';
import {ConfirmationDialogComponent} from './components/confirmation-dialog/confirmation-dialog.component';
import {DeckBuilderComponent} from './components/deck/deck-builder/deck-builder.component';
import {DeckContextMenuComponent} from './components/deck/deck-context-menu/deck-context-menu.component';
import {DecksComponent} from './components/deck/decks/decks.component';
import {ExportDeckComponent} from './components/deck/export-deck/export-deck.component';
import {FilterBoxComponent} from './components/filter-box/filter-box.component';
import {FullCardComponent} from './components/cards/full-card/full-card.component';
import {ImportDeckComponent} from './components/deck/import-deck/import-deck.component';
import {MainPageComponent} from './components/main-page/main-page.component';
import {MaterialModule} from "./material.module";
import {DigimonEffects} from "./store/digimon.effects";
import {appReducer} from "./store/reducers/app.reducers";
import {digimonReducer} from "./store/reducers/digimon.reducers";
import {saveReducer} from "./store/reducers/save.reducer";
import { NavbarComponent } from './components/navbar/navbar.component';

@NgModule({
  declarations: [
    AppComponent,
    FullCardComponent,
    MainPageComponent,
    FilterBoxComponent,
    CardListComponent,
    DecksComponent,
    DeckBuilderComponent,
    ImportDeckComponent,
    ExportDeckComponent,
    ConfirmationDialogComponent,
    DeckContextMenuComponent,
    NavbarComponent
  ],
    imports: [
        MaterialModule,
        ToastrModule.forRoot({}),
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        BrowserModule,
        BrowserAnimationsModule,
        FontAwesomeModule,
        RouterModule.forRoot([{path: '', component: MainPageComponent}]),
        StoreModule.forRoot({app: appReducer, digimonCards: digimonReducer, save: saveReducer}, {initialState: {
          }}),
        StoreDevtoolsModule.instrument({
            name: 'Digimon Card Collector',
            logOnly: environment.production
        }),
        EffectsModule.forRoot([DigimonEffects])
    ],
  providers: [
    ReactiveFormsModule,
    CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
