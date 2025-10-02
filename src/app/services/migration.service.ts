import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, forkJoin, of } from 'rxjs';
import { map, catchError, retry, delay, concatMap } from 'rxjs/operators';
import { IDeck, ISave, IUser } from '@models';

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

@Injectable({
    providedIn: 'root',
})
export class MigrationService {
    // Backend URLs
    private readonly mongoBackendUrl = 'http://digimoncardapp.backend.takaotaku.de/api/';  // Updated to match MongoBackendService
    private readonly legacyBackendUrl = 'https://backend.digimoncard.app/api/';

    constructor(private http: HttpClient) { }

    // ===== CONNECTION TESTING =====

    /**
     * Test connection to the new MongoDB backend
     * @returns Observable with connection result
     */
    testMongoConnection(): Observable<MigrationResult> {
        return this.http.get<any>(`http://digimoncardapp.backend.takaotaku.de/`).pipe(
            map(() => this.createSuccessResult('Successfully connected to MongoDB backend')),
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
        return this.http.get<any[]>(`${this.legacyBackendUrl}users`).pipe(
            map((users) => this.createSuccessResult(
                `Successfully connected to legacy backend. Found ${users.length} users`,
                { userCount: users.length }
            )),
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

    // ===== SINGLE ITEM MIGRATION =====

    /**
     * Migrate a single user to MongoDB backend
     * @param user The user save data to migrate
     * @returns Observable with migration result
     */
    migrateUser(user: ISave): Observable<MigrationResult> {
        const userData = this.prepareUserData(user);

        return this.http.put(`${this.mongoBackendUrl}users/${user.uid}`, userData).pipe(
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

        return this.http.put(`${this.mongoBackendUrl}decks/${deck.id}`, deckData).pipe(
            map(() => this.createSuccessResult(`Successfully migrated deck: ${deck.title}`)),
            catchError((error: HttpErrorResponse) =>
                of(this.createErrorResult(`Failed to migrate deck: ${deck.title}`, error.message))
            )
        );
    }

    /**
     * Migrate all users with progress tracking
     */
    migrateAllUsers(): Observable<{ progress: MigrationProgress; result?: MigrationResult }> {
        return new Observable(observer => {
            this.getLegacyUsers().subscribe({
                next: (users) => {
                    const total = users.length;
                    let processed = 0;
                    let successful = 0;
                    let failed = 0;

                    // Emit initial progress
                    observer.next({
                        progress: { total, processed, successful, failed }
                    });

                    // Process users one by one with delay to avoid overwhelming the server
                    const processUsers = (index: number) => {
                        if (index >= users.length) {
                            observer.next({
                                result: {
                                    success: true,
                                    message: `Migration completed. ${successful} successful, ${failed} failed out of ${total} users`
                                },
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
                                    console.error(`Failed to migrate user ${user.uid}:`, result.error);
                                }

                                observer.next({
                                    progress: { total, processed, successful, failed }
                                });

                                // Process next user after a small delay
                                setTimeout(() => processUsers(index + 1), 100);
                            },
                            error: (error) => {
                                processed++;
                                failed++;
                                console.error(`Error migrating user ${user.uid}:`, error);

                                observer.next({
                                    progress: { total, processed, successful, failed }
                                });

                                // Continue with next user even if this one failed
                                setTimeout(() => processUsers(index + 1), 100);
                            }
                        });
                    };

                    processUsers(0);
                },
                error: (error) => {
                    observer.next({
                        result: {
                            success: false,
                            message: 'Failed to fetch users from legacy backend',
                            error: error.message
                        },
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
    migrateAllDecks(): Observable<{ progress: MigrationProgress; result?: MigrationResult }> {
        return new Observable(observer => {
            this.getLegacyDecks().subscribe({
                next: (decks) => {
                    const total = decks.length;
                    let processed = 0;
                    let successful = 0;
                    let failed = 0;

                    // Emit initial progress
                    observer.next({
                        progress: { total, processed, successful, failed }
                    });

                    // Process decks one by one with delay
                    const processDecks = (index: number) => {
                        if (index >= decks.length) {
                            observer.next({
                                result: {
                                    success: true,
                                    message: `Migration completed. ${successful} successful, ${failed} failed out of ${total} decks`
                                },
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
                                    console.error(`Failed to migrate deck ${deck.id}:`, result.error);
                                }

                                observer.next({
                                    progress: { total, processed, successful, failed }
                                });

                                // Process next deck after a small delay
                                setTimeout(() => processDecks(index + 1), 100);
                            },
                            error: (error) => {
                                processed++;
                                failed++;
                                console.error(`Error migrating deck ${deck.id}:`, error);

                                observer.next({
                                    progress: { total, processed, successful, failed }
                                });

                                // Continue with next deck even if this one failed
                                setTimeout(() => processDecks(index + 1), 100);
                            }
                        });
                    };

                    processDecks(0);
                },
                error: (error) => {
                    observer.next({
                        result: {
                            success: false,
                            message: 'Failed to fetch decks from legacy backend',
                            error: error.message
                        },
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
                map(users => users.length),
                catchError(() => of(0))
            ),
            legacyDecks: this.http.get<any[]>(`${this.legacyBackendUrl}decks`).pipe(
                map(decks => decks.length),
                catchError(() => of(0))
            ),
            mongoUsers: this.http.get<any[]>(`${this.mongoBackendUrl}users`).pipe(
                map(users => users.length),
                catchError(() => of(0))
            ),
            mongoDecks: this.http.get<any[]>(`${this.mongoBackendUrl}decks`).pipe(
                map(decks => decks.length),
                catchError(() => of(0))
            ),
            legacyConnection: this.testLegacyConnection().pipe(
                map(result => result.success)
            ),
            mongoConnection: this.testMongoConnection().pipe(
                map(result => result.success)
            )
        }).pipe(
            map(results => ({
                legacy: {
                    users: results.legacyUsers,
                    decks: results.legacyDecks
                },
                mongo: {
                    users: results.mongoUsers,
                    decks: results.mongoDecks
                },
                connectionStatus: {
                    legacy: results.legacyConnection,
                    mongo: results.mongoConnection
                }
            }))
        );
    }

    /**
     * Clear all data from MongoDB backend (use with caution!)
     */
    clearMongoData(): Observable<MigrationResult> {
        return forkJoin({
            users: this.http.get<any[]>(`${this.mongoBackendUrl}users`),
            decks: this.http.get<any[]>(`${this.mongoBackendUrl}decks`)
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
            decks: JSON.stringify(user.decks || []),
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
        return {
            id: deck.id,
            cards: JSON.stringify(deck.cards || []),
            sideDeck: JSON.stringify(deck.sideDeck || []),
            color: JSON.stringify(deck.color || {}),
            title: deck.title,
            description: deck.description,
            tags: JSON.stringify(deck.tags || []),
            date: deck.date,
            user: deck.user,
            userId: deck.userId,
            imageCardId: deck.imageCardId,
            likes: JSON.stringify(deck.likes || []),
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
