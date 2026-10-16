import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonToggleModule } from '@angular/material/button-toggle'; 
import { MatSelectModule } from '@angular/material/select'; 
import { BookCard } from '../book-card/book-card';
import { Book } from '../../book';
import { generateBooks } from '../../book-generator';
import { Cart } from '../../../cart/components/cart/cart';
import { BookFormComponent } from '../book-form/book-form';
import { BookService } from '../../book.service';


@Component({
  selector: 'app-book-list',
  imports: [
    FormsModule,
    BookCard,
    Cart,
    BookFormComponent,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonToggleModule,
    MatSelectModule
  ],
  templateUrl: './book-list.html',
  styleUrl: './book-list.css'
})
export class BookList {
  private bookService = inject(BookService);
  myBooks: Book[] = [
    { id: 1, title: 'Hobit', author: 'J. R. R. Tolkien', year: 1937, available: true, genre: 'Fantasy', rating: 5, pages: 310, favorite: false },
    { id: 2, title: '1984', author: 'George Orwell', year: 1947, available: false, genre: 'Dystopia', rating: 5, pages: 310, favorite: false },
    { id: 3, title: 'Malý Princ', author: 'Exupéry', year: 1943, available: true, genre: 'Fiction', rating: 5, pages: 310, favorite: false }
  ];

  maxBorrowed: number = this.bookService.maxBorrowed;
  books: Book[] = this.bookService.getBooks();

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

  
  searchText: string = '';
  availabilityFilter: string = 'all'; 
  sortBy: string = 'none'; 

  currentPage: number = 1;
  pageSize: number = 5;

  visibleBooks(): Book[] {
  return this.bookService.getFilteredBooks(
    this.searchText,
    this.availabilityFilter,
    this.sortBy
  );
}
  onFilterChange(): void {
    this.currentPage = 1;
  }

  clearSearch(): void {
    this.searchText = '';
    this.onFilterChange();
  }

  pageCount(): number {
    return Math.max(1, Math.ceil(this.visibleBooks().length / this.pageSize));
  }

  isOnCurrentPage(index: number): boolean {
    const start = (this.currentPage - 1) * this.pageSize;
    return index >= start && index < start + this.pageSize;
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.pageCount()) {
      this.currentPage++;
    }
  }

  borrowedBooks(): Book[] {
    return this.bookService.borrowedBooks();
  }

  borrow(book: Book): void {
    if (!this.bookService.borrowBook(book.id)) {
      alert(`Naraz môžeš mať požičaných najviac ${this.maxBorrowed} kníh. Najskôr nejakú vráť.`);
      return;
    }
    this.refreshBooks();
  }

  giveBack(book: Book): void {
    this.bookService.returnBook(book.id);
    this.refreshBooks();
  }

  addBook(book: Book): void {
    const maxId = Math.max(0, ...this.books.map(b => b.id));
    this.books = [{ ...book, id: maxId + 1 }, ...this.books];
  }

  updateBook(updated: Book): void {
    this.books = this.books.map(book => book.id === updated.id ? updated : book);
  }

  deleteBook(id: number): void {
    this.books = this.books.filter(book => book.id !== id);
  }

  refreshBooks(): void {
    this.books = this.bookService.getBooks();
  }

  toggleFavorite(book: Book): void {
    this.bookService.toggleFavorite(book.id);
    this.refreshBooks();
  }
}