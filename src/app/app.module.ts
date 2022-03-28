import {HttpClientModule} from "@angular/common/http";
import {NgModule} from '@angular/core';
import {AngularFireModule} from "@angular/fire/compat";
import {AngularFireDatabaseModule} from "@angular/fire/compat/database";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {EffectsModule} from '@ngrx/effects';
import {StoreModule} from '@ngrx/store';
import {StoreDevtoolsModule} from "@ngrx/store-devtools";
import {LazyLoadImageModule} from "ng-lazyload-image";
import {ToastrModule} from "ngx-toastr";
import {environment} from "../environments/environment";
import {AppRoutingModule} from "./app-routing.module";
import {AppComponent} from './app.component';
import {CardListComponent} from './components/card-list/card-list.component';
import {DeckCardComponent} from './components/deck-card/deck-card.component';
import {ExportDeckDialogComponent} from './components/export-deck-dialog/export-deck-dialog.component';
import {FilterBoxComponent} from './components/filter-box/filter-box.component';
import {FullCardComponent} from './components/full-card/full-card.component';
import {ImportDeckDialogComponent} from './components/import-deck-dialog/import-deck-dialog.component';
import {MenuComponent} from './components/menu/menu.component';
import {MultiSelectComponent} from './components/multi-select/multi-select.component';
import {NavbarComponent} from './components/navbar/navbar.component';
import {SliderComponent} from './components/slider/slider.component';
import {SmallDeckCardComponent} from './components/small-deck-card/small-deck-card.component';
import {SortButtonsComponent} from './components/sort-buttons/sort-buttons.component';
import {MaterialModule} from "./material.module";
import {DeckBuilderComponent} from './pages/deck-builder/deck-builder.component';
import {DecksComponent} from './pages/decks/decks.component';
import {MainPageComponent} from './pages/main-page/main-page.component';
import {PrimeNGModule} from "./primeng.module";
import {DigimonEffects} from "./store/digimon.effects";

import * as DigimonCards from "./store/reducers/digimon-card.reducers";
import * as Digimon from "./store/reducers/digimon.reducers";
import * as Save from "./store/reducers/save.reducer";
import { MobileDeckBuilderComponent } from './pages/mobile-deck-builder/mobile-deck-builder.component';


@NgModule({
  declarations: [
    AppComponent,
    FullCardComponent,
    MainPageComponent,
    FilterBoxComponent,
    CardListComponent,
    DecksComponent,
    DeckBuilderComponent,
    NavbarComponent,
    SmallDeckCardComponent,
    DeckCardComponent,
    SortButtonsComponent,
    SliderComponent,
    MenuComponent,
    MultiSelectComponent,
    ExportDeckDialogComponent,
    ImportDeckDialogComponent,
    MobileDeckBuilderComponent,
  ],
  imports: [
    MaterialModule,
    PrimeNGModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,

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
  providers: [ReactiveFormsModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
