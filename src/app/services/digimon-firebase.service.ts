import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MessageService } from 'primeng/api';
import {
  catchError,
  forkJoin,
  from,
  map,
  Observable,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { IDeck, ISave } from '../../models';
import { DigimonBackendService } from './digimon-backend.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class DigimonFirebaseService {
  constructor(
    private firestore: AngularFirestore,
    private digimonBackendService: DigimonBackendService,
    private messageService: MessageService,
    private authService: AuthService,
  ) {}

  /**
   * Migrates user decks and saves from your current backend to Firebase Firestore
   * @returns Observable that completes when migration is done
   */
  migrateToFirebase(): Observable<boolean> {
    if (!this.authService.isLoggedIn || !this.authService.isAdmin()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Migration Failed',
        detail:
          'You must be logged in with admin privileges to migrate data to Firebase',
      });
      return of(false);
    }

    this.messageService.add({
      severity: 'info',
      summary: 'Migration Started',
      detail: 'Starting to migrate your data to Firebase Firestore...',
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
        // Prepare batch operations
        const batch = this.firestore.firestore.batch();
        let operationsCount = 0;
        const MAX_BATCH_SIZE = 500; // Firestore batch limit
        const batches = [batch];

        // Process all decks
        if (decks && decks.length > 0) {
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
            const deckRef = this.firestore
              .collection('decks')
              .doc(deck.id).ref;

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
        }

        // Process all saves
        if (saves && saves.length > 0) {
          saves.forEach((save) => {
            // Prepare save data with metadata
            const saveWithMetadata = {
              ...save,
              updatedAt: new Date(),
            };

            // Get reference to the save document
            const saveRef = this.firestore
              .collection('saves')
              .doc(save.uid).ref;

            // Get current batch
            const currentBatch = batches[batches.length - 1];

            // Add to current batch
            currentBatch.set(saveRef, saveWithMetadata, { merge: true });
            operationsCount++;

            // If we reach the batch limit, create a new batch
            if (operationsCount >= MAX_BATCH_SIZE) {
              const newBatch = this.firestore.firestore.batch();
              batches.push(newBatch);
              operationsCount = 0;
            }
          });
        }

        // Execute all batch operations
        const batchCommits = batches.map((batch) => from(batch.commit()));

        return forkJoin(batchCommits).pipe(
          map(() => true),
          tap(() => {
            this.messageService.add({
              severity: 'success',
              summary: 'Migration Complete',
              detail: `Successfully migrated ${decks?.length || 0} decks and ${
                saves?.length || 0
              } saves to Firebase Firestore`,
            });
          }),
          catchError((err) => {
            console.error('Migration error:', err);
            this.messageService.add({
              severity: 'error',
              summary: 'Migration Failed',
              detail: 'Error during migration to Firestore. Please try again.',
            });
            return of(false);
          }),
        );
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
   * Gets a save by user ID from Firestore
   * @param userId The user ID
   */
  getSave(userId: string): Observable<ISave | null> {
    return this.firestore
      .collection('saves')
      .doc<ISave>(userId)
      .valueChanges()
      .pipe(map((save) => save || null));
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
   * Updates a save in Firestore
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
      updatedAt: new Date(),
    };

    return from(
      this.firestore
        .collection('saves')
        .doc(save.uid)
        .set(saveWithMetadata, { merge: true }),
    );
  }

  /**
   * Deletes a deck from Firestore
   * @param deckId The ID of the deck to delete
   */
  deleteDeck(deckId: string): Observable<void> {
    return from(this.firestore.collection('decks').doc(deckId).delete());
  }
}
