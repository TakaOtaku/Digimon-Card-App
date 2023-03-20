import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAnalyticsModule } from '@angular/fire/compat/analytics';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ToastrModule } from 'ngx-toastr';
import { BlockUIModule } from 'primeng/blockui';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DigimonStoreModule } from './digimon-store.module';
import { BlogModule } from './features/blog/blog.module';
import { CollectionModule } from './features/collection/collection.module';
import { CommunityModule } from './features/community/community.module';
import { DeckbuilderModule } from './features/deckbuilder/deckbuilder.module';
import { DecksModule } from './features/decks/decks.module';
import { HomeModule } from './features/home/home.module';
import { ProductsModule } from './features/products/products.module';
import { ProfileModule } from './features/profile/profile.module';
import { SharedModule } from './features/shared/shared.module';
import { TestModule } from './features/test/test.module';
import { AuthService } from './service/auth.service';
import { DigimonBackendService } from './service/digimon-backend.service';
import { HammerModule } from '../../node_modules/@angular/platform-browser';

@NgModule({
  declarations: [AppComponent],
  imports: [
    ProfileModule,
    SharedModule,
    HomeModule,
    TestModule,
    ProductsModule,
    DecksModule,
    DeckbuilderModule,
    CommunityModule,
    CollectionModule,
    BlogModule,

    FontAwesomeModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    HammerModule,

    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireAnalyticsModule,

    ToastrModule.forRoot({}),

    DigimonStoreModule,

    DialogModule,
    ConfirmDialogModule,
    ToastModule,
    BlockUIModule,
    ProgressSpinnerModule,
  ],
  providers: [ReactiveFormsModule, AuthService, DigimonBackendService],
  bootstrap: [AppComponent],
})
export class AppModule {}
