import { computed, inject, Injectable, signal } from '@angular/core';
import { BookApiService } from './book-api.service';
import { Book } from './book';

@Injectable({ providedIn: 'root' })
export class BookService {
  private readonly bookApi = inject(BookApiService);
  private readonly favoritesKey = 'favoriteBookIds';

  readonly maxBorrowed: number = 10;
  readonly loading = signal(true);
  readonly loadError = signal('');

  private readonly _books = signal<Book[]>([]);
  readonly books = this._books.asReadonly();

  readonly borrowedBooks = computed(() => this.books().filter(book => !book.available));
  readonly availableBooks = computed(() => this.books().filter(book => book.available));
  readonly favoriteBooks = computed(() => this.books().filter(book => book.favorite));

  constructor() {
    this.bookApi.getBooks().subscribe({
      next: books => {
        this._books.set(this.limitBorrowed(this.applySavedFavorites(books)));
        this.loading.set(false);
      },
      error: error => {
        console.error('Načítanie kníh zo servera zlyhalo:', error);
        this.loadError.set('Knihy sa nepodarilo načítať. Skontroluj, či JSON Server beží.');
        this.loading.set(false);
      }
    });
  }

  private loadFavoriteIds(): number[] {
    const saved = localStorage.getItem(this.favoritesKey);
    if (!saved) return [];

    try {
      const ids = JSON.parse(saved);
      return Array.isArray(ids) ? ids.map(id => Number(id)) : [];
    } catch {
      return [];
    }
  }

  private applySavedFavorites(books: Book[]): Book[] {
    const ids = this.loadFavoriteIds();
    return books.map(book => ({
      ...book,
      favorite: ids.includes(Number(book.id))
    }));
  }

  private saveFavoriteIds(): void {
    const ids = this.books()
      .filter(book => book.favorite)
      .map(book => Number(book.id));
    localStorage.setItem(this.favoritesKey, JSON.stringify(ids));
  }

  toggleFavorite(id: number): void {
    this._books.update(books =>
      books.map(book => Number(book.id) === Number(id)
        ? { ...book, favorite: !book.favorite }
        : book)
    );
    this.saveFavoriteIds();
  }

  limitBorrowed(books: Book[]): Book[] {
    let borrowedCount = 0;

    return books.map(book => {
      if (book.available) {
        return book;
      }

      borrowedCount++;

      if (borrowedCount > this.maxBorrowed) {
        return { ...book, available: true };
      }

      return book;
    });
  }

  addBook(book: Book): void {
    this._books.update(oldBooks => {
      const maxId = Math.max(0, ...oldBooks.map(b => Number(b.id) || 0));
      return [{ ...book, id: maxId + 1 }, ...oldBooks];
    });
  }

  updateBook(updated: Book): void {
    this._books.update(books =>
      books.map(book => Number(book.id) === Number(updated.id) ? updated : book)
    );
  }

  deleteBook(id: number): void {
    this._books.update(books =>
      books.filter(book => Number(book.id) !== Number(id))
    );
  }

  borrowBook(id: number): boolean {
    if (!this.canBorrowBook(id)) return false;
    this._books.update(books =>
      books.map(book => Number(book.id) === Number(id)
        ? { ...book, available: false }
        : book)
    );
    return true;
  }

  returnBook(id: number): void {
    this._books.update(books =>
      books.map(book => Number(book.id) === Number(id)
        ? { ...book, available: true }
        : book)
    );
  }

  getFilteredBooks(
    searchText: string,
    availability: string,
    sortBy: string
  ): Book[] {
    const text = searchText.trim().toLowerCase();

    let result = this.books().filter(book =>
      book.title.toLowerCase().includes(text) ||
      book.author.toLowerCase().includes(text)
    );

    if (availability === 'available') {
      result = result.filter(book => book.available);
    } else if (availability === 'borrowed') {
      result = result.filter(book => !book.available);
    }

    switch (sortBy) {
      case 'title':
        result = [...result].sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'year':
        result = [...result].sort((a, b) => b.year - a.year);
        break;
    }

    return result;
  }

  countAvailableBooks(): number {
    return this.books().filter(book => book.available).length;
  }

  countFavoriteBooks(): number {
    return this.books().filter(book => book.favorite).length;
  }

  countAllBooks(): number {
    return this.books().length;
  }

  getBookById(id: number): Book | undefined {
    return this.books().find(book => Number(book.id) === Number(id));
  }

  getAvailableBooks(): Book[] {
    return this.books().filter(book => book.available);
  }

  getFavoriteBooks(): Book[] {
    return this.books().filter(book => book.favorite);
  }

  getTotalBooksCount(): number {
    return this.books().length;
  }

  canBorrowBook(id: number): boolean {
    const book = this.getBookById(id);
    return !!book && book.available &&
      this.borrowedBooks().length < this.maxBorrowed;
  }

  getSortedBooks(sortBy: string): Book[] {
    const result = [...this.books()];
    switch (sortBy) {
      case 'title':
        return result.sort((a, b) => a.title.localeCompare(b.title));
      case 'year':
        return result.sort((a, b) => b.year - a.year);
      default:
        return result;
    }
  }
}