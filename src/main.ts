import { DatePipe } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { enableProdMode, importProvidersFrom } from '@angular/core';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAnalyticsModule } from '@angular/fire/compat/analytics';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { bootstrapApplication, BrowserModule, HammerModule } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { PreloadAllModules, provideRouter, Routes, withPreloading } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import 'hammerjs';
import { ToastrModule } from 'ngx-toastr';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BlockUIModule } from 'primeng/blockui';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { AppComponent } from './app/app.component';
import { BlogPageComponent } from './app/features/blog/blog-page.component';
import { CollectionPageComponent } from './app/features/collection/collection-page.component';
import { CommunityPageComponent } from './app/features/community/community-page.component';
import { DeckbuilderPageComponent } from './app/features/deckbuilder/deckbuilder-page.component';
import { DecksPageComponent } from './app/features/decks/decks-page.component';
import { HomePageComponent } from './app/features/home/home-page.component';
import { ProductsComponent } from './app/features/products/products.component.ts';
import { ProfilePageComponent } from './app/features/profile/profile-page.component';
import { TestPageComponent } from './app/features/test/test-page.component';
import { AuthService } from './app/service/auth.service';
import { DigimonBackendService } from './app/service/digimon-backend.service';
import { DigimonEffects } from './app/store/digimon.effects';
import * as DigimonCards from './app/store/reducers/digimon-card.reducers';
import * as Digimon from './app/store/reducers/digimon.reducers';
import * as Save from './app/store/reducers/save.reducer';

import { environment } from './environments/environment';

const routes: Routes = [
  {
    path: 'test',
    component: TestPageComponent,
  },
  {
    path: 'community',
    component: CommunityPageComponent,
  },
  {
    path: 'decks',
    component: DecksPageComponent,
  },
  {
    path: 'products',
    component: ProductsComponent,
  },
  {
    path: 'user',
    component: ProfilePageComponent,
  },
  {
    path: 'user/:id',
    component: ProfilePageComponent,
  },
  {
    path: 'deckbuilder/user/:userId/deck/:deckId',
    component: DeckbuilderPageComponent,
  },
  {
    path: 'deckbuilder/:id',
    component: DeckbuilderPageComponent,
  },
  {
    path: 'deckbuilder',
    component: DeckbuilderPageComponent,
  },
  {
    path: 'collection',
    component: CollectionPageComponent,
  },
  {
    path: 'blog/:id',
    component: BlogPageComponent,
  },
  { path: '**', component: HomePageComponent },
];

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      FontAwesomeModule,
      FormsModule,
      ReactiveFormsModule,
      BrowserModule,
      HammerModule,
      AngularFireModule.initializeApp(environment.firebaseConfig),
      AngularFireAuthModule,
      AngularFireDatabaseModule,
      AngularFireAnalyticsModule,
      ToastrModule.forRoot({}),
      DialogModule,
      ConfirmDialogModule,
      ToastModule,
      BlockUIModule,
      ProgressSpinnerModule,
      TooltipModule
    ),

    provideRouter(routes, withPreloading(PreloadAllModules)),

    provideStore(
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
    provideEffects([DigimonEffects]),
    provideStoreDevtools({
      name: 'Digimon Card Collector',
      logOnly: environment.production,
    }),

    ReactiveFormsModule,
    AuthService,
    DigimonBackendService,
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
    MessageService,
    ConfirmationService,
    DatePipe,
  ],
  // eslint-disable-next-line no-console
}).catch((err) => console.error(err));
