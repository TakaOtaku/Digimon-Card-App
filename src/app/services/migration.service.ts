import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, throwError, forkJoin, of } from 'rxjs';
import { map, catchError, retry, delay, concatMap } from 'rxjs/operators';
import { IDeck, ISave, IUser } from '@models';
import { environment } from '../../environments/environment';
import { DigimonCardStore } from '../store/digimon-card.store';
import { setDeckImage, setTags } from '../functions/digimon-card.functions';

/**
 * Migration Service
 * 
 * This service handles the migration of data from the legacy backend (MySQL) 
 * to the new MongoDB backend. It provides methods to:
 * - Test connections to both backends
 * - Migrate users and decks individually or in bulk
 * - Track migration progress
 * - Clear MongoDB data if needed
 */

export interface MigrationResult {
    success: boolean;
    message: string;
    data?: any;
    error?: any;
}

export interface MigrationProgress {
    total: number;
    processed: number;
    successful: number;
    failed: number;
    currentItem?: string;
}

export interface ComparisonResult {
    users: {
        unmigrated: ISave[];
        changed: { legacy: ISave; mongo: any }[];
        synced: number;
        legacyTotal: number;
        mongoTotal: number;
    };
    decks: {
        unmigrated: IDeck[];
        changed: { legacy: IDeck; mongo: any }[];
        synced: number;
        legacyTotal: number;
        mongoTotal: number;
    };
}

@Injectable({
    providedIn: 'root',
})
export class MigrationService {
    // Backend URLs
    private readonly mongoBackendUrl = environment.apiBaseUrl;
    private readonly mongoMigrationUrl = environment.apiBaseUrl.replace(/api\/$/, 'api/migration/');
    private readonly mongoBackendRootUrl = this.mongoBackendUrl.replace(/\/api\/?$/, '/');
    private readonly legacyBackendUrl = environment.legacyApiBaseUrl;

    private digimonCardStore = inject(DigimonCardStore);

    constructor(private http: HttpClient) { }

    // ===== CONNECTION TESTING =====

    /**
     * Test connection to the new MongoDB backend
     * @returns Observable with connection result
     */
    testMongoConnection(): Observable<MigrationResult> {
        return this.http.get<any>(this.mongoBackendRootUrl, { observe: 'response' }).pipe(
            map((response) => {
                // Any successful response (including 304) means the server is reachable
                return this.createSuccessResult('Successfully connected to MongoDB backend');
            }),
            catchError((error: HttpErrorResponse) =>
                of(this.createErrorResult('Failed to connect to MongoDB backend', error.message))
            )
        );
    }

    /**
     * Test connection to the legacy backend
     * @returns Observable with connection result and user count
     */
    testLegacyConnection(): Observable<MigrationResult> {
        return this.http.get<any[]>(`${this.legacyBackendUrl}users`, { observe: 'response' }).pipe(
            map((response) => {
                const users = response.body || [];
                return this.createSuccessResult(
                    `Successfully connected to legacy backend. Found ${users.length} users`,
                    { userCount: users.length }
                );
            }),
            catchError((error: HttpErrorResponse) =>
                of(this.createErrorResult('Failed to connect to legacy backend', error.message))
            )
        );
    }

    // ===== DATA FETCHING =====

    /**
     * Get all users from the legacy backend with proper parsing
     * @returns Observable array of parsed user saves
     */
    getLegacyUsers(): Observable<ISave[]> {
        return this.http.get<any[]>(`${this.legacyBackendUrl}users`).pipe(
            map((saves) => this.parseUserSaves(saves)),
            retry(3),
            catchError(this.handleError)
        );
    }

    /**
     * Get all decks from the legacy backend with proper parsing
     * @returns Observable array of parsed decks
     */
    getLegacyDecks(): Observable<IDeck[]> {
        return this.http.get<any[]>(`${this.legacyBackendUrl}decks`).pipe(
            map((decks) => this.parseDecks(decks)),
            retry(3),
            catchError(this.handleError)
        );
    }

