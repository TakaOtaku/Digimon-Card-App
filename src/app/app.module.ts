import {HttpClientModule} from "@angular/common/http";
import {NgModule} from '@angular/core';
import {AngularFireModule} from "@angular/fire/compat";
import {AngularFireDatabaseModule} from "@angular/fire/compat/database";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {EffectsModule} from '@ngrx/effects';
import {StoreModule} from '@ngrx/store';
import {StoreDevtoolsModule} from "@ngrx/store-devtools";
import {LazyLoadImageModule} from "ng-lazyload-image";
import {CookieService} from "ngx-cookie-service";
import {ToastrModule} from "ngx-toastr";
import {environment} from "../environments/environment";
import {AppRoutingModule} from "./app-routing.module";
import {AppComponent} from './app.component';
import {CardListComponent} from './components/card-list/card-list.component';
import {DeckBuilderComponent} from './components/deck/deck-builder/deck-builder.component';
import {DecksComponent} from './components/deck/decks/decks.component';
import {SmallDeckCardComponent} from './components/deck/small-deck-card/small-deck-card.component';
import {ConfirmationDialogComponent} from './components/dialogs/confirmation-dialog/confirmation-dialog.component';
import {DeckContextMenuComponent} from './components/dialogs/deck-context-menu/deck-context-menu.component';
import {ExportDeckComponent} from './components/dialogs/export-deck/export-deck.component';
import {FilterDialogComponent} from './components/dialogs/filter-dialog/filter-dialog.component';
import {ImportCollectionComponent} from './components/dialogs/import-collection/import-collection.component';
import {ImportDeckComponent} from './components/dialogs/import-deck/import-deck.component';
import {ImportExportDialogComponent} from './components/dialogs/import-export-dialog/import-export-dialog.component';
import {FilterBoxComponent} from './components/filter-box/filter-box.component';
import {FullCardComponent} from './components/full-card/full-card.component';
import {MainPageComponent} from './components/main-page/main-page.component';
import {NavbarComponent} from './components/navbar/navbar.component';
import {MaterialModule} from "./material.module";
import {DigimonEffects} from "./store/digimon.effects";

import * as DigimonCards from "./store/reducers/digimon-card.reducers";
import * as Digimon from "./store/reducers/digimon.reducers";
import * as Save from "./store/reducers/save.reducer";
import { DeckCardComponent } from './components/deck/deck-card/deck-card.component';

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
    NavbarComponent,
    FilterDialogComponent,
    ImportCollectionComponent,
    ImportExportDialogComponent,
    SmallDeckCardComponent,
    DeckCardComponent
  ],
  imports: [
      MaterialModule,
      FormsModule,
      ReactiveFormsModule,
      HttpClientModule,
      BrowserModule,
      BrowserAnimationsModule,
      FontAwesomeModule,
      AppRoutingModule,
      LazyLoadImageModule,

      AngularFireModule.initializeApp(environment.firebaseConfig),
      AngularFireDatabaseModule,

      ToastrModule.forRoot({}),

      StoreModule.forRoot(
        {digimon: Digimon.digimonReducer, digimonCards: DigimonCards.digimonCardReducer, save: Save.saveReducer},
        {initialState: {digimon: Digimon.initialState, digimonCards: DigimonCards.initialState, save: Save.initialState}
        }),
      StoreDevtoolsModule.instrument({
        name: 'Digimon Card Collector',
        logOnly: environment.production
      }),
      EffectsModule.forRoot([DigimonEffects])
    ],
  providers: [
    ReactiveFormsModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
