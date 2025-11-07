import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { first, map, Observable } from 'rxjs';
import { DigimonCard, IColor, ICountCard, IDeck, ISave, ISettings, IUser } from '@models';
import { CARDSET, IBlog, IBlogWithText, ITag } from '@models';
import { sortByReleaseOrder } from '@models';
import { emptySettings } from '@models';
import { IUserAndDecks } from '@models';
import { checkDeckErrors, setDeckImage } from '@functions';

/**
 * Pagination response interface
 */
export interface IPaginationResponse<T> {
    data: T[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalDecks: number;
        limit: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
}

/**
 * Deck filter options
 */
export interface IDeckFilter {
    page?: number;
    limit?: number;
    id?: string;
    title?: string;
    user?: string;
    tags?: string[];
    search?: string;
    cardSet?: string;
}

/**
 * MongoDB Backend Service
 * 
 * This service handles all communication with the new MongoDB backend.
 * It replaces the legacy MySQL backend service for production use.
 */
@Injectable({
    providedIn: 'root',
})
export class MongoBackendService {
    private readonly baseUrl = 'http://digimoncardapp.backend.takaotaku.de/api/';

    constructor(private http: HttpClient) { }

    // ===== DECK OPERATIONS =====

    /**
     * Get all decks from MongoDB backend (legacy method - returns all decks)
     * @param url Optional URL override (defaults to MongoDB backend)
     * @returns Observable array of decks
     */
    getDecks(url: string = this.baseUrl): Observable<IDeck[]> {
        return this.http.get<any[]>(url + 'decks').pipe(
            map((decks) => {
                return decks
                    .map((deck) => this.parseDeckFromMongo(deck))
                    .sort(sortByReleaseOrder);
            }),
        );
    }

    /**
     * Get paginated decks with filtering
     * @param filters Filter and pagination options
     * @param url Optional URL override (defaults to MongoDB backend)
     * @returns Observable paginated deck response
     */
    getDecksPaginated(filters: IDeckFilter = {}, url: string = this.baseUrl): Observable<IPaginationResponse<IDeck>> {
        // Build query parameters
        const params = new URLSearchParams();

        if (filters.page) params.append('page', filters.page.toString());
        if (filters.limit) params.append('limit', filters.limit.toString());
        if (filters.id) params.append('id', filters.id);
        if (filters.title) params.append('title', filters.title);
        if (filters.user) params.append('user', filters.user);
        if (filters.search) params.append('search', filters.search);
        if (filters.cardSet) params.append('cardSet', filters.cardSet);
        if (filters.tags && filters.tags.length > 0) {
            params.append('tags', JSON.stringify(filters.tags));
        }

        return this.http.get<any>(url + 'decks?' + params.toString()).pipe(
            map((response) => {
                // Handle both old format (array) and new format (object with pagination)
                if (Array.isArray(response)) {
                    // Legacy response format
                    const decks = response.map((deck) => this.parseDeckFromMongo(deck));
                    return {
                        data: decks,
                        pagination: {
                            currentPage: 1,
                            totalPages: 1,
                            totalDecks: decks.length,
                            limit: decks.length,
                            hasNextPage: false,
                            hasPrevPage: false
                        }
                    };
                } else {
                    // New paginated response format
                    const decks = response.decks.map((deck: any) => this.parseDeckFromMongo(deck));
                    return {
                        data: decks,
                        pagination: response.pagination
                    };
                }
            }),
        );
    }

    /**
     * Get a specific deck by ID
     * @param id Deck ID
     * @returns Observable deck
     */
    getDeck(id: string): Observable<IDeck> {
        return this.http.get<any>(`${this.baseUrl}decks/${id}`).pipe(
            map((deck) => this.parseDeckFromMongo(deck))
        );
    }

    /**
     * Create a new deck
     * @param data Deck data to create
     * @returns Observable with creation result
     */
    createDeck(data: IDeck): Observable<any> {
        const deckData = this.prepareDeckForMongo(data);
        return this.http.post(this.baseUrl + 'decks', deckData);
    }