    /**
     * Get all users from MongoDB backend (fetches all pages if paginated)
     * @returns Observable array of all users
     */
    getMongoUsers(): Observable<any[]> {
        return this.http.get<any>(`${this.mongoBackendUrl}users?limit=1000`).pipe(
            concatMap(firstResponse => {
                // If it's a plain array, return it directly
                if (Array.isArray(firstResponse)) {
                    return of(firstResponse);
                }

                // Handle paginated response
                if (firstResponse && firstResponse.pagination) {
                    const totalPages = firstResponse.pagination.totalPages || 1;
                    const firstPageUsers = firstResponse.users || [];

                    console.log(`MongoDB users: ${firstResponse.pagination.totalUsers || firstPageUsers.length} total users, ${totalPages} pages`);

                    // If only one page, return first page results
                    if (totalPages <= 1) {
                        return of(firstPageUsers);
                    }

                    // Fetch remaining pages
                    const pageRequests: Observable<any[]>[] = [];
                    for (let page = 2; page <= totalPages; page++) {
                        pageRequests.push(
                            this.http.get<any>(`${this.mongoBackendUrl}users?page=${page}&limit=1000`).pipe(
                                map(response => {
                                    if (Array.isArray(response)) return response;
                                    if (response && Array.isArray(response.users)) return response.users;
                                    return [];
                                }),
                                catchError(() => of([]))
                            )
                        );
                    }

                    // Combine first page with all other pages
                    if (pageRequests.length === 0) {
                        return of(firstPageUsers);
                    }

                    return forkJoin(pageRequests).pipe(
                        map(allPages => {
                            const allUsers = [...firstPageUsers];
                            allPages.forEach(pageUsers => allUsers.push(...pageUsers));
                            console.log(`MongoDB users: Fetched ${allUsers.length} total users from ${totalPages} pages`);
                            return allUsers;
                        })
                    );
                }

                // Handle { users: [...] } without pagination
                if (firstResponse && Array.isArray(firstResponse.users)) {
                    return of(firstResponse.users);
                }

                // Fallback for { data: [...] } format
                if (firstResponse && Array.isArray(firstResponse.data)) {
                    return of(firstResponse.data);
                }

                return of([]);
            }),
            retry(2),
            catchError(error => {
                console.error('Error fetching MongoDB users:', error);
                return of([]);
            })
        );
    }

    /**
     * Get all decks from MongoDB backend (fetches all pages)
     * @returns Observable array of all decks
     */
    getMongoDecks(): Observable<any[]> {
        // First, get the first page to determine total pages
        return this.http.get<any>(`${this.mongoBackendUrl}decks?limit=500`).pipe(
            concatMap(firstResponse => {
                console.log('MongoDB decks first page response:', firstResponse);

                // If it's a plain array, return it directly
                if (Array.isArray(firstResponse)) {
                    return of(firstResponse);
                }

                // Handle paginated response
                if (firstResponse && firstResponse.pagination) {
                    const totalPages = firstResponse.pagination.totalPages || 1;
                    const firstPageDecks = firstResponse.decks || [];

                    console.log(`MongoDB decks: ${firstResponse.pagination.totalDecks} total decks, ${totalPages} pages`);

                    // If only one page, return first page results
                    if (totalPages <= 1) {
                        return of(firstPageDecks);
                    }

                    // Fetch remaining pages
                    const pageRequests: Observable<any[]>[] = [];
                    for (let page = 2; page <= totalPages; page++) {
                        pageRequests.push(
                            this.http.get<any>(`${this.mongoBackendUrl}decks?page=${page}&limit=500`).pipe(
                                map(response => {
                                    if (Array.isArray(response)) return response;
                                    if (response && Array.isArray(response.decks)) return response.decks;
                                    return [];
                                }),
                                catchError(() => of([]))
                            )
                        );
                    }

                    // Combine first page with all other pages
                    if (pageRequests.length === 0) {
                        return of(firstPageDecks);
                    }

                    return forkJoin(pageRequests).pipe(
                        map(allPages => {
                            const allDecks = [...firstPageDecks];
                            allPages.forEach(pageDecks => allDecks.push(...pageDecks));
                            console.log(`MongoDB decks: Fetched ${allDecks.length} total decks from ${totalPages} pages`);
                            return allDecks;
                        })
                    );
                }

                // Fallback for { data: [...] } format
                if (firstResponse && Array.isArray(firstResponse.data)) {
                    return of(firstResponse.data);
                }

                console.warn('MongoDB decks: Unknown response format, returning empty array');
                return of([]);
            }),
            retry(2),
            catchError(error => {
                console.error('Error fetching MongoDB decks:', error);
                return of([]);
            })
        );
    }

    // ===== COMPARISON METHODS =====

