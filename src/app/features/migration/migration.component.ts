import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { MigrationService, MigrationResult, MigrationProgress } from '../../services/migration.service';

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
              <span class="font-medium">Legacy Backend</span>
            </div>
            <p class="text-sm text-gray-600 mt-1">
              {{ connectionStatus.legacy ? 'Connected' : 'Disconnected' }}
            </p>
          </div>
          
          <div class="p-4 rounded-lg" [class]="connectionStatus.mongo ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'">
            <div class="flex items-center">
              <div class="w-3 h-3 rounded-full mr-3" [class]="connectionStatus.mongo ? 'bg-green-500' : 'bg-red-500'"></div>
              <span class="font-medium">MongoDB Backend</span>
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
            <div class="text-2xl font-bold text-blue-600">{{ migrationStatus.legacy.users }}</div>
            <div class="text-sm text-gray-600">Legacy Users</div>
          </div>
          <div class="text-center p-4 bg-blue-50 rounded-lg">
            <div class="text-2xl font-bold text-blue-600">{{ migrationStatus.legacy.decks }}</div>
            <div class="text-sm text-gray-600">Legacy Decks</div>
          </div>
          <div class="text-center p-4 bg-green-50 rounded-lg">
            <div class="text-2xl font-bold text-green-600">{{ migrationStatus.mongo.users }}</div>
            <div class="text-sm text-gray-600">Migrated Users</div>
          </div>
          <div class="text-center p-4 bg-green-50 rounded-lg">
            <div class="text-2xl font-bold text-green-600">{{ migrationStatus.mongo.decks }}</div>
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
          </div>

          <!-- Migration Actions -->
          <div class="flex flex-wrap gap-3">
            <button 
              (click)="migrateUsers()"
              [disabled]="isLoading || !connectionStatus.legacy || !connectionStatus.mongo"
              class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed">
              Migrate Users
            </button>

            <button 
              (click)="migrateDecks()"
              [disabled]="isLoading || !connectionStatus.legacy || !connectionStatus.mongo"
              class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed">
              Migrate Decks
            </button>

            <button 
              (click)="migrateAll()"
              [disabled]="isLoading || !connectionStatus.legacy || !connectionStatus.mongo"
              class="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed">
              Migrate All Data
            </button>
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
    connectionStatus = { legacy: false, mongo: false };
    migrationStatus: any = null;
    currentProgress: MigrationProgress | null = null;
    messages: Array<{
        type: 'success' | 'error' | 'info';
        title: string;
        content: string;
        timestamp: Date;
    }> = [];

    constructor(private migrationService: MigrationService) { }

    ngOnInit() {
        this.testConnections();
        this.refreshStatus();
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    testConnections() {
        this.isLoading = true;
        this.addMessage('info', 'Testing Connections', 'Checking connectivity to both backends...');

        this.migrationService.testLegacyConnection()
            .pipe(takeUntil(this.destroy$))
            .subscribe(result => {
                this.connectionStatus.legacy = result.success;
                if (!result.success) {
                    this.addMessage('error', 'Legacy Connection Failed', result.message);
                }
            });

        this.migrationService.testMongoConnection()
            .pipe(takeUntil(this.destroy$))
            .subscribe(result => {
                this.connectionStatus.mongo = result.success;
                this.isLoading = false;

                if (result.success) {
                    this.addMessage('success', 'MongoDB Connection', 'Successfully connected to MongoDB backend');
                } else {
                    this.addMessage('error', 'MongoDB Connection Failed', result.message);
                }
            });
    }

    refreshStatus() {
        this.migrationService.getMigrationStatus()
            .pipe(takeUntil(this.destroy$))
            .subscribe(status => {
                this.migrationStatus = status;
                this.connectionStatus = status.connectionStatus;
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
