import { Component } from '@angular/core';
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
  myBooks: Book[] = [
    { id: 1, title: 'Hobit', author: 'J. R. R. Tolkien', year: 1937, available: true, genre: 'Fantasy', rating: 5, pages: 310, favorite: false },
    { id: 2, title: '1984', author: 'George Orwell', year: 1947, available: false, genre: 'Dystopia', rating: 5, pages: 310, favorite: false },
    { id: 3, title: 'Malý Princ', author: 'Exupéry', year: 1943, available: true, genre: 'Fiction', rating: 5, pages: 310, favorite: false }
  ];

  maxBorrowed: number = 10;
  books: Book[] = this.myBooks.concat(generateBooks(40, 4));

  searchText: string = '';
  availabilityFilter: string = 'all'; 
  sortBy: string = 'none'; 

  currentPage: number = 1;
  pageSize: number = 5;

  visibleBooks(): Book[] {
    let result = this.books;

    const query = this.searchText.trim().toLowerCase();
    if (query) {
      result = result.filter(b => 
        b.title.toLowerCase().includes(query) || 
        b.author.toLowerCase().includes(query)
      );
    }
    if (this.availabilityFilter === 'available') {
      result = result.filter(b => b.available);
    } else if (this.availabilityFilter === 'borrowed') {
      result = result.filter(b => !b.available);
    }

    const sorted = [...result];
    switch (this.sortBy) {
      case 'title':
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'year':
        sorted.sort((a, b) => b.year - a.year); 
        break;
      case 'rating':
        sorted.sort((a, b) => b.rating - a.rating); 
        break;
      case 'none':
      default:
        break;
    }

    return sorted;
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
    return this.books.filter(book => !book.available);
  }

  giveBack(book: Book): void {
    const index = this.books.indexOf(book);
    this.books[index] = { ...book, available: true };
  }

  borrow(book: Book): void {
    if (this.borrowedBooks().length >= this.maxBorrowed) {
      alert(`Naraz môžeš mať požičaných najviac ${this.maxBorrowed} kníh. Najskôr musíš nejakú vrátiť.`);
      return;
    }
    const index = this.books.indexOf(book);
    this.books[index] = { ...book, available: false };
  }

  addBook(newBook: Book): void {
    const maxId = Math.max(0, ...this.books.map(b => b.id));
    const bookToAdd: Book = {
      ...newBook,
      id: maxId + 1,
      available: true,
      favorite: false
    };
    this.books.unshift(bookToAdd);
    this.currentPage = 1;
  }

  updateBook(updatedBook: Book): void {
    this.books = this.books.map(b => b.id === updatedBook.id ? { ...updatedBook } : b);
  }

  deleteBook(id: number): void {
    this.books = this.books.filter(b => b.id !== id);
    const maxPage = this.pageCount();
    if (this.currentPage > maxPage && maxPage > 0) {
      this.currentPage = maxPage;
    }
  }
}