    /**
     * Fix deck images for all decks that still have the default BT1-001 or empty imageCardId.
     * Fetches all decks from MongoDB, computes the correct imageCardId client-side,
     * and sends a bulk PATCH to persist the fix.
     */
    fixDeckImages(): Observable<MigrationResult> {
        const allCards = this.digimonCardStore.cards();
        if (!allCards || allCards.length === 0) {
            return of({ success: false, message: 'Card data not loaded yet. Please wait and try again.' });
        }

        return this.getMongoDecks().pipe(
            concatMap(decks => {
                const fixes: { id: string; imageCardId: string }[] = [];

                for (const deck of decks) {
                    if (!deck.imageCardId || deck.imageCardId === 'BT1-001') {
                        if (deck.cards && deck.cards.length > 0) {
                            const imageCard = setDeckImage(deck, allCards);
                            if (imageCard && imageCard.id && imageCard.id !== 'BT1-001') {
                                fixes.push({ id: deck._id || deck.id, imageCardId: imageCard.id });
                            }
                        }
                    }
                }

                if (fixes.length === 0) {
                    return of({ success: true, message: 'No decks need image fixes.' });
                }

                console.log(`Fixing ${fixes.length} deck images...`);

                // Send in batches of 500
                const batches: { id: string; imageCardId: string }[][] = [];
                for (let i = 0; i < fixes.length; i += 500) {
                    batches.push(fixes.slice(i, i + 500));
                }

                const batchRequests = batches.map((batch, idx) =>
                    this.http.patch<any>(`${this.mongoMigrationUrl}decks/fix-images`, batch).pipe(
                        map(res => {
                            console.log(`Batch ${idx + 1}/${batches.length}: ${res.modified} modified`);
                            return res;
                        }),
                        catchError(err => {
                            console.error(`Batch ${idx + 1} failed:`, err);
                            return of({ matched: 0, modified: 0, error: true });
                        })
                    )
                );

                return forkJoin(batchRequests).pipe(
                    map(results => {
                        const totalModified = results.reduce((sum, r) => sum + (r.modified || 0), 0);
                        return {
                            success: true,
                            message: `Fixed ${totalModified} deck images out of ${fixes.length} identified.`,
                        };
                    })
                );
            }),
            catchError(err => of({ success: false, message: 'Error fixing deck images: ' + (err.message || err) }))
        );
    }

    /**
     * Compare data between legacy and MongoDB backends
     * @returns Observable with comparison results
     */
    compareData(): Observable<ComparisonResult> {
        return forkJoin({
            legacyUsers: this.getLegacyUsers().pipe(catchError(() => of([]))),
            legacyDecks: this.getLegacyDecks().pipe(catchError(() => of([]))),
            mongoUsers: this.getMongoUsers(),
            mongoDecks: this.getMongoDecks()
        }).pipe(
            map(({ legacyUsers, legacyDecks, mongoUsers, mongoDecks }) => {
                // Ensure all are arrays
                const safeMongoUsers = Array.isArray(mongoUsers) ? mongoUsers : [];
                const safeMongoDecks = Array.isArray(mongoDecks) ? mongoDecks : [];
                const safeLegacyUsers = Array.isArray(legacyUsers) ? legacyUsers : [];
                const safeLegacyDecks = Array.isArray(legacyDecks) ? legacyDecks : [];

                const userComparison = this.compareUsers(safeLegacyUsers, safeMongoUsers);
                const deckComparison = this.compareDecks(safeLegacyDecks, safeMongoDecks);

                return {
                    users: {
                        ...userComparison,
                        legacyTotal: safeLegacyUsers.length,
                        mongoTotal: safeMongoUsers.length
                    },
                    decks: {
                        ...deckComparison,
                        legacyTotal: safeLegacyDecks.length,
                        mongoTotal: safeMongoDecks.length
                    }
                };
            })
        );
    }

    /**
     * Compare users between legacy and MongoDB
     */
    private compareUsers(legacyUsers: ISave[], mongoUsers: any[]): {
        unmigrated: ISave[];
        changed: { legacy: ISave; mongo: any }[];
        synced: number;
    } {
        const mongoUserMap = new Map<string, any>();
        mongoUsers.forEach(user => {
            // MongoDB users might have uid or _id
            const id = user.uid || user._id;
            if (id) mongoUserMap.set(id, user);
        });

        const unmigrated: ISave[] = [];
        const changed: { legacy: ISave; mongo: any }[] = [];
        let synced = 0;

        legacyUsers.forEach(legacyUser => {
            const mongoUser = mongoUserMap.get(legacyUser.uid!);

            if (!mongoUser) {
                unmigrated.push(legacyUser);
            } else if (this.hasUserChanged(legacyUser, mongoUser)) {
                changed.push({ legacy: legacyUser, mongo: mongoUser });
            } else {
                synced++;
            }
        });

        return { unmigrated, changed, synced };
    }

