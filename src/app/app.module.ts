import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAnalyticsModule } from '@angular/fire/compat/analytics';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { ToastrModule } from 'ngx-toastr';
import { InputSwitchModule } from 'primeng/inputswitch';
import { PaginatorModule } from 'primeng/paginator';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ComponentsModule } from './components.module';
import { ChartContainerComponent } from './components/atoms/chart-container.component';
import { SortButtonsComponent } from './components/atoms/sort-buttons.component';
import { ChartContainersComponent } from './components/molecules/chart-containers.component';
import { CollectionCircleComponent } from './components/molecules/collection-circle.component';
import { CollectionComponent } from './components/molecules/collection.component';
import { ColorSpreadComponent } from './components/molecules/statistics/color-spread.component';
import { DdtoSpreadComponent } from './components/molecules/statistics/ddto-spread.component';
import { DeckStatisticsComponent } from './components/molecules/statistics/deck-statistics.component';
import { DeckCardComponent } from './components/molecules/deckview/deck-card.component';
import { DeckMetadataComponent } from './components/molecules/deckview/deck-metadata.component';
import { DeckStatsComponent } from './components/molecules/deckview/deck-stats.component';
import { DeckToolbarComponent } from './components/molecules/deckview/deck-toolbar.component';
import { DecksComponent } from './components/molecules/decks.component';
import { ChangeAccessorieDialogComponent } from './components/molecules/dialogs/change-accessorie-dialog.component';
import { ChangelogDialogComponent } from './components/molecules/dialogs/changelog-dialog.component';
import { CollectionStatsDialogComponent } from './components/molecules/dialogs/collection-stats-dialog.component';
import { ExportDeckDialogComponent } from './components/molecules/dialogs/export-deck-dialog.component';
import { ImportDeckDialogComponent } from './components/molecules/dialogs/import-deck-dialog.component';
import { ProxyPrintDialogComponent } from './components/molecules/dialogs/proxy-print-dialog.component';
import { SettingsDialogComponent } from './components/molecules/dialogs/settings-dialog.component';
import { ViewCardDialogComponent } from './components/molecules/dialogs/view-card-dialog.component';
import { FullCardComponent } from './components/molecules/full-card.component';
import { LevelSpreadComponent } from './components/molecules/statistics/level-spread.component';
import { MultiButtonsComponent } from './components/molecules/multi-buttons.component';
import { RangeSliderComponent } from './components/molecules/range-slider.component';
import { SearchComponent } from './components/molecules/search.component';
import { TierlistComponent } from './components/molecules/tierlist.component';
import { UserStatsComponent } from './components/molecules/user-stats.component';
import { CardListComponent } from './components/organisms/card-list.component';
import { CollectionViewComponent } from './components/organisms/collection-view.component';
import { DeckViewComponent } from './components/organisms/deck-view.component';
import { FilterAndSearchComponent } from './components/organisms/filter/filter-and-search.component';
import { FilterButtonComponent } from './components/organisms/filter/filter-button.component';
import { FilterSideBoxComponent } from './components/organisms/filter/filter-side-box.component';
import { NavbarComponent } from './components/organisms/navbar.component';
import { PaginationCardListComponent } from './components/organisms/pagination-card-list.component';
import { BlogComponent } from './pages/blog.component';
import { CollectionPageComponent } from './pages/collection-page.component';
import { CommunityComponent } from './pages/community.component';
import { DeckbuilderComponent } from './pages/deckbuilder.component';
import { HomeComponent } from './pages/home.component';
import { TestPageComponent } from './pages/test-page.component';
import { UserComponent } from './pages/user.component';
import { ObscenityPipe } from './pipes/obscenity.pipe';
import { PrimeNGModule } from './primeng.module';
import { AuthService } from './service/auth.service';
import { CardMarketService } from './service/card-market.service';
import { CardTraderService } from './service/card-trader.service';
import { DatabaseService } from './service/database.service';
import { DigimonBackendService } from './service/digimon-backend.service';
import { DigimonEffects } from './store/digimon.effects';

import * as DigimonCards from './store/reducers/digimon-card.reducers';
import * as Digimon from './store/reducers/digimon.reducers';
import * as Save from './store/reducers/save.reducer';
import { SmallCardComponent } from './components/molecules/small-card.component';

@NgModule({
  declarations: [
    AppComponent,
    FullCardComponent,
    HomeComponent,
    FilterAndSearchComponent,
    CardListComponent,
    UserComponent,
    HomeComponent,
    NavbarComponent,
    DeckCardComponent,
    SortButtonsComponent,
    ExportDeckDialogComponent,
    ImportDeckDialogComponent,
    PaginationCardListComponent,
    ViewCardDialogComponent,
    CommunityComponent,
    ChangeAccessorieDialogComponent,
    CollectionStatsDialogComponent,
    SearchComponent,
    FilterSideBoxComponent,
    ChartContainersComponent,
    ChartContainerComponent,
    RangeSliderComponent,
    FilterButtonComponent,
    UserComponent,
    DeckStatsComponent,
    CollectionViewComponent,
    DeckViewComponent,
    DeckMetadataComponent,
    DeckToolbarComponent,
    UserStatsComponent,
    CollectionComponent,
    DecksComponent,
    CollectionCircleComponent,
    MultiButtonsComponent,
    ObscenityPipe,
    ChangelogDialogComponent,
    DeckbuilderComponent,
    CollectionPageComponent,
    SettingsDialogComponent,
    BlogComponent,
    TierlistComponent,
    DeckStatisticsComponent,
    ColorSpreadComponent,
    LevelSpreadComponent,
    DdtoSpreadComponent,
    TestPageComponent,
    SmallCardComponent,
    ProxyPrintDialogComponent,
  ],
  imports: [
    ComponentsModule,
    CKEditorModule,
    FontAwesomeModule,
    PrimeNGModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,

    NgxSliderModule,

    LazyLoadImageModule,

    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireAnalyticsModule,

    ToastrModule.forRoot({}),

    StoreModule.forRoot(
      {
        digimon: Digimon.digimonReducer,
        digimonCards: DigimonCards.digimonCardReducer,
        save: Save.saveReducer,
      },
      {
        initialState: {
          digimon: Digimon.initialState,
          digimonCards: DigimonCards.initialState,
          save: Save.emptySave,
        },
      }
    ),
    StoreDevtoolsModule.instrument({
      name: 'Digimon Card Collector',
      logOnly: environment.production,
    }),
    EffectsModule.forRoot([DigimonEffects]),
    PaginatorModule,
    InputSwitchModule,
  ],
  exports: [ObscenityPipe],
  providers: [
    ReactiveFormsModule,
    AuthService,
    DatabaseService,
    DigimonBackendService,
    CardMarketService,
    CardTraderService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
