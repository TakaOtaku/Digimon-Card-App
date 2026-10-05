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
          <div class="mb-2 flex items-center">
            <span class="ml-auto text-sm text-gray-400">{{ usersTotal() }} users · Seite {{ usersPage() }}/{{ usersTotalPages() }}</span>
          </div>
          <div class="overflow-x-auto rounded border border-gray-700">
            <table class="w-full text-left text-sm">
              <thead class="bg-gray-800 text-gray-300">
                <tr><th class="p-2">Name</th><th class="p-2">UID</th><th class="p-2 w-40">Aktion</th></tr>
              </thead>
              <tbody>
                @for (u of users(); track u.uid) {
                  <tr class="border-t border-gray-800">
                    <td class="p-2">{{ u.displayName || '—' }}</td>
                    <td class="p-2 font-mono text-xs text-gray-400">{{ u.uid }}</td>
                    <td class="p-2 flex gap-1">
                      <button type="button" (click)="showUserDecks(u)"
                        class="rounded bg-gray-700 px-2 py-1 text-xs hover:bg-gray-600">Decks</button>
                      <button type="button" (click)="deleteUser(u)"
                        class="rounded bg-red-700 px-2 py-1 text-xs text-white hover:bg-red-600">Löschen</button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
          <div class="mt-2 flex gap-2">
            <button type="button" [disabled]="usersPage() <= 1" (click)="loadUsers(usersPage() - 1)"
              class="rounded bg-gray-700 px-3 py-1 text-xs hover:bg-gray-600 disabled:opacity-40">Zurück</button>
            <button type="button" [disabled]="usersPage() >= usersTotalPages()" (click)="loadUsers(usersPage() + 1)"
              class="rounded bg-gray-700 px-3 py-1 text-xs hover:bg-gray-600 disabled:opacity-40">Weiter</button>
          </div>
          @if (selectedUser(); as su) {
            <div class="mt-4 rounded border border-gray-700 p-3">
              <div class="mb-2 flex items-center">
                <h3 class="text-lg font-medium text-gray-200">Decks von {{ su.displayName || su.uid }}</h3>
                <button type="button" (click)="selectedUser.set(null)"
                  class="ml-auto rounded bg-gray-700 px-2 py-1 text-xs hover:bg-gray-600">Schließen</button>
              </div>
              @if (userDecks().length === 0) {
                <div class="text-sm text-gray-400">Keine Decks.</div>
              }
              @for (d of userDecks(); track d.id) {
                <div class="flex items-center border-t border-gray-800 py-1 text-sm">
                  <span>{{ d.title || '—' }}</span>
                  <span class="ml-2 text-xs text-gray-500">{{ d.likes?.length ?? 0 }} Likes</span>
                  <button type="button" (click)="deleteUserDeck(d)"
                    class="ml-auto rounded bg-red-700 px-2 py-1 text-xs text-white hover:bg-red-600">Löschen</button>
                </div>
              }
            </div>
          }
        }
        @case ('decks') {
          <div class="mb-2 flex items-center gap-2">
            <input #q type="text" placeholder="Titel/Suche…"
              class="rounded border border-gray-700 bg-gray-800 px-2 py-1 text-sm"
              (keyup.enter)="decksSearch.set(q.value); loadDecks(1)" />
            <button type="button" (click)="decksSearch.set(q.value); loadDecks(1)"
              class="rounded bg-gray-700 px-2 py-1 text-xs hover:bg-gray-600">Suchen</button>
            <span class="ml-auto text-sm text-gray-400">{{ decksTotal() }} decks · Seite {{ decksPage() }}/{{ decksTotalPages() }}</span>
          </div>
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
          <div class="mt-2 flex gap-2">
            <button type="button" [disabled]="decksPage() <= 1" (click)="loadDecks(decksPage() - 1)"
              class="rounded bg-gray-700 px-3 py-1 text-xs hover:bg-gray-600 disabled:opacity-40">Zurück</button>
            <button type="button" [disabled]="decksPage() >= decksTotalPages()" (click)="loadDecks(decksPage() + 1)"
              class="rounded bg-gray-700 px-3 py-1 text-xs hover:bg-gray-600 disabled:opacity-40">Weiter</button>
          </div>
        }
        @case ('analytics') {
          <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div class="rounded border border-gray-700 p-4">
              <div class="text-2xl font-bold text-blue-400">{{ statUsers() }}</div>
              <div class="text-sm text-gray-400">Nutzer</div>
            </div>
            <div class="rounded border border-gray-700 p-4">
              <div class="text-2xl font-bold text-green-400">{{ statDecks() }}</div>
              <div class="text-sm text-gray-400">Decks</div>
            </div>
          </div>
          <h3 class="mt-4 mb-2 text-lg font-medium text-gray-200">Top Decks (Likes)</h3>
          <div class="overflow-x-auto rounded border border-gray-700">
            <table class="w-full text-left text-sm">
              <thead class="bg-gray-800 text-gray-300">
                <tr><th class="p-2">Titel</th><th class="p-2">Besitzer</th><th class="p-2 w-20">Likes</th></tr>
              </thead>
              <tbody>
                @for (d of topDecks(); track d.id) {
                  <tr class="border-t border-gray-800">
                    <td class="p-2">{{ d.title || '—' }}</td>
                    <td class="p-2 text-gray-400">{{ d.user || '—' }}</td>
                    <td class="p-2">{{ d.likes?.length ?? 0 }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
          <a href="https://umami.takaotaku.de" target="_blank" rel="noopener"
            class="mt-3 inline-block text-primary underline">Umami-Dashboard öffnen</a>
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
  protected readonly decksPage = signal(1);
  protected readonly decksTotalPages = signal(1);
  protected readonly decksTotal = signal(0);
  protected readonly decksSearch = signal('');
  protected readonly usersPage = signal(1);
  protected readonly usersTotalPages = signal(1);
  protected readonly usersTotal = signal(0);
  protected readonly statUsers = signal(0);
  protected readonly statDecks = signal(0);
  protected readonly topDecks = signal<IDeck[]>([]);
  protected readonly selectedUser = signal<ISave | null>(null);
  protected readonly userDecks = signal<IDeck[]>([]);

  ngOnInit(): void {
    this.loadUsers();
  }

  selectTab(tab: AdminTab): void {
    this.tab.set(tab);
    if (tab === 'users' && this.users().length === 0) this.loadUsers();
    if (tab === 'decks' && this.decks().length === 0) this.loadDecks();
    if (tab === 'analytics') this.loadStats();
  }

  loadUsers(page = 1): void {
    this.loading.set(true);
    this.error.set(null);
    this.backend.getSavesPaginated(page, 50).subscribe({
      next: (res) => {
        this.users.set(res.data);
        this.usersPage.set(res.page);
        this.usersTotalPages.set(res.totalPages);
        this.usersTotal.set(res.totalUsers);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.message ?? 'Fehler beim Laden der Users.');
        this.loading.set(false);
      },
    });
  }

  private loadStats(): void {
    this.backend.getSavesPaginated(1, 1).subscribe({ next: (r) => this.statUsers.set(r.totalUsers) });
    this.backend.getDecksPaginated({ page: 1, limit: 1 }).subscribe({ next: (r) => this.statDecks.set(r.pagination.totalDecks) });
    this.backend.getTopDecks(10).subscribe({ next: (d) => this.topDecks.set(d) });
  }

  loadDecks(page = 1): void {
    this.loading.set(true);
    this.error.set(null);
    const search = this.decksSearch().trim();
    this.backend.getDecksPaginated({ page, limit: 50, search: search || undefined }).subscribe({
      next: (res) => {
        this.decks.set(res.data);
        this.decksPage.set(res.pagination.currentPage);
        this.decksTotalPages.set(res.pagination.totalPages);
        this.decksTotal.set(res.pagination.totalDecks);
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

  showUserDecks(user: ISave): void {
    this.selectedUser.set(user);
    this.userDecks.set([]);
    if (!user.uid) return;
    this.backend.getDecksByUser(user.uid).subscribe({
      next: (decks) => this.userDecks.set(decks),
      error: (err) => this.error.set(err?.message ?? 'Fehler beim Laden der Decks.'),
    });
  }

  deleteUserDeck(deck: IDeck): void {
    if (!deck.id || !confirm(`Deck "${deck.title}" wirklich löschen?`)) return;
    this.backend.deleteDeck(deck.id).subscribe({
      next: () => this.userDecks.update((list) => list.filter((d) => d.id !== deck.id)),
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