    /**
     * Compare decks between legacy and MongoDB
     */
    private compareDecks(legacyDecks: IDeck[], mongoDecks: any[]): {
        unmigrated: IDeck[];
        changed: { legacy: IDeck; mongo: any }[];
        synced: number;
    } {
        const mongoDeckMap = new Map<string, any>();
        mongoDecks.forEach(deck => {
            const id = deck.id || deck._id;
            if (id) mongoDeckMap.set(id, deck);
        });

        const unmigrated: IDeck[] = [];
        const changed: { legacy: IDeck; mongo: any }[] = [];
        let synced = 0;

        legacyDecks.forEach(legacyDeck => {
            const mongoDeck = mongoDeckMap.get(legacyDeck.id);

            if (!mongoDeck) {
                unmigrated.push(legacyDeck);
            } else if (this.hasDeckChanged(legacyDeck, mongoDeck)) {
                changed.push({ legacy: legacyDeck, mongo: mongoDeck });
            } else {
                synced++;
            }
        });

        return { unmigrated, changed, synced };
    }

    /**
     * Check if a user has changed (comparing key fields)
     */
    private hasUserChanged(legacy: ISave, mongo: any): boolean {
        // Compare collection length
        const legacyCollectionLength = legacy.collection?.length || 0;
        const mongoCollection = this.parseJsonField(mongo.cardCollection);
        const mongoCollectionLength = Array.isArray(mongoCollection) ? mongoCollection.length : 0;

        if (legacyCollectionLength !== mongoCollectionLength) {
            return true;
        }

        // Compare version
        if ((legacy.version || 1) !== (mongo.version || 1)) {
            return true;
        }

        // Compare display name
        if (legacy.displayName !== mongo.displayName) {
            return true;
        }

        // Compare embedded decks
        const legacyDecks = legacy.decks || [];
        const mongoDecks = this.parseJsonField(mongo.decks) || [];
        if (legacyDecks.length !== mongoDecks.length) {
            return true;
        }

        // Compare settings
        const legacySettings = JSON.stringify(legacy.settings || {});
        const mongoSettings = JSON.stringify(this.parseJsonField(mongo.settings) || {});
        if (legacySettings !== mongoSettings) {
            return true;
        }

        // Deep compare collection if lengths are equal
        if (legacyCollectionLength > 0) {
            const legacyCollectionStr = JSON.stringify(legacy.collection.sort((a, b) => (a.id || '').localeCompare(b.id || '')));
            const mongoCollectionSorted = mongoCollection.sort((a: any, b: any) => (a.id || '').localeCompare(b.id || ''));
            const mongoCollectionStr = JSON.stringify(mongoCollectionSorted);
            if (legacyCollectionStr !== mongoCollectionStr) {
                return true;
            }
        }

        // Deep compare embedded decks if lengths are equal
        if (legacyDecks.length > 0) {
            const legacyDecksStr = JSON.stringify(legacyDecks.sort((a: any, b: any) => (a.id || '').localeCompare(b.id || '')));
            const mongoDecksSorted = mongoDecks.sort((a: any, b: any) => (a.id || '').localeCompare(b.id || ''));
            const mongoDecksStr = JSON.stringify(mongoDecksSorted);
            if (legacyDecksStr !== mongoDecksStr) {
                return true;
            }
        }

        return false;
    }

    /**
     * Check if a deck has changed (comparing key fields)
     */
    private hasDeckChanged(legacy: IDeck, mongo: any): boolean {
        // Compare title
        if (legacy.title !== mongo.title) {
            return true;
        }

        // Compare description
        if (legacy.description !== mongo.description) {
            return true;
        }

        // Compare cards
        const legacyCards = legacy.cards || [];
        const mongoCards = this.parseJsonField(mongo.cards) || [];

        if (legacyCards.length !== mongoCards.length) {
            return true;
        }

        // Compare side deck
        const legacySideDeck = legacy.sideDeck || [];
        const mongoSideDeck = this.parseJsonField(mongo.sideDeck) || [];

        if (legacySideDeck.length !== mongoSideDeck.length) {
            return true;
        }

        // Compare likes count
        const legacyLikes = legacy.likes || [];
        const mongoLikes = this.parseJsonField(mongo.likes) || [];

        if (legacyLikes.length !== mongoLikes.length) {
            return true;
        }

        // Deep compare cards
        const legacyCardsStr = JSON.stringify(legacyCards.sort((a, b) => (a.id || '').localeCompare(b.id || '')));
        const mongoCardsSorted = mongoCards.sort((a: any, b: any) => (a.id || '').localeCompare(b.id || ''));
        const mongoCardsStr = JSON.stringify(mongoCardsSorted);

        if (legacyCardsStr !== mongoCardsStr) {
            return true;
        }

        return false;
    }

    /**
     * Parse a field that might be JSON string or already parsed
     */
    private parseJsonField(field: any): any {
        if (typeof field === 'string') {
            try {
                return JSON.parse(field);
            } catch {
                return field;
            }
        }
        return field;
    }