    /**
     * Update an existing deck
     * @param deck Deck to update
     * @param user Optional user information
     * @param allCards All available cards for image selection
     * @returns Observable with update result
     */
    updateDeck(deck: IDeck, user: IUser | null = null, allCards: DigimonCard[]): Observable<any> {
        let deckData = this.prepareDeckForMongo(deck);

        if (user) {
            deckData = {
                ...deckData,
                user: user.displayName ?? 'Unknown',
                userId: user.uid ?? 'Unknown',
                date: new Date().toISOString(),
            };
        }

        if (!deckData.imageCardId || deckData.imageCardId === 'BT1-001') {
            const deckWithImage = setDeckImage(deck, allCards);
            deckData.imageCardId = deckWithImage.id;
        }

        return this.http.put(`${this.baseUrl}decks/${deck.id}`, deckData);
    }

    /**
     * Delete a deck
     * @param id Deck ID to delete
     * @returns Observable with deletion result
     */
    deleteDeck(id: string): Observable<any> {
        return this.http.delete(`${this.baseUrl}decks/${id}`);
    }

    // ===== USER OPERATIONS =====

    /**
     * Get user decks (formatted for user/deck display)
     * @param url Optional URL override
     * @returns Observable array of user and their decks
     */
    getUserDecks(url: string = this.baseUrl): Observable<IUserAndDecks[]> {
        return this.http.get<any[]>(url + 'users/decks').pipe(
            map((array: any[]) => {
                return array.filter((user) => user[1] !== '[]');
            }),
            map((array: any[]) => {
                const userAndDecks: IUserAndDecks[] = [];
                array.forEach((user) => {
                    let parsedDecks: any[] = JSON.parse(user[1]);
                    userAndDecks.push({ user: user[0], decks: parsedDecks });
                });
                return userAndDecks;
            }),
        );
    }

    /**
     * Get all user saves
     * @param url Optional URL override
     * @returns Observable array of user saves
     */
    getSaves(url: string = this.baseUrl): Observable<ISave[]> {
        return this.http.get<any[]>(url + 'users').pipe(
            map((saves) => {
                return saves.map((save) => this.parseSaveFromMongo(save));
            }),
        );
    }

    /**
     * Get a specific user save
     * @param id User ID
     * @returns Observable user save
     */
    getSave(id: string): Observable<ISave> {
        return this.http.get<any>(`${this.baseUrl}users/${id}`).pipe(
            map((save) => this.parseAndValidateSave(save))
        );
    }

    /**
     * Update a user save
     * @param save User save data
     * @returns Observable with update result
     */
    updateSave(save: ISave): Observable<any> {
        const saveData = this.prepareSaveForMongo(save);
        return this.http.put(`${this.baseUrl}users/${save.uid}`, saveData);
    }

    // ===== BLOG OPERATIONS =====
    // Note: These may need to be implemented in your MongoDB backend

    /**
     * Get blog entries
     * @param url Optional URL override
     * @returns Observable array of blog entries
     */
    getBlogEntries(url: string = this.baseUrl): Observable<IBlog[]> {
        return this.http.get<IBlog[]>(url + 'blogs');
    }

    /**
     * Get blog entries with text content
     * @param url Optional URL override
     * @returns Observable array of blog entries with text
     */
    getBlogEntriesWithText(url: string = this.baseUrl): Observable<IBlogWithText[]> {
        return this.http.get<IBlogWithText[]>(url + 'blogs-with-text');
    }

    /**
     * Get a specific blog entry with text
     * @param id Blog entry ID
     * @returns Observable blog entry with text
     */
    getBlogEntryWithText(id: string): Observable<IBlogWithText> {
        return this.http.get<IBlogWithText>(`${this.baseUrl}blogs-with-text/${id}`).pipe(
            map((blog) => {
                const text = JSON.parse(blog.text);
                return { ...blog, text } as IBlogWithText;
            }),
        );
    }

    /**
     * Create a blog entry
     * @param data Blog data
     * @returns Observable with creation result
     */
    createBlog(data: IBlog): Observable<any> {
        return this.http.post(this.baseUrl + 'blogs', data);
    }

    /**
     * Create a blog entry with text
     * @param data Blog data with text
     * @returns Observable with creation result
     */
    createBlogWithText(data: IBlogWithText): Observable<any> {
        return this.http.post(this.baseUrl + 'blogs-with-text', data);
    }

