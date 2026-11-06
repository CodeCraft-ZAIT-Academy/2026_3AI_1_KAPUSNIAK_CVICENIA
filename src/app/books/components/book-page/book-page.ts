import { Component, computed, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BookService } from '../../book.service';
import { BookDetail } from '../book-detail/book-detail'; 

@Component({
  selector: 'app-book-page',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatIconModule, BookDetail],
  templateUrl: './book-page.html',
  styleUrl: './book-page.css'
})
export class BookPage {
  private bookService = inject(BookService);

  readonly id = input.required<string>();

  readonly book = computed(() => {
    return this.bookService.getBookById(Number(this.id()));
  });

  borrow(book: any): void {
    this.bookService.borrowBook(book.id);
  }

  returnBook(book: any): void {
    this.bookService.returnBook(book.id);
  }

  toggleFavorite(book: any): void {
    this.bookService.toggleFavorite(book.id);
  }

  updateBook(updated: any): void {
    this.bookService.updateBook(updated);
  }
}