    // ===== SELECTIVE MIGRATION =====

    /**
     * Migrate only unmigrated users
     */
    migrateUnmigratedUsers(users: ISave[]): Observable<{ progress: MigrationProgress; result?: MigrationResult }> {
        return new Observable(observer => {
            const total = users.length;
            let processed = 0;
            let successful = 0;
            let failed = 0;

            observer.next({ progress: { total, processed, successful, failed } });

            if (total === 0) {
                observer.next({
                    result: this.createSuccessResult('No unmigrated users to process'),
                    progress: { total, processed, successful, failed }
                });
                observer.complete();
                return;
            }

            const processUser = (index: number) => {
                if (index >= users.length) {
                    observer.next({
                        result: this.createSuccessResult(
                            `Migration completed. ${successful} successful, ${failed} failed out of ${total} users`
                        ),
                        progress: { total, processed, successful, failed }
                    });
                    observer.complete();
                    return;
                }

                const user = users[index];
                observer.next({
                    progress: {
                        total,
                        processed,
                        successful,
                        failed,
                        currentItem: user.displayName || user.uid
                    }
                });

                this.migrateUser(user).subscribe({
                    next: (result) => {
                        processed++;
                        if (result.success) {
                            successful++;
                        } else {
                            failed++;
                        }
                        observer.next({ progress: { total, processed, successful, failed } });
                        setTimeout(() => processUser(index + 1), 50);
                    },
                    error: () => {
                        processed++;
                        failed++;
                        observer.next({ progress: { total, processed, successful, failed } });
                        setTimeout(() => processUser(index + 1), 50);
                    }
                });
            };

            processUser(0);
        });
    }

    /**
     * Migrate only unmigrated decks
     */
    migrateUnmigratedDecks(decks: IDeck[]): Observable<{ progress: MigrationProgress; result?: MigrationResult }> {
        return new Observable(observer => {
            const total = decks.length;
            let processed = 0;
            let successful = 0;
            let failed = 0;

            observer.next({ progress: { total, processed, successful, failed } });

            if (total === 0) {
                observer.next({
                    result: this.createSuccessResult('No unmigrated decks to process'),
                    progress: { total, processed, successful, failed }
                });
                observer.complete();
                return;
            }

            const processDeck = (index: number) => {
                if (index >= decks.length) {
                    observer.next({
                        result: this.createSuccessResult(
                            `Migration completed. ${successful} successful, ${failed} failed out of ${total} decks`
                        ),
                        progress: { total, processed, successful, failed }
                    });
                    observer.complete();
                    return;
                }

                const deck = decks[index];
                observer.next({
                    progress: {
                        total,
                        processed,
                        successful,
                        failed,
                        currentItem: deck.title
                    }
                });

                this.migrateDeck(deck).subscribe({
                    next: (result) => {
                        processed++;
                        if (result.success) {
                            successful++;
                        } else {
                            failed++;
                        }
                        observer.next({ progress: { total, processed, successful, failed } });
                        setTimeout(() => processDeck(index + 1), 50);
                    },
                    error: () => {
                        processed++;
                        failed++;
                        observer.next({ progress: { total, processed, successful, failed } });
                        setTimeout(() => processDeck(index + 1), 50);
                    }
                });
            };

            processDeck(0);
        });
    }

    /**
     * Update changed users (re-migrate with updated data)
     */
    updateChangedUsers(changedUsers: { legacy: ISave; mongo: any }[]): Observable<{ progress: MigrationProgress; result?: MigrationResult }> {
        const users = changedUsers.map(c => c.legacy);
        return this.migrateUnmigratedUsers(users);
    }

    /**
     * Update changed decks (re-migrate with updated data)
     */
    updateChangedDecks(changedDecks: { legacy: IDeck; mongo: any }[]): Observable<{ progress: MigrationProgress; result?: MigrationResult }> {
        const decks = changedDecks.map(c => c.legacy);
        return this.migrateUnmigratedDecks(decks);
    }

    // ===== SINGLE ITEM MIGRATION =====

    /**
     * Migrate a single user to MongoDB backend
     * @param user The user save data to migrate
     * @returns Observable with migration result
     */
    migrateUser(user: ISave): Observable<MigrationResult> {
        const userData = this.prepareUserData(user);

        return this.http.put(`${this.mongoMigrationUrl}users/${user.uid}`, userData).pipe(
            map(() => this.createSuccessResult(`Successfully migrated user: ${user.displayName || user.uid}`)),
            catchError((error: HttpErrorResponse) =>
                of(this.createErrorResult(`Failed to migrate user: ${user.displayName || user.uid}`, error.message))
            )
        );
    }

