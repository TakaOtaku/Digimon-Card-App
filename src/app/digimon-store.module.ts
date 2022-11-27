import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { DigimonEffects } from './store/digimon.effects';
import * as DigimonCards from './store/reducers/digimon-card.reducers';
import * as Digimon from './store/reducers/digimon.reducers';
import * as Save from './store/reducers/save.reducer';

@NgModule({
  imports: [
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
  ],
})
export class DigimonStoreModule {}
