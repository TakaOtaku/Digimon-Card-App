import { DatePipe } from '@angular/common';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  ApplicationConfig,
  EnvironmentProviders,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import {
  browserPopupRedirectResolver,
  browserSessionPersistence, getAuth,
  initializeAuth,
  provideAuth
} from '@angular/fire/auth';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  PreloadAllModules,
  provideRouter,
  withPreloading,
} from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ToastrModule } from 'ngx-toastr';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BlockUIModule } from 'primeng/blockui';
import { providePrimeNG } from 'primeng/config';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { environment } from '../environments/environment';
import { DigimonPreset } from './digimon-preset';
import { routes } from './routes';
import { AuthService } from './services/auth.service';
import { DigimonBackendService } from './services/digimon-backend.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideAnimationsAsync(),
    importProvidersFrom(
      FontAwesomeModule,
      FormsModule,
      ReactiveFormsModule,
      BrowserModule,
      HammerModule,
      ToastrModule.forRoot({}),
      DialogModule,
      ConfirmDialogModule,
      ToastModule,
      BlockUIModule,
      ProgressSpinnerModule,
      TooltipModule,
    ),

    providePrimeNG({
      theme: {
        preset: DigimonPreset,
      },
    }),

    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),

    ReactiveFormsModule,
    AuthService,
    DigimonBackendService,
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
    MessageService,
    ConfirmationService,
    DatePipe,
  ],
};