    /**
     * Migrate a single deck to MongoDB backend
     * @param deck The deck data to migrate
     * @returns Observable with migration result
     */
    migrateDeck(deck: IDeck): Observable<MigrationResult> {
        const deckData = this.prepareDeckData(deck);

        return this.http.put(`${this.mongoMigrationUrl}decks/${deck.id}`, deckData).pipe(
            map(() => this.createSuccessResult(`Successfully migrated deck: ${deck.title}`)),
            catchError((error: HttpErrorResponse) =>
                of(this.createErrorResult(`Failed to migrate deck: ${deck.title}`, error.message))
            )
        );
    }

    /**
     * Migrate all users with bulk requests
     */
    migrateAllUsers(): Observable<{ progress: MigrationProgress; result?: MigrationResult }> {
        const BATCH_SIZE = 500;

        return new Observable(observer => {
            this.getLegacyUsers().subscribe({
                next: (users) => {
                    const total = users.length;
                    let processed = 0;
                    let successful = 0;
                    let failed = 0;

                    observer.next({ progress: { total, processed, successful, failed } });

                    const batches: ISave[][] = [];
                    for (let i = 0; i < users.length; i += BATCH_SIZE) {
                        batches.push(users.slice(i, i + BATCH_SIZE));
                    }

                    const processBatch = (batchIndex: number) => {
                        if (batchIndex >= batches.length) {
                            observer.next({
                                result: this.createSuccessResult(
                                    `Migration completed. ${successful} successful, ${failed} failed out of ${total} users`
                                ),
                                progress: { total, processed, successful, failed }
                            });
                            observer.complete();
                            return;
                        }

                        const batch = batches[batchIndex];
                        const payload = batch.map(u => this.prepareUserData(u));

                        observer.next({
                            progress: { total, processed, successful, failed, currentItem: `Batch ${batchIndex + 1}/${batches.length} (${batch.length} users)` }
                        });

                        this.http.post<any>(`${this.mongoMigrationUrl}users/bulk`, payload).pipe(
                            catchError((error: HttpErrorResponse) => of({ error: true, message: error.message, total: batch.length }))
                        ).subscribe(result => {
                            if (result.error) {
                                failed += batch.length;
                            } else {
                                successful += (result.upserted || 0) + (result.modified || 0);
                                failed += batch.length - (result.upserted || 0) - (result.modified || 0);
                            }
                            processed += batch.length;
                            observer.next({ progress: { total, processed, successful, failed } });
                            processBatch(batchIndex + 1);
                        });
                    };

                    processBatch(0);
                },
                error: (error) => {
                    observer.next({
                        result: this.createErrorResult('Failed to fetch users from legacy backend', error.message),
                        progress: { total: 0, processed: 0, successful: 0, failed: 0 }
                    });
                    observer.complete();
                }
            });
        });
    }

    /**
     * Migrate all decks with progress tracking
     */
    /**
     * Migrate all decks with bulk requests
     */
    migrateAllDecks(): Observable<{ progress: MigrationProgress; result?: MigrationResult }> {
        const BATCH_SIZE = 500;

        return new Observable(observer => {
            this.getLegacyDecks().subscribe({
                next: (decks) => {
                    const total = decks.length;
                    let processed = 0;
                    let successful = 0;
                    let failed = 0;

                    observer.next({ progress: { total, processed, successful, failed } });

                    const batches: IDeck[][] = [];
                    for (let i = 0; i < decks.length; i += BATCH_SIZE) {
                        batches.push(decks.slice(i, i + BATCH_SIZE));
                    }

                    const processBatch = (batchIndex: number) => {
                        if (batchIndex >= batches.length) {
                            observer.next({
                                result: this.createSuccessResult(
                                    `Migration completed. ${successful} successful, ${failed} failed out of ${total} decks`
                                ),
                                progress: { total, processed, successful, failed }
                            });
                            observer.complete();
                            return;
                        }

                        const batch = batches[batchIndex];
                        const payload = batch.map(d => this.prepareDeckData(d));

                        observer.next({
                            progress: { total, processed, successful, failed, currentItem: `Batch ${batchIndex + 1}/${batches.length} (${batch.length} decks)` }
                        });

                        this.http.post<any>(`${this.mongoMigrationUrl}decks/bulk`, payload).pipe(
                            catchError((error: HttpErrorResponse) => of({ error: true, message: error.message, total: batch.length }))
                        ).subscribe(result => {
                            if (result.error) {
                                failed += batch.length;
                            } else {
                                successful += (result.upserted || 0) + (result.modified || 0);
                                failed += batch.length - (result.upserted || 0) - (result.modified || 0);
                            }
                            processed += batch.length;
                            observer.next({ progress: { total, processed, successful, failed } });
                            processBatch(batchIndex + 1);
                        });
                    };

                    processBatch(0);
                },
                error: (error) => {
                    observer.next({
                        result: this.createErrorResult('Failed to fetch decks from legacy backend', error.message),
                        progress: { total: 0, processed: 0, successful: 0, failed: 0 }
                    });
                    observer.complete();
                }
            });
        });
    }