    /**
     * Update a blog entry
     * @param blog Blog to update
     * @returns Observable with update result
     */
    updateBlog(blog: IBlog): Observable<any> {
        return this.http.put(`${this.baseUrl}blogs/${blog.uid}`, blog);
    }

    /**
     * Update a blog entry with text
     * @param blog Blog with text to update
     * @returns Observable with update result
     */
    updateBlogWithText(blog: IBlogWithText): Observable<any> {
        return this.http.put(`${this.baseUrl}blogs-with-text/${blog.uid}`, blog);
    }

    /**
     * Delete a blog entry
     * @param id Blog ID
     * @returns Observable with deletion result
     */
    deleteBlogEntry(id: string): Observable<any> {
        return this.http.delete(`${this.baseUrl}blogs/${id}`);
    }

    /**
     * Delete a blog entry with text
     * @param id Blog ID
     * @returns Observable with deletion result
     */
    deleteBlogEntryWithText(id: string): Observable<any> {
        return this.http.delete(`${this.baseUrl}blogs-with-text/${id}`);
    }

    // ===== HELPER METHODS =====

    /**
     * Parse deck data from MongoDB format to application format
     */
    private parseDeckFromMongo(deck: any): IDeck {
        const cards: ICountCard[] = JSON.parse(deck.cards || '[]');
        const sideDeck: ICountCard[] = JSON.parse(deck.sideDeck || '[]');
        const color: IColor = JSON.parse(deck.color || '{}');
        const tags: ITag[] = JSON.parse(deck.tags || '[]');
        const likes: string[] = deck.likes ? JSON.parse(deck.likes) : [];

        return {
            ...deck,
            id: deck._id || deck.id, // MongoDB uses _id
            likes,
            cards,
            sideDeck,
            color,
            tags,
        } as IDeck;
    }

    /**
     * Prepare deck data for MongoDB storage
     */
    private prepareDeckForMongo(deck: IDeck): any {
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
     * Parse save data from MongoDB format to application format
     */
    private parseSaveFromMongo(save: any): ISave {
        const collection: ICountCard[] = save.cardCollection || [];
        const decks: IDeck[] = JSON.parse(save.decks || '[]');
        const settings: ISettings = save.settings || {};

        return {
            ...save,
            uid: save._id || save.uid, // MongoDB uses _id
            photoUrl: save.photoURL || save.photoUrl, // Handle both formats
            collection,
            decks,
            settings,
        } as ISave;
    }

    /**
     * Prepare save data for MongoDB storage
     */
    private prepareSaveForMongo(save: ISave): any {
        return {
            uid: save.uid,
            cardCollection: save.collection,
            decks: JSON.stringify(save.decks || []),
            displayName: save.displayName,
            photoURL: save.photoUrl,
            settings: save.settings,
            version: save.version || 1
        };
    }

    /**
     * Parse and validate save data (similar to legacy service)
     */
    private parseAndValidateSave(save: any): ISave {
        const parsedSave = this.parseSaveFromMongo(save);

        // Apply the same validation logic as the legacy service
        const validatedSave = this.checkSaveValidity(parsedSave);

        return validatedSave;
    }

    /**
     * Check save validity and apply defaults (from legacy service)
     */
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
            if (!save.photoUrl) {
                save = { ...save, photoUrl: user.photoURL };
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
            if (!save.photoUrl) {
                save = { ...save, photoUrl: '' };
                changedSave = true;
            }

            save.settings.collectionSets = save.settings.collectionSets ?? [];
            save.settings.showReprintCards = save.settings.showReprintCards ?? false;
            save.settings.showSpecialRareCards = save.settings.showSpecialRareCards ?? false;
            save.settings.deckDisplayTable = save.settings.deckDisplayTable ?? false;
            save.settings.showRarePullCards = save.settings.showRarePullCards ?? false;
            save.settings.showNormalCards = save.settings.showNormalCards ?? false;

            save.decks = checkDeckErrors(save.decks);
        }

        if (save.settings.cardSet === undefined || save.settings.cardSet === 'Overwrite' || +save.settings.cardSet >>> 0) {
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
