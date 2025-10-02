import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MigrationService, MigrationProgress, MigrationResult } from './migration.service';
import { IDeck, ISave } from '@models';

/**
 * Bulk Migration Service
 * 
 * This service handles bulk migration operations with progress tracking.
 * It's separated from the main migration service for better organization.
 */
@Injectable({
    providedIn: 'root',
})
export class MigrationBulkService {

    constructor(private migrationService: MigrationService) { }

    /**
     * Migrate all users with progress tracking
     * @returns Observable that emits progress updates and final result
     */
    migrateAllUsers(): Observable<{ progress: MigrationProgress; result?: MigrationResult }> {
        return new Observable(observer => {
            this.migrationService.getLegacyUsers().subscribe({
                next: (users) => this.processBulkMigration(
                    users,
                    (user) => this.migrationService.migrateUser(user),
                    (user) => user.displayName || user.uid || 'Unknown User',
                    'users',
                    observer
                ),
                error: (error) => this.emitError(observer, 'Failed to fetch users from legacy backend', error)
            });
        });
    }

    /**
     * Migrate all decks with progress tracking
     * @returns Observable that emits progress updates and final result
     */
    migrateAllDecks(): Observable<{ progress: MigrationProgress; result?: MigrationResult }> {
        return new Observable(observer => {
            this.migrationService.getLegacyDecks().subscribe({
                next: (decks) => this.processBulkMigration(
                    decks,
                    (deck) => this.migrationService.migrateDeck(deck),
                    (deck) => deck.title || deck.id || 'Unknown Deck',
                    'decks',
                    observer
                ),
                error: (error) => this.emitError(observer, 'Failed to fetch decks from legacy backend', error)
            });
        });
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
        this.emitProgress(observer, { total, processed, successful, failed });

        // Process items one by one with delay to avoid overwhelming the server
        const processItems = (index: number) => {
            if (index >= items.length) {
                // Migration completed
                observer.next({
                    result: {
                        success: true,
                        message: `Migration completed. ${successful} successful, ${failed} failed out of ${total} ${itemType}`
                    },
                    progress: { total, processed, successful, failed }
                });
                observer.complete();
                return;
            }

            const item = items[index];
            const itemName = getItemName(item);

            // Emit progress with current item
            this.emitProgress(observer, {
                total,
                processed,
                successful,
                failed,
                currentItem: itemName
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

                    this.emitProgress(observer, { total, processed, successful, failed });

                    // Process next item after a small delay
                    setTimeout(() => processItems(index + 1), 100);
                },
                error: (error) => {
                    processed++;
                    failed++;
                    console.error(`Error migrating ${itemType.slice(0, -1)} ${itemName}:`, error);

                    this.emitProgress(observer, { total, processed, successful, failed });

                    // Continue with next item even if this one failed
                    setTimeout(() => processItems(index + 1), 100);
                }
            });
        };

        processItems(0);
    }

    /**
     * Emit progress update
     */
    private emitProgress(observer: any, progress: MigrationProgress): void {
        observer.next({ progress });
    }

    /**
     * Emit error result
     */
    private emitError(observer: any, message: string, error: any): void {
        observer.next({
            result: {
                success: false,
                message,
                error: error.message
            },
            progress: { total: 0, processed: 0, successful: 0, failed: 0 }
        });
        observer.complete();
    }
}