    /**
     * Get migration status by checking data in both backends
     */
    getMigrationStatus(): Observable<{
        legacy: { users: number; decks: number };
        mongo: { users: number; decks: number };
        connectionStatus: { legacy: boolean; mongo: boolean };
    }> {
        return forkJoin({
            legacyUsers: this.http.get<any[]>(`${this.legacyBackendUrl}users`).pipe(
                map(users => ({ count: Array.isArray(users) ? users.length : 0, connected: true })),
                catchError(() => of({ count: 0, connected: false }))
            ),
            legacyDecks: this.http.get<any[]>(`${this.legacyBackendUrl}decks`).pipe(
                map(decks => Array.isArray(decks) ? decks.length : 0),
                catchError(() => of(0))
            ),
            mongoUsers: this.http.get<any>(`${this.mongoBackendUrl}users?page=1&limit=1`).pipe(
                map(response => {
                    if (response && response.pagination && typeof response.pagination.totalUsers === 'number') {
                        return { count: response.pagination.totalUsers, connected: true };
                    }
                    if (Array.isArray(response)) {
                        return { count: response.length, connected: true };
                    }
                    if (response && Array.isArray(response.users)) {
                        return { count: response.users.length, connected: true };
                    }
                    return { count: 0, connected: true };
                }),
                catchError(() => of({ count: 0, connected: false }))
            ),
            mongoDecks: this.http.get<any>(`${this.mongoBackendUrl}decks?page=1&limit=1`).pipe(
                map(response => {
                    if (response && response.pagination && typeof response.pagination.totalDecks === 'number') {
                        return response.pagination.totalDecks;
                    }
                    if (Array.isArray(response)) {
                        return response.length;
                    }
                    if (response && Array.isArray(response.decks)) {
                        return response.decks.length;
                    }
                    return 0;
                }),
                catchError(() => of(0))
            )
        }).pipe(
            map(results => ({
                legacy: {
                    users: results.legacyUsers.count,
                    decks: results.legacyDecks
                },
                mongo: {
                    users: results.mongoUsers.count,
                    decks: results.mongoDecks
                },
                connectionStatus: {
                    legacy: results.legacyUsers.connected,
                    mongo: results.mongoUsers.connected
                }
            }))
        );
    }

    /**
     * Clear all data from MongoDB backend (use with caution!)
     */
    clearMongoData(): Observable<MigrationResult> {
        return forkJoin({
            users: this.getMongoUsers(),
            decks: this.getMongoDecks()
        }).pipe(
            concatMap(({ users, decks }) => {
                const deleteOperations: Observable<any>[] = [];

                // Add user deletion operations
                users.forEach(user => {
                    deleteOperations.push(
                        this.http.delete(`${this.mongoBackendUrl}users/${user._id}`).pipe(
                            catchError(error => {
                                console.error(`Failed to delete user ${user._id}:`, error);
                                return of(null);
                            })
                        )
                    );
                });

                // Add deck deletion operations
                decks.forEach(deck => {
                    deleteOperations.push(
                        this.http.delete(`${this.mongoBackendUrl}decks/${deck._id}`).pipe(
                            catchError(error => {
                                console.error(`Failed to delete deck ${deck._id}:`, error);
                                return of(null);
                            })
                        )
                    );
                });

                if (deleteOperations.length === 0) {
                    return of({
                        success: true,
                        message: 'No data to clear'
                    });
                }

                return forkJoin(deleteOperations).pipe(
                    map(() => ({
                        success: true,
                        message: `Cleared ${users.length} users and ${decks.length} decks from MongoDB`
                    }))
                );
            }),
            catchError((error: HttpErrorResponse) => of({
                success: false,
                message: 'Failed to clear MongoDB data',
                error: error.message
            }))
        );
    }

