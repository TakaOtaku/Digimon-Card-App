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
import { SortButtonsComponent } from './components/atoms/sort-buttons/sort-buttons.component';
import { ChartContainersComponent } from './components/molecules/chart-containers/chart-containers.component';
import { CollectionCircleComponent } from './components/molecules/collection-circle/collection-circle.component';
import { CollectionComponent } from './components/molecules/collection/collection.component';
import { ColorSpreadComponent } from './components/molecules/color-spread/color-spread.component';
import { DdtoSpreadComponent } from './components/molecules/ddto-spread/ddto-spread.component';
import { DeckStatisticsComponent } from './components/molecules/deck-statistics/deck-statistics.component';
import { DeckCardComponent } from './components/molecules/deck/deck-card/deck-card.component';
import { DeckMetadataComponent } from './components/molecules/deck/deck-metadata/deck-metadata.component';
import { DeckStatsComponent } from './components/molecules/deck/deck-stats/deck-stats.component';
import { DeckToolbarComponent } from './components/molecules/deck/deck-toolbar/deck-toolbar.component';
import { DecksComponent } from './components/molecules/decks/decks.component';
import { ChangeAccessorieDialogComponent } from './components/molecules/dialogs/change-accessorie-dialog/change-accessorie-dialog.component';
import { ChangelogDialogComponent } from './components/molecules/dialogs/changelog-dialog/changelog-dialog.component';
import { CollectionStatsDialogComponent } from './components/molecules/dialogs/collection-stats-dialog/collection-stats-dialog.component';
import { ExportDeckDialogComponent } from './components/molecules/dialogs/export-deck-dialog/export-deck-dialog.component';
import { ImportDeckDialogComponent } from './components/molecules/dialogs/import-deck-dialog/import-deck-dialog.component';
import { SettingsDialogComponent } from './components/molecules/dialogs/settings-dialog/settings-dialog.component';
import { ViewCardDialogComponent } from './components/molecules/dialogs/view-card-dialog/view-card-dialog.component';
import { FullCardComponent } from './components/molecules/full-card/full-card.component';
import { LevelSpreadComponent } from './components/molecules/level-spread/level-spread.component';
import { MultiButtonsComponent } from './components/molecules/multi-buttons/multi-buttons.component';
import { RangeSliderComponent } from './components/molecules/range-slider/range-slider.component';
import { SearchComponent } from './components/molecules/search/search.component';
import { TierlistComponent } from './components/molecules/tierlist/tierlist.component';
import { UserStatsComponent } from './components/molecules/user-stats/user-stats.component';
import { CardListComponent } from './components/organisms/card-list/card-list.component';
import { CollectionViewComponent } from './components/organisms/collection-view/collection-view.component';
import { DeckViewComponent } from './components/organisms/deck-view/deck-view.component';
import { FilterAndSearchComponent } from './components/organisms/filter/filter-and-search/filter-and-search.component';
import { FilterButtonComponent } from './components/organisms/filter/filter-button/filter-button.component';
import { FilterSideBoxComponent } from './components/organisms/filter/filter-side-box/filter-side-box.component';
import { NavbarComponent } from './components/organisms/navbar/navbar.component';
import { PaginationCardListComponent } from './components/organisms/pagination-card-list/pagination-card-list.component';
import { BlogComponent } from './pages/blog/blog.component';
import { CollectionPageComponent } from './pages/collection-page/collection-page.component';
import { CommunityComponent } from './pages/community/community.component';
import { DeckbuilderComponent } from './pages/deckbuilder/deckbuilder.component';
import { HomeComponent } from './pages/home/home.component';
import { TestPageComponent } from './pages/test-page/test-page.component';
import { UserComponent } from './pages/user/user.component';
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
