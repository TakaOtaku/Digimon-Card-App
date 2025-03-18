import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { MessageService } from 'primeng/api';
import {
  catchError,
  first,
  forkJoin,
  from,
  map,
  Observable,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { CARDSET, emptySave, emptySettings, IDeck, ISave } from '../../models';
import { DigimonBackendService } from './digimon-backend.service';

@Injectable({
  providedIn: 'root',
})
export class DigimonFirebaseService {
  constructor(
    private firestore: AngularFirestore,
    private realtimeDb: AngularFireDatabase,
    private digimonBackendService: DigimonBackendService,
    private messageService: MessageService,
  ) {}

  /**
   * Migrates user decks and saves from your current backend to Firebase
   * Decks go to Firestore, Saves go to Realtime Database
   * @returns Observable that completes when migration is done
   */
  migrateToFirebase(): Observable<boolean> {
    this.messageService.add({
      severity: 'info',
      summary: 'Migration Started',
      detail: 'Starting to migrate your data to Firebase...',
    });

    // Get decks and saves from current backend
    return forkJoin({
      decks: this.digimonBackendService.getDecks().pipe(
        catchError((err) => {
          console.error('Error fetching decks:', err);
          return of([]);
        }),
      ),
      saves: this.digimonBackendService.getSaves().pipe(
        catchError((err) => {
          console.error('Error fetching saves:', err);
          return of(null);
        }),
      ),
    }).pipe(
      switchMap(({ decks, saves }) => {
        // Prepare firestore batch for decks
        const batch = this.firestore.firestore.batch();
        let operationsCount = 0;
        const MAX_BATCH_SIZE = 500; // Firestore batch limit
        const batches = [batch];

        // Process all decks in Firestore
        const deckOperations = this.migrateDecksToFirestore(decks, batches);

        // Process all saves in Realtime Database
        const saveOperations =
          saves && saves.length > 0
            ? saves.map((save) => this.migrateSaveToRealtimeDb(save))
            : [];

        // Combine all operations
        const allOperations = [...deckOperations, ...saveOperations];

        // If no operations, return success
        if (allOperations.length === 0) {
          this.messageService.add({
            severity: 'warn',
            summary: 'No Data to Migrate',
            detail: 'No valid decks or saves found to migrate.',
          });
          return of(true);
        }

        // Execute all operations
        return forkJoin(allOperations).pipe(
          map(() => true),
          tap(() => {
            this.messageService.add({
              severity: 'success',
              summary: 'Migration Complete',
              detail: `Successfully migrated ${decks?.length || 0} decks and ${
                saves?.length || 0
              } saves to Firebase`,
            });
          }),
          catchError((err) => {
            console.error('Migration error:', err);
            this.messageService.add({
              severity: 'error',
              summary: 'Migration Failed',
              detail: 'Error during migration to Firebase. Please try again.',
            });
            return of(false);
          }),
        );
      }),
    );
  }

  /**
   * Migrates decks to Firestore
   */
  private migrateDecksToFirestore(
    decks: IDeck[],
    batches: any[],
  ): Observable<any>[] {
    if (!decks || decks.length === 0) {
      return [];
    }

    let operationsCount = 0;
    const MAX_BATCH_SIZE = 500;

    // Process all decks
    decks.forEach((deck: IDeck) => {
      // Extract tag names for efficient querying
      const tagNames = deck.tags ? deck.tags.map((tag) => tag.name) : [];

      // Prepare deck data with metadata
      const deckWithMetadata = {
        ...deck,
        tagNames: tagNames,
        updatedAt: new Date(),
      };

      // Get reference to the deck document
      const deckRef = this.firestore.collection('decks').doc(deck.id).ref;

      // Get current batch or create a new one if needed
      const currentBatch = batches[batches.length - 1];

      // Add to current batch
      currentBatch.set(deckRef, deckWithMetadata, { merge: true });
      operationsCount++;

      // If we reach the batch limit, create a new batch
      if (operationsCount >= MAX_BATCH_SIZE) {
        const newBatch = this.firestore.firestore.batch();
        batches.push(newBatch);
        operationsCount = 0;
      }
    });

    // Execute all batch operations
    return batches.map((batch) => from(batch.commit()));
  }

  /**
   * Migrates a single save to Realtime Database
   */
  private migrateSaveToRealtimeDb(save: ISave): Observable<any> {
    if (!save || !save.uid) {
      return of(null);
    }

    // Add metadata to the save
    const saveWithMetadata = {
      ...save,
      updatedAt: new Date().toISOString(),
    };

    // Store in Realtime Database
    return from(
      this.realtimeDb.object(`saves/${save.uid}`).set(saveWithMetadata),
    ).pipe(
      catchError((err) => {
        console.error(`Error migrating save for user ${save.uid}:`, err);
        return of(null);
      }),
    );
  }

  /**
   * Gets decks that contain any of the specified tags using Firestore queries
   * @param tags Array of tag names to filter by
   * @returns Observable of filtered deck array
   */
  getDecksWithTags(tags: string[]): Observable<IDeck[]> {
    if (!tags || tags.length === 0) {
      // Return all decks if no tags specified
      return this.firestore.collection<IDeck>('decks').valueChanges();
    }

    // Use Firestore's array-contains-any for direct querying
    // This can only match against one array field at a time
    // The maximum number of values is 10 for a single query
    if (tags.length <= 10) {
      return this.firestore
        .collection<IDeck>('decks', (ref) =>
          ref.where('tagNames', 'array-contains-any', tags),
        )
        .valueChanges();
    } else {
      // If more than 10 tags, we need to split into multiple queries and combine results
      const tagChunks = this.chunkArray(tags, 10);

      const queryObservables = tagChunks.map((tagChunk) =>
        this.firestore
          .collection<IDeck>('decks', (ref) =>
            ref.where('tagNames', 'array-contains-any', tagChunk),
          )
          .valueChanges(),
      );

      return forkJoin(queryObservables).pipe(
        map((results) => {
          // Combine and deduplicate results
          const combinedDecks: IDeck[] = [];
          const deckIds = new Set<string>();

          results.forEach((decks) => {
            decks.forEach((deck) => {
              if (!deckIds.has(deck.id)) {
                deckIds.add(deck.id);
                combinedDecks.push(deck);
              }
            });
          });

          return combinedDecks;
        }),
      );
    }
  }

  /**
   * Helper method to split an array into chunks of specified size
   */
  private chunkArray<T>(array: T[], chunkSize: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }

  /**
   * Gets a deck by ID from Firestore
   * @param id The deck ID
   */
  getDeck(id: string): Observable<IDeck | null> {
    return this.firestore
      .collection('decks')
      .doc<IDeck>(id)
      .valueChanges()
      .pipe(map((deck) => deck || null));
  }

  /**
   * Gets all decks from Firestore
   */
  getAllDecks(): Observable<IDeck[]> {
    return this.firestore.collection<IDeck>('decks').valueChanges();
  }

  /**
   * Gets a save by user ID from Realtime Database
   * @param userId The user ID
   */
  getSave(userId: string): Observable<ISave> {
    if (!userId) {
      return of(emptySave);
    }

    return this.realtimeDb
      .object<ISave>(`saves/${userId}`)
      .valueChanges()
      .pipe(
        map((save) => save || emptySave),
        map((save) => this.checkSaveValidity(save)),
        catchError((err) => {
          console.error(`Error fetching save for user ${userId}:`, err);
          return of(emptySave);
        }),
      );
  }

  /**
   * Updates a deck in Firestore
   * @param deck The deck to update
   */
  updateDeck(deck: IDeck): Observable<void> {
    // Ensure deck has an ID
    if (!deck.id) {
      deck.id = this.firestore.createId();
    }

    // Extract tag names for querying
    const tagNames = deck.tags ? deck.tags.map((tag) => tag.name) : [];

    // Add metadata
    const deckWithMetadata = {
      ...deck,
      tagNames,
      updatedAt: new Date(),
    };

    return from(
      this.firestore
        .collection('decks')
        .doc(deck.id)
        .set(deckWithMetadata, { merge: true }),
    );
  }

  /**
   * Updates a save in Realtime Database
   * @param save The save to update
   */
  updateSave(save: ISave): Observable<void> {
    if (!save.uid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Update Failed',
        detail: 'Save data is missing user ID',
      });
      return of(undefined);
    }

    // Add metadata
    const saveWithMetadata = {
      ...save,
      updatedAt: new Date().toISOString(),
    };

    // Save to Realtime Database
    return from(
      this.realtimeDb.object(`saves/${save.uid}`).update(saveWithMetadata),
    ).pipe(
      catchError((err) => {
        console.error(`Error updating save for user ${save.uid}:`, err);
        this.messageService.add({
          severity: 'error',
          summary: 'Update Failed',
          detail: 'Error saving data. Please try again.',
        });
        return of(undefined);
      }),
    );
  }

  /**
   * Deletes a deck from Firestore
   * @param deckId The ID of the deck to delete
   */
  deleteDeck(deckId: string): Observable<void> {
    return from(this.firestore.collection('decks').doc(deckId).delete());
  }

  checkSaveValidity(save: any, user?: any): ISave {
    let changedSave = false;
    if (user) {
      if (!save.collection) {
        save = { ...save, collection: user.save.collection };
        changedSave = true;
      }
      if (!save.decks) {
        save = { ...save, decks: user.save.decks };
        changedSave = true;
      }
      if (!save.settings) {
        save = { ...save, settings: user.save.settings };
        changedSave = true;
      }
      if (!save.uid) {
        save = { ...save, uid: user.uid };
        changedSave = true;
      }
      if (!save.displayName) {
        save = { ...save, displayName: user.displayName };
        changedSave = true;
      }
      if (!save.photoURL) {
        save = { ...save, photoURL: user.photoURL };
        changedSave = true;
      }
    } else {
      if (!save.collection) {
        save = { ...save, collection: [] };
        changedSave = true;
      }
      if (!save.decks) {
        save = { ...save, decks: [] };
        changedSave = true;
      }
      if (!save.settings) {
        save = { ...save, settings: emptySettings };
        changedSave = true;
      }
      if (!save.uid) {
        save = { ...save, uid: '' };
        changedSave = true;
      }
      if (!save.displayName) {
        save = { ...save, displayName: '' };
        changedSave = true;
      }
      if (!save.photoURL) {
        save = { ...save, photoURL: '' };
        changedSave = true;
      }
    }

    if (
      save.settings.cardSet === undefined ||
      save.settings.cardSet === 'Overwrite' ||
      +save.settings.cardSet >>> 0
    ) {
      save = {
        ...save,
        settings: { ...save.settings, cardSet: CARDSET.English },
      };
      changedSave = true;
    }
    if (save.settings.collectionMinimum === undefined) {
      save = { ...save, settings: { ...save.settings, collectionMinimum: 1 } };
      changedSave = true;
    }
    if (save.settings.showPreRelease === undefined) {
      save = { ...save, settings: { ...save.settings, showPreRelease: true } };
      changedSave = true;
    }
    if (save.settings.showStampedCards === undefined) {
      save = {
        ...save,
        settings: { ...save.settings, showStampedCards: true },
      };
      changedSave = true;
    }
    if (save.settings.showAACards === undefined) {
      save = { ...save, settings: { ...save.settings, showAACards: true } };
      changedSave = true;
    }
    if (save.settings.showUserStats === undefined) {
      save = { ...save, settings: { ...save.settings, showUserStats: true } };
      changedSave = true;
    }

    if (changedSave && user?.uid) {
      this.updateSave(save).pipe(first()).subscribe();
    }
    return save;
  }
}