    private handleError(error: HttpErrorResponse) {
        let errorMessage = 'An error occurred';
        if (error.error instanceof ErrorEvent) {
            // Client-side error
            errorMessage = error.error.message;
        } else {
            // Server-side error
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        console.error(errorMessage);
        return throwError(() => new Error(errorMessage));
    }

    // ===== HELPER METHODS =====

    /**
     * Create a success result object
     */
    private createSuccessResult(message: string, data?: any): MigrationResult {
        return { success: true, message, data };
    }

    /**
     * Create an error result object
     */
    private createErrorResult(message: string, error?: any): MigrationResult {
        return { success: false, message, error };
    }

    /**
     * Parse user save data from legacy format
     */
    private parseUserSaves(saves: any[]): ISave[] {
        return saves.map((save) => {
            const collection = JSON.parse(save.collection || '[]');
            const decks = JSON.parse(save.decks || '[]');
            const settings = JSON.parse(save.settings || '{}');
            return {
                ...save,
                collection,
                decks,
                settings,
            } as ISave;
        });
    }

    /**
     * Parse deck data from legacy format
     */
    private parseDecks(decks: any[]): IDeck[] {
        return decks.map((deck) => {
            const cards = JSON.parse(deck.cards || '[]');
            const sideDeck = JSON.parse(deck.sideDeck || '[]');
            const color = JSON.parse(deck.color || '{}');
            const tags = JSON.parse(deck.tags || '[]');
            const likes = deck.likes ? JSON.parse(deck.likes) : [];
            return {
                ...deck,
                likes,
                cards,
                sideDeck,
                color,
                tags,
            } as IDeck;
        });
    }

    /**
     * Prepare user data for MongoDB format
     */
    private prepareUserData(user: ISave): any {
        return {
            uid: user.uid,
            cardCollection: user.collection,
            decks: user.decks || [],
            displayName: user.displayName,
            photoURL: user.photoUrl,
            settings: user.settings,
            version: user.version || 1
        };
    }

    /**
     * Prepare deck data for MongoDB format
     */
    private prepareDeckData(deck: IDeck): any {
        const allCards = this.digimonCardStore.cards();

        // Compute tags from the deck's cards
        const tags = (deck.cards && deck.cards.length > 0)
            ? setTags(deck, allCards)
            : (deck.tags || []);

        // Compute imageCardId if missing or default
        let imageCardId = deck.imageCardId;
        if ((!imageCardId || imageCardId === 'BT1-001') && deck.cards && deck.cards.length > 0 && allCards.length > 0) {
            imageCardId = setDeckImage(deck, allCards).id;
        }

        return {
            id: deck.id,
            cards: deck.cards || [],
            sideDeck: deck.sideDeck || [],
            color: deck.color || {},
            title: deck.title,
            description: deck.description,
            tags,
            date: deck.date,
            user: deck.user,
            userId: deck.userId,
            imageCardId: imageCardId || 'BT1-001',
            likes: deck.likes || [],
            photoUrl: deck.photoUrl
        };
    }

    /**
     * Generic bulk migration processor
     * @param items Array of items to migrate
     * @param migrateFn Function to migrate a single item
     * @param getItemName Function to get item name for display
     * @param itemType Type of items being migrated (for logging)
     * @param observer Observer to emit progress updates
     */
    private processBulkMigration<T>(
        items: T[],
        migrateFn: (item: T) => Observable<MigrationResult>,
        getItemName: (item: T) => string,
        itemType: string,
        observer: any
    ): void {
        const total = items.length;
        let processed = 0;
        let successful = 0;
        let failed = 0;

        // Emit initial progress
        observer.next({ progress: { total, processed, successful, failed } });

        // Process items one by one with delay to avoid overwhelming the server
        const processItems = (index: number) => {
            if (index >= items.length) {
                // Migration completed
                observer.next({
                    result: this.createSuccessResult(
                        `Migration completed. ${successful} successful, ${failed} failed out of ${total} ${itemType}`
                    ),
                    progress: { total, processed, successful, failed }
                });
                observer.complete();
                return;
            }

            const item = items[index];
            const itemName = getItemName(item);

            // Emit progress with current item
            observer.next({
                progress: { total, processed, successful, failed, currentItem: itemName }
            });

            // Migrate the current item
            migrateFn(item).subscribe({
                next: (result) => {
                    processed++;
                    if (result.success) {
                        successful++;
                    } else {
                        failed++;
                        console.error(`Failed to migrate ${itemType.slice(0, -1)} ${itemName}:`, result.error);
                    }

                    observer.next({ progress: { total, processed, successful, failed } });

                    // Process next item after a small delay
                    setTimeout(() => processItems(index + 1), 100);
                },
                error: (error) => {
                    processed++;
                    failed++;
                    console.error(`Error migrating ${itemType.slice(0, -1)} ${itemName}:`, error);

                    observer.next({ progress: { total, processed, successful, failed } });

                    // Continue with next item even if this one failed
                    setTimeout(() => processItems(index + 1), 100);
                }
            });
        };

        processItems(0);
    }
}
