import {HttpClientModule} from "@angular/common/http";
import {NgModule} from '@angular/core';
import {AngularFireModule} from "@angular/fire/compat";
import {AngularFireAuthModule} from "@angular/fire/compat/auth";
import {AngularFireDatabaseModule} from "@angular/fire/compat/database";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {EffectsModule} from '@ngrx/effects';
import {StoreModule} from '@ngrx/store';
import {StoreDevtoolsModule} from "@ngrx/store-devtools";
import {LazyLoadImageModule} from "ng-lazyload-image";
import {ToastrModule} from "ngx-toastr";
import {DividerModule} from "primeng/divider";
import {environment} from "../environments/environment";
import {AppRoutingModule} from "./app-routing.module";
import {AppComponent} from './app.component';
import {CardListComponent} from './components/card-lists/card-list/card-list.component';
import {PaginationCardListComponent} from './components/card-lists/pagination-card-list/pagination-card-list.component';
import {DeckCardComponent} from './components/cards/deck-card/deck-card.component';
import {FullCardComponent} from './components/cards/full-card/full-card.component';
import {ChangeAccessorieDialogComponent} from './components/dialogs/change-accessorie-dialog/change-accessorie-dialog.component';
import {ExportDeckDialogComponent} from './components/dialogs/export-deck-dialog/export-deck-dialog.component';
import {ImportDeckDialogComponent} from './components/dialogs/import-deck-dialog/import-deck-dialog.component';
import {ViewCardDialogComponent} from './components/dialogs/view-card-dialog/view-card-dialog.component';
import {FilterBoxComponent} from './components/filter-box/filter-box.component';
import {MenuComponent} from './components/menu/menu.component';
import {MultiSelectComponent} from './components/multi-select/multi-select.component';
import {NavbarComponent} from './components/navbar/navbar.component';
import {SliderComponent} from './components/slider/slider.component';
import {SortButtonsComponent} from './components/sort-buttons/sort-buttons.component';
import {CommunityDecksComponent} from './pages/community-decks/community-decks.component';
import {DeckBuilderComponent} from './pages/deck-builder/deck-builder.component';
import {DecksComponent} from './pages/decks/decks.component';
import {MainPageComponent} from './pages/main-page/main-page.component';
import {PrimeNGModule} from "./primeng.module";
import {AuthService} from "./service/auth.service";
import {DatabaseService} from "./service/database.service";
import {DigimonEffects} from "./store/digimon.effects";

import * as DigimonCards from "./store/reducers/digimon-card.reducers";
import * as Digimon from "./store/reducers/digimon.reducers";
import * as Save from "./store/reducers/save.reducer";


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
    DeckCardComponent,
    SortButtonsComponent,
    SliderComponent,
    MenuComponent,
    MultiSelectComponent,
    ExportDeckDialogComponent,
    ImportDeckDialogComponent,
    PaginationCardListComponent,
    ViewCardDialogComponent,
    CommunityDecksComponent,
    ChangeAccessorieDialogComponent,
  ],
  imports: [
    PrimeNGModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,

    LazyLoadImageModule,

    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule,

    ToastrModule.forRoot({}),

    StoreModule.forRoot(
        {digimon: Digimon.digimonReducer, digimonCards: DigimonCards.digimonCardReducer, save: Save.saveReducer},
        {
            initialState: {
                digimon: Digimon.initialState,
                digimonCards: DigimonCards.initialState,
                save: Save.initialState
            }
        }),
    StoreDevtoolsModule.instrument({
        name: 'Digimon Card Collector',
        logOnly: environment.production
    }),
    EffectsModule.forRoot([DigimonEffects]),
    DividerModule
  ],
  providers: [ReactiveFormsModule, AuthService, DatabaseService],
  bootstrap: [AppComponent]
})
export class AppModule { }
