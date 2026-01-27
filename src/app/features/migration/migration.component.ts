import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil, forkJoin, finalize, timeout, catchError, of } from 'rxjs';
import { MigrationService, MigrationResult, MigrationProgress, ComparisonResult } from '../../services/migration.service';

@Component({
    selector: 'app-migration',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="container mx-auto p-6 max-w-4xl">
      <h1 class="text-3xl font-bold text-gray-800 mb-6">Data Migration Tool</h1>
      
      <!-- Connection Status -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4">Connection Status</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-4 rounded-lg" [class]="connectionStatus.legacy ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'">
            <div class="flex items-center">
              <div class="w-3 h-3 rounded-full mr-3" [class]="connectionStatus.legacy ? 'bg-green-500' : 'bg-red-500'"></div>
              <span class="font-medium text-gray-800">Legacy Backend</span>
            </div>
            <p class="text-sm text-gray-600 mt-1">
              {{ connectionStatus.legacy ? 'Connected' : 'Disconnected' }}
            </p>
          </div>
          
          <div class="p-4 rounded-lg" [class]="connectionStatus.mongo ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'">
            <div class="flex items-center">
              <div class="w-3 h-3 rounded-full mr-3" [class]="connectionStatus.mongo ? 'bg-green-500' : 'bg-red-500'"></div>
              <span class="font-medium text-gray-800">MongoDB Backend</span>
            </div>
            <p class="text-sm text-gray-600 mt-1">
              {{ connectionStatus.mongo ? 'Connected' : 'Disconnected' }}
            </p>
          </div>
        </div>
      </div>

      <!-- Migration Status -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6" *ngIf="migrationStatus">
        <h2 class="text-xl font-semibold mb-4">Migration Status</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="text-center p-4 bg-blue-50 rounded-lg">
            <div class="text-2xl font-bold text-blue-600">{{ migrationStatus.legacy.users ?? 0 }}</div>
            <div class="text-sm text-gray-600">Legacy Users</div>
          </div>
          <div class="text-center p-4 bg-blue-50 rounded-lg">
            <div class="text-2xl font-bold text-blue-600">{{ migrationStatus.legacy.decks ?? 0 }}</div>
            <div class="text-sm text-gray-600">Legacy Decks</div>
          </div>
          <div class="text-center p-4 bg-green-50 rounded-lg">
            <div class="text-2xl font-bold text-green-600">{{ migrationStatus.mongo.users ?? 0 }}</div>
            <div class="text-sm text-gray-600">Migrated Users</div>
          </div>
          <div class="text-center p-4 bg-green-50 rounded-lg">
            <div class="text-2xl font-bold text-green-600">{{ migrationStatus.mongo.decks ?? 0 }}</div>
            <div class="text-sm text-gray-600">Migrated Decks</div>
          </div>
        </div>
      </div>

      <!-- Migration Controls -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4">Migration Controls</h2>
        
        <div class="space-y-4">
          <!-- Test Connections -->
          <div class="flex flex-wrap gap-3">
            <button 
              (click)="testConnections()"
              [disabled]="isLoading"
              class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed">
              <span *ngIf="!isLoading">Test Connections</span>
              <span *ngIf="isLoading">Testing...</span>
            </button>

            <button 
              (click)="refreshStatus()"
              [disabled]="isLoading"
              class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed">
              Refresh Status
            </button>

            <button 
              (click)="compareData()"
              [disabled]="isLoading || !connectionStatus.legacy || !connectionStatus.mongo"
              class="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed">
              <span *ngIf="!isComparing">Compare Data</span>
              <span *ngIf="isComparing">Comparing...</span>
            </button>
          </div>

          <!-- Full Migration Actions -->
          <div class="border-t pt-4">
            <h3 class="text-lg font-medium text-gray-700 mb-2">Full Migration</h3>
            <div class="flex flex-wrap gap-3">
              <button 
                (click)="migrateUsers()"
                [disabled]="isLoading || !connectionStatus.legacy || !connectionStatus.mongo"
                class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed">
                Migrate All Users
              </button>

              <button 
                (click)="migrateDecks()"
                [disabled]="isLoading || !connectionStatus.legacy || !connectionStatus.mongo"
                class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed">
                Migrate All Decks
              </button>

              <button 
                (click)="migrateAll()"
                [disabled]="isLoading || !connectionStatus.legacy || !connectionStatus.mongo"
                class="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed">
                Migrate Everything
              </button>
            </div>
          </div>

          <!-- Danger Zone -->
          <div class="border-t pt-4">
            <h3 class="text-lg font-medium text-red-600 mb-2">Danger Zone</h3>
            <button 
              (click)="clearMongoData()"
              [disabled]="isLoading || !connectionStatus.mongo"
              class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
              onclick="return confirm('Are you sure? This will delete all data from the MongoDB backend!')">
              Clear MongoDB Data
            </button>
          </div>
        </div>
      </div>

      <!-- Comparison Results -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6" *ngIf="comparisonResult">
        <h2 class="text-xl font-semibold mb-4">Comparison Results</h2>
        
        <!-- Users Comparison -->
        <div class="mb-6">
          <h3 class="text-lg font-medium text-gray-700 mb-3">Users</h3>
          <div class="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
            <div class="text-center p-3 bg-blue-50 rounded-lg">
              <div class="text-xl font-bold text-blue-600">{{ comparisonResult.users.legacyTotal }}</div>
              <div class="text-xs text-gray-600">Legacy Total</div>
            </div>
            <div class="text-center p-3 bg-green-50 rounded-lg">
              <div class="text-xl font-bold text-green-600">{{ comparisonResult.users.mongoTotal }}</div>
              <div class="text-xs text-gray-600">MongoDB Total</div>
            </div>
            <div class="text-center p-3 bg-emerald-50 rounded-lg">
              <div class="text-xl font-bold text-emerald-600">{{ comparisonResult.users.synced }}</div>
              <div class="text-xs text-gray-600">In Sync</div>
            </div>
            <div class="text-center p-3 bg-orange-50 rounded-lg">
              <div class="text-xl font-bold text-orange-600">{{ comparisonResult.users.unmigrated.length }}</div>
              <div class="text-xs text-gray-600">Unmigrated</div>
            </div>
            <div class="text-center p-3 bg-yellow-50 rounded-lg">
              <div class="text-xl font-bold text-yellow-600">{{ comparisonResult.users.changed.length }}</div>
              <div class="text-xs text-gray-600">Changed</div>
            </div>
          </div>
          
          <div class="flex flex-wrap gap-2">
            <button 
              (click)="migrateUnmigratedUsers()"
              [disabled]="isLoading || comparisonResult.users.unmigrated.length === 0"
              class="px-3 py-1.5 text-sm bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed">
              Migrate {{ comparisonResult.users.unmigrated.length }} Unmigrated
            </button>
            <button 
              (click)="updateChangedUsers()"
              [disabled]="isLoading || comparisonResult.users.changed.length === 0"
              class="px-3 py-1.5 text-sm bg-yellow-500 text-white rounded-md hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed">
              Update {{ comparisonResult.users.changed.length }} Changed
            </button>
          </div>
        </div>

        <!-- Decks Comparison -->
        <div class="border-t pt-4">
          <h3 class="text-lg font-medium text-gray-700 mb-3">Decks</h3>
          <div class="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
            <div class="text-center p-3 bg-blue-50 rounded-lg">
              <div class="text-xl font-bold text-blue-600">{{ comparisonResult.decks.legacyTotal }}</div>
              <div class="text-xs text-gray-600">Legacy Total</div>
            </div>
            <div class="text-center p-3 bg-green-50 rounded-lg">
              <div class="text-xl font-bold text-green-600">{{ comparisonResult.decks.mongoTotal }}</div>
              <div class="text-xs text-gray-600">MongoDB Total</div>
            </div>
            <div class="text-center p-3 bg-emerald-50 rounded-lg">
              <div class="text-xl font-bold text-emerald-600">{{ comparisonResult.decks.synced }}</div>
              <div class="text-xs text-gray-600">In Sync</div>
            </div>
            <div class="text-center p-3 bg-orange-50 rounded-lg">
              <div class="text-xl font-bold text-orange-600">{{ comparisonResult.decks.unmigrated.length }}</div>
              <div class="text-xs text-gray-600">Unmigrated</div>
            </div>
            <div class="text-center p-3 bg-yellow-50 rounded-lg">
              <div class="text-xl font-bold text-yellow-600">{{ comparisonResult.decks.changed.length }}</div>
              <div class="text-xs text-gray-600">Changed</div>
            </div>
          </div>
          
          <div class="flex flex-wrap gap-2">
            <button 
              (click)="migrateUnmigratedDecks()"
              [disabled]="isLoading || comparisonResult.decks.unmigrated.length === 0"
              class="px-3 py-1.5 text-sm bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed">
              Migrate {{ comparisonResult.decks.unmigrated.length }} Unmigrated
            </button>
            <button 
              (click)="updateChangedDecks()"
              [disabled]="isLoading || comparisonResult.decks.changed.length === 0"
              class="px-3 py-1.5 text-sm bg-yellow-500 text-white rounded-md hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed">
              Update {{ comparisonResult.decks.changed.length }} Changed
            </button>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="border-t pt-4 mt-4">
          <h3 class="text-lg font-medium text-gray-700 mb-3">Quick Actions</h3>
          <div class="flex flex-wrap gap-2">
            <button 
              (click)="syncAll()"
              [disabled]="isLoading || (comparisonResult.users.unmigrated.length === 0 && comparisonResult.users.changed.length === 0 && comparisonResult.decks.unmigrated.length === 0 && comparisonResult.decks.changed.length === 0)"
              class="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed">
              Sync Everything (Migrate + Update All)
            </button>
          </div>
        </div>
      </div>

      <!-- Progress Display -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6" *ngIf="currentProgress">
        <h2 class="text-xl font-semibold mb-4">Migration Progress</h2>
        
        <div class="mb-4">
          <div class="flex justify-between text-sm text-gray-600 mb-2">
            <span>{{ currentProgress.processed }} / {{ currentProgress.total }}</span>
            <span>{{ getProgressPercentage() }}%</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div 
              class="bg-blue-500 h-2 rounded-full transition-all duration-300"
              [style.width.%]="getProgressPercentage()">
            </div>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-4 text-sm">
          <div class="text-center">
            <div class="font-bold text-blue-600">{{ currentProgress.processed }}</div>
            <div class="text-gray-600">Processed</div>
          </div>
          <div class="text-center">
            <div class="font-bold text-green-600">{{ currentProgress.successful }}</div>
            <div class="text-gray-600">Successful</div>
          </div>
          <div class="text-center">
            <div class="font-bold text-red-600">{{ currentProgress.failed }}</div>
            <div class="text-gray-600">Failed</div>
          </div>
        </div>

        <div *ngIf="currentProgress.currentItem" class="mt-4 text-sm text-gray-600">
          Currently processing: <span class="font-medium">{{ currentProgress.currentItem }}</span>
        </div>
      </div>

      <!-- Messages -->
      <div class="space-y-3" *ngIf="messages.length > 0">
        <div 
          *ngFor="let message of messages; trackBy: trackMessage"
          class="p-4 rounded-lg border"
          [class]="getMessageClass(message.type)">
          <div class="font-medium">{{ message.title }}</div>
          <div class="text-sm mt-1">{{ message.content }}</div>
          <div class="text-xs text-gray-500 mt-2">{{ message.timestamp | date:'medium' }}</div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .container {
      min-height: 100vh;
      background-color: #f8fafc;
    }
  `]
})
export class MigrationComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    isLoading = false;
    isComparing = false;
    connectionStatus = { legacy: false, mongo: false };
    migrationStatus: any = null;
    currentProgress: MigrationProgress | null = null;
    comparisonResult: ComparisonResult | null = null;
    messages: Array<{
        type: 'success' | 'error' | 'info';
        title: string;
        content: string;
        timestamp: Date;
    }> = [];

    constructor(
        private migrationService: MigrationService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.testConnections();
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    testConnections() {
        this.isLoading = true;
        this.addMessage('info', 'Testing Connections', 'Checking connectivity to both backends...');
        
        const legacyObs = this.migrationService.testLegacyConnection().pipe(
            timeout(10000),
            catchError(error => of({ success: false, message: error.message || 'Connection timeout' }))
        );
        
        const mongoObs = this.migrationService.testMongoConnection().pipe(
            timeout(10000),
            catchError(error => of({ success: false, message: error.message || 'Connection timeout' }))
        );
        
        forkJoin({
            legacy: legacyObs,
            mongo: mongoObs
        }).pipe(
            takeUntil(this.destroy$),
            finalize(() => {
                console.log('Connection test finalized, isLoading set to false');
                this.isLoading = false;
                this.cdr.detectChanges();
            })
        ).subscribe({
            next: (results) => {
                console.log('Connection test results:', results);
                this.connectionStatus.legacy = results.legacy.success;
                this.connectionStatus.mongo = results.mongo.success;

                if (results.legacy.success) {
                    this.addMessage('success', 'Legacy Connection', results.legacy.message);
                } else {
                    this.addMessage('error', 'Legacy Connection Failed', results.legacy.message);
                }

                if (results.mongo.success) {
                    this.addMessage('success', 'MongoDB Connection', 'Successfully connected to MongoDB backend');
                } else {
                    this.addMessage('error', 'MongoDB Connection Failed', results.mongo.message);
                }

                this.cdr.detectChanges();
                
                // Refresh status after connections are confirmed
                this.refreshStatus();
            },
            error: (error) => {
                console.error('Connection test error:', error);
                this.addMessage('error', 'Connection Test Failed', error.message || 'Unknown error occurred');
                this.cdr.detectChanges();
            }
        });
    }

    refreshStatus() {
        this.migrationService.getMigrationStatus()
            .pipe(
                takeUntil(this.destroy$),
                timeout(15000),
                catchError(error => {
                    this.addMessage('error', 'Status Refresh Failed', error.message || 'Failed to fetch migration status');
                    this.cdr.detectChanges();
                    return of(null);
                })
            )
            .subscribe(status => {
                console.log('Migration status received:', status);
                if (status) {
                    this.migrationStatus = status;
                    // Only update connection status if not already set
                    if (!this.connectionStatus.legacy && !this.connectionStatus.mongo) {
                        this.connectionStatus = status.connectionStatus;
                    }
                }
                this.cdr.detectChanges();
            });
    }

    migrateUsers() {
        this.isLoading = true;
        this.currentProgress = null;
        this.addMessage('info', 'User Migration Started', 'Beginning migration of users from legacy backend...');

        this.migrationService.migrateAllUsers()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: ({ progress, result }) => {
                    this.currentProgress = progress;

                    if (result) {
                        this.isLoading = false;
                        if (result.success) {
                            this.addMessage('success', 'User Migration Complete', result.message);
                        } else {
                            this.addMessage('error', 'User Migration Failed', result.message);
                        }
                        this.refreshStatus();
                    }
                },
                error: (error) => {
                    this.isLoading = false;
                    this.addMessage('error', 'User Migration Error', error.message);
                }
            });
    }

    migrateDecks() {
        this.isLoading = true;
        this.currentProgress = null;
        this.addMessage('info', 'Deck Migration Started', 'Beginning migration of decks from legacy backend...');

        this.migrationService.migrateAllDecks()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: ({ progress, result }) => {
                    this.currentProgress = progress;

                    if (result) {
                        this.isLoading = false;
                        if (result.success) {
                            this.addMessage('success', 'Deck Migration Complete', result.message);
                        } else {
                            this.addMessage('error', 'Deck Migration Failed', result.message);
                        }
                        this.refreshStatus();
                    }
                },
                error: (error) => {
                    this.isLoading = false;
                    this.addMessage('error', 'Deck Migration Error', error.message);
                }
            });
    }

    migrateAll() {
        this.addMessage('info', 'Full Migration Started', 'Starting complete migration process...');

        // First migrate users, then decks
        this.migrateUsers();

        // We'll listen for the users migration to complete, then start decks
        const subscription = this.migrationService.migrateAllUsers()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: ({ result }) => {
                    if (result && result.success) {
                        // Users migration completed, now start decks
                        setTimeout(() => {
                            this.migrateDecks();
                        }, 1000);
                    }
                }
            });
    }

    clearMongoData() {
        if (!confirm('Are you sure you want to clear all data from MongoDB? This action cannot be undone!')) {
            return;
        }

        this.isLoading = true;
        this.addMessage('info', 'Clearing MongoDB Data', 'Removing all data from MongoDB backend...');

        this.migrationService.clearMongoData()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (result) => {
                    this.isLoading = false;
                    if (result.success) {
                        this.addMessage('success', 'Data Cleared', result.message);
                    } else {
                        this.addMessage('error', 'Clear Failed', result.message);
                    }
                    this.refreshStatus();
                },
                error: (error) => {
                    this.isLoading = false;
                    this.addMessage('error', 'Clear Error', error.message);
                }
            });
    }

    // ===== COMPARISON METHODS =====

    compareData() {
        this.isComparing = true;
        this.isLoading = true;
        this.addMessage('info', 'Comparing Data', 'Analyzing differences between legacy and MongoDB backends...');

        this.migrationService.compareData()
            .pipe(
                takeUntil(this.destroy$),
                timeout(60000),
                catchError(error => {
                    this.addMessage('error', 'Comparison Failed', error.message || 'Failed to compare data');
                    this.cdr.detectChanges();
                    return of(null);
                })
            )
            .subscribe(result => {
                this.isComparing = false;
                this.isLoading = false;

                if (result) {
                    this.comparisonResult = result;
                    
                    const totalUnmigrated = result.users.unmigrated.length + result.decks.unmigrated.length;
                    const totalChanged = result.users.changed.length + result.decks.changed.length;
                    const totalSynced = result.users.synced + result.decks.synced;
                    
                    this.addMessage('success', 'Comparison Complete', 
                        `Found ${totalUnmigrated} unmigrated items, ${totalChanged} changed items, and ${totalSynced} items in sync.`
                    );
                }
                
                this.cdr.detectChanges();
            });
    }

    migrateUnmigratedUsers() {
        if (!this.comparisonResult) return;

        this.isLoading = true;
        this.currentProgress = null;
        const count = this.comparisonResult.users.unmigrated.length;
        this.addMessage('info', 'Migrating Unmigrated Users', `Starting migration of ${count} users...`);

        this.migrationService.migrateUnmigratedUsers(this.comparisonResult.users.unmigrated)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: ({ progress, result }) => {
                    this.currentProgress = progress;
                    this.cdr.detectChanges();

                    if (result) {
                        this.isLoading = false;
                        if (result.success) {
                            this.addMessage('success', 'Unmigrated Users Complete', result.message);
                        } else {
                            this.addMessage('error', 'Migration Failed', result.message);
                        }
                        // Refresh comparison data
                        this.compareData();
                    }
                },
                error: (error) => {
                    this.isLoading = false;
                    this.addMessage('error', 'Migration Error', error.message);
                    this.cdr.detectChanges();
                }
            });
    }

    migrateUnmigratedDecks() {
        if (!this.comparisonResult) return;

        this.isLoading = true;
        this.currentProgress = null;
        const count = this.comparisonResult.decks.unmigrated.length;
        this.addMessage('info', 'Migrating Unmigrated Decks', `Starting migration of ${count} decks...`);

        this.migrationService.migrateUnmigratedDecks(this.comparisonResult.decks.unmigrated)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: ({ progress, result }) => {
                    this.currentProgress = progress;
                    this.cdr.detectChanges();

                    if (result) {
                        this.isLoading = false;
                        if (result.success) {
                            this.addMessage('success', 'Unmigrated Decks Complete', result.message);
                        } else {
                            this.addMessage('error', 'Migration Failed', result.message);
                        }
                        // Refresh comparison data
                        this.compareData();
                    }
                },
                error: (error) => {
                    this.isLoading = false;
                    this.addMessage('error', 'Migration Error', error.message);
                    this.cdr.detectChanges();
                }
            });
    }

    updateChangedUsers() {
        if (!this.comparisonResult) return;

        this.isLoading = true;
        this.currentProgress = null;
        const count = this.comparisonResult.users.changed.length;
        this.addMessage('info', 'Updating Changed Users', `Updating ${count} users with changes...`);

        this.migrationService.updateChangedUsers(this.comparisonResult.users.changed)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: ({ progress, result }) => {
                    this.currentProgress = progress;
                    this.cdr.detectChanges();

                    if (result) {
                        this.isLoading = false;
                        if (result.success) {
                            this.addMessage('success', 'User Updates Complete', result.message);
                        } else {
                            this.addMessage('error', 'Update Failed', result.message);
                        }
                        // Refresh comparison data
                        this.compareData();
                    }
                },
                error: (error) => {
                    this.isLoading = false;
                    this.addMessage('error', 'Update Error', error.message);
                    this.cdr.detectChanges();
                }
            });
    }

    updateChangedDecks() {
        if (!this.comparisonResult) return;

        this.isLoading = true;
        this.currentProgress = null;
        const count = this.comparisonResult.decks.changed.length;
        this.addMessage('info', 'Updating Changed Decks', `Updating ${count} decks with changes...`);

        this.migrationService.updateChangedDecks(this.comparisonResult.decks.changed)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: ({ progress, result }) => {
                    this.currentProgress = progress;
                    this.cdr.detectChanges();

                    if (result) {
                        this.isLoading = false;
                        if (result.success) {
                            this.addMessage('success', 'Deck Updates Complete', result.message);
                        } else {
                            this.addMessage('error', 'Update Failed', result.message);
                        }
                        // Refresh comparison data
                        this.compareData();
                    }
                },
                error: (error) => {
                    this.isLoading = false;
                    this.addMessage('error', 'Update Error', error.message);
                    this.cdr.detectChanges();
                }
            });
    }

    async syncAll() {
        if (!this.comparisonResult) return;

        this.addMessage('info', 'Full Sync Started', 'Starting comprehensive sync process...');

        // Process in order: unmigrated users -> changed users -> unmigrated decks -> changed decks
        const steps = [];

        if (this.comparisonResult.users.unmigrated.length > 0) {
            steps.push({ type: 'migrateUnmigratedUsers', count: this.comparisonResult.users.unmigrated.length });
        }
        if (this.comparisonResult.users.changed.length > 0) {
            steps.push({ type: 'updateChangedUsers', count: this.comparisonResult.users.changed.length });
        }
        if (this.comparisonResult.decks.unmigrated.length > 0) {
            steps.push({ type: 'migrateUnmigratedDecks', count: this.comparisonResult.decks.unmigrated.length });
        }
        if (this.comparisonResult.decks.changed.length > 0) {
            steps.push({ type: 'updateChangedDecks', count: this.comparisonResult.decks.changed.length });
        }

        if (steps.length === 0) {
            this.addMessage('info', 'Already In Sync', 'All data is already synchronized!');
            return;
        }

        // Start with the first step - the subsequent steps will be triggered automatically
        // by the compareData() call which refreshes the comparison result
        this.executeNextSyncStep(steps, 0);
    }

    private executeNextSyncStep(steps: { type: string; count: number }[], index: number) {
        if (index >= steps.length) {
            this.addMessage('success', 'Full Sync Complete', 'All data has been synchronized!');
            this.compareData();
            return;
        }

        const step = steps[index];
        
        switch (step.type) {
            case 'migrateUnmigratedUsers':
                this.executeSyncStepWithCallback(
                    () => this.migrationService.migrateUnmigratedUsers(this.comparisonResult!.users.unmigrated),
                    `Migrating ${step.count} unmigrated users`,
                    steps,
                    index
                );
                break;
            case 'updateChangedUsers':
                this.executeSyncStepWithCallback(
                    () => this.migrationService.updateChangedUsers(this.comparisonResult!.users.changed),
                    `Updating ${step.count} changed users`,
                    steps,
                    index
                );
                break;
            case 'migrateUnmigratedDecks':
                this.executeSyncStepWithCallback(
                    () => this.migrationService.migrateUnmigratedDecks(this.comparisonResult!.decks.unmigrated),
                    `Migrating ${step.count} unmigrated decks`,
                    steps,
                    index
                );
                break;
            case 'updateChangedDecks':
                this.executeSyncStepWithCallback(
                    () => this.migrationService.updateChangedDecks(this.comparisonResult!.decks.changed),
                    `Updating ${step.count} changed decks`,
                    steps,
                    index
                );
                break;
        }
    }

    private executeSyncStepWithCallback(
        observableFactory: () => any,
        message: string,
        steps: { type: string; count: number }[],
        currentIndex: number
    ) {
        this.isLoading = true;
        this.currentProgress = null;
        this.addMessage('info', 'Sync Step', message);

        observableFactory()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: ({ progress, result }: { progress: MigrationProgress; result?: any }) => {
                    this.currentProgress = progress;
                    this.cdr.detectChanges();

                    if (result) {
                        this.isLoading = false;
                        if (result.success) {
                            this.addMessage('success', 'Step Complete', result.message);
                        }
                        // Execute next step after a short delay
                        setTimeout(() => this.executeNextSyncStep(steps, currentIndex + 1), 500);
                    }
                },
                error: (error: any) => {
                    this.isLoading = false;
                    this.addMessage('error', 'Sync Step Failed', error.message);
                    this.cdr.detectChanges();
                }
            });
    }

    getProgressPercentage(): number {
        if (!this.currentProgress || this.currentProgress.total === 0) {
            return 0;
        }
        return Math.round((this.currentProgress.processed / this.currentProgress.total) * 100);
    }

    getMessageClass(type: string): string {
        switch (type) {
            case 'success':
                return 'bg-green-50 border-green-200 text-green-800';
            case 'error':
                return 'bg-red-50 border-red-200 text-red-800';
            case 'info':
            default:
                return 'bg-blue-50 border-blue-200 text-blue-800';
        }
    }

    addMessage(type: 'success' | 'error' | 'info', title: string, content: string) {
        this.messages.unshift({
            type,
            title,
            content,
            timestamp: new Date()
        });

        // Keep only the last 10 messages
        if (this.messages.length > 10) {
            this.messages = this.messages.slice(0, 10);
        }
    }

    trackMessage(index: number, message: any): any {
        return message.timestamp;
    }
}
