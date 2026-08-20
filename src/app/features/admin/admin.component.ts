import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { MongoBackendService } from '@services';
import { IDeck, ISave } from '@models';

type AdminTab = 'users' | 'decks' | 'analytics';

@Component({
  selector: 'digimon-admin',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mx-auto max-w-6xl p-4 text-gray-100">
      <h1 class="mb-4 text-3xl font-bold">Admin</h1>

      <div class="mb-4 flex gap-2 border-b border-gray-700">
        @for (t of tabs; track t.id) {
          <button
            type="button"
            (click)="selectTab(t.id)"
            class="px-4 py-2 text-sm font-medium"
            [class.border-b-2]="tab() === t.id"
            [class.border-primary]="tab() === t.id"
            [class.text-white]="tab() === t.id"
            [class.text-gray-400]="tab() !== t.id">
            {{ t.label }}
          </button>
        }
      </div>

      @if (error(); as err) {
        <div class="mb-3 rounded bg-red-900/40 px-3 py-2 text-red-200">{{ err }}</div>
      }
      @if (loading()) {
        <div class="py-6 text-gray-400">Loading…</div>
      }

      @switch (tab()) {
        @case ('users') {
          <div class="text-sm text-gray-400 mb-2">{{ users().length }} users</div>
          <div class="overflow-x-auto rounded border border-gray-700">
            <table class="w-full text-left text-sm">
              <thead class="bg-gray-800 text-gray-300">
                <tr><th class="p-2">Name</th><th class="p-2">UID</th><th class="p-2 w-24">Aktion</th></tr>
              </thead>
              <tbody>
                @for (u of users(); track u.uid) {
                  <tr class="border-t border-gray-800">
                    <td class="p-2">{{ u.displayName || '—' }}</td>
                    <td class="p-2 font-mono text-xs text-gray-400">{{ u.uid }}</td>
                    <td class="p-2">
                      <button type="button" (click)="deleteUser(u)"
                        class="rounded bg-red-700 px-2 py-1 text-xs text-white hover:bg-red-600">Löschen</button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
        @case ('decks') {
          <div class="text-sm text-gray-400 mb-2">{{ decks().length }} decks (erste 100)</div>
          <div class="overflow-x-auto rounded border border-gray-700">
            <table class="w-full text-left text-sm">
              <thead class="bg-gray-800 text-gray-300">
                <tr><th class="p-2">Titel</th><th class="p-2">Besitzer</th><th class="p-2 w-24">Aktion</th></tr>
              </thead>
              <tbody>
                @for (d of decks(); track d.id) {
                  <tr class="border-t border-gray-800">
                    <td class="p-2">{{ d.title || '—' }}</td>
                    <td class="p-2 text-gray-400">{{ d.user || '—' }}</td>
                    <td class="p-2">
                      <button type="button" (click)="deleteDeck(d)"
                        class="rounded bg-red-700 px-2 py-1 text-xs text-white hover:bg-red-600">Löschen</button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
        @case ('analytics') {
          <div class="rounded border border-gray-700 p-4">
            <p class="text-gray-300">Analytics-Dashboard folgt (Umami).</p>
            <a href="https://umami.takaotaku.de" target="_blank" rel="noopener"
              class="mt-2 inline-block text-primary underline">Umami öffnen</a>
          </div>
        }
      }
    </div>
  `,
})
export class AdminComponent implements OnInit {
  private readonly backend = inject(MongoBackendService);

  protected readonly tabs: { id: AdminTab; label: string }[] = [
    { id: 'users', label: 'Users' },
    { id: 'decks', label: 'Decks' },
    { id: 'analytics', label: 'Analytics' },
  ];

  protected readonly tab = signal<AdminTab>('users');
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly users = signal<ISave[]>([]);
  protected readonly decks = signal<IDeck[]>([]);

  ngOnInit(): void {
    this.loadUsers();
  }

  selectTab(tab: AdminTab): void {
    this.tab.set(tab);
    if (tab === 'users' && this.users().length === 0) this.loadUsers();
    if (tab === 'decks' && this.decks().length === 0) this.loadDecks();
  }

  private loadUsers(): void {
    this.loading.set(true);
    this.error.set(null);
    this.backend.getSaves().subscribe({
      next: (users) => {
        this.users.set(users);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.message ?? 'Fehler beim Laden der Users.');
        this.loading.set(false);
      },
    });
  }

  private loadDecks(): void {
    this.loading.set(true);
    this.error.set(null);
    this.backend.getDecksPaginated({ limit: 100 }).subscribe({
      next: (res) => {
        this.decks.set(res.data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.message ?? 'Fehler beim Laden der Decks.');
        this.loading.set(false);
      },
    });
  }

  deleteUser(user: ISave): void {
    if (!user.uid || !confirm(`User "${user.displayName ?? user.uid}" wirklich löschen?`)) return;
    this.backend.deleteSave(user.uid).subscribe({
      next: () => this.users.update((list) => list.filter((u) => u.uid !== user.uid)),
      error: (err) => this.error.set(err?.message ?? 'Löschen fehlgeschlagen.'),
    });
  }

  deleteDeck(deck: IDeck): void {
    if (!deck.id || !confirm(`Deck "${deck.title}" wirklich löschen?`)) return;
    this.backend.deleteDeck(deck.id).subscribe({
      next: () => this.decks.update((list) => list.filter((d) => d.id !== deck.id)),
      error: (err) => this.error.set(err?.message ?? 'Löschen fehlgeschlagen.'),
    });
  }
}
