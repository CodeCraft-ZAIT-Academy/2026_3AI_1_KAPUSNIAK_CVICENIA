import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BookService } from '../../../books/book.service';


@Component({
  selector: 'app-admin-books',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatIconModule],
  templateUrl: './admin-books.html',
  styleUrl: './admin-books.css'
})
export class AdminBooks {
  private readonly bookService = inject(BookService);

  readonly books = this.bookService.books;

  readonly deletingBookId = signal<number | null>(null);

  askDelete(id: number): void {
    this.deletingBookId.set(id);
  }

  cancelDelete(): void {
    this.deletingBookId.set(null);
  }

  confirmDelete(id: number): void {
    this.bookService.deleteBook(id);
    this.deletingBookId.set(null);
  }
}