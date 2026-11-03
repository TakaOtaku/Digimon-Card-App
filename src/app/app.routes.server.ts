import { RenderMode, ServerRoute } from '@angular/ssr';

// Public pages are prerendered to static HTML at build time for search engines and link previews.
// Everything personal or parameterised stays client-rendered (served from index.csr.html).
export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'cards', renderMode: RenderMode.Prerender },
  { path: 'deckbuilder', renderMode: RenderMode.Prerender },
  { path: 'decks', renderMode: RenderMode.Prerender },
  { path: 'rulings', renderMode: RenderMode.Prerender },
  { path: 'products', renderMode: RenderMode.Prerender },
  { path: '**', renderMode: RenderMode.Client },
];
