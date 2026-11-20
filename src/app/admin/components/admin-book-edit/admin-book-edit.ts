import { Component, computed, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BookFormComponent } from '../../../books/components/book-form/book-form';
import { Book } from '../../../books/book';
import { BookService } from '../../../books/book.service';

@Component({
  selector: 'app-admin-book-edit',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatIconModule, BookFormComponent],
  templateUrl: './admin-book-edit.html',
  styleUrl: './admin-book-edit.css'
})
export class AdminBookEdit {
  private bookService = inject(BookService);
  private router = inject(Router);
  readonly loading = this.bookService.loading;
  readonly loadError = this.bookService.loadError;

  readonly id = input<string>();

  readonly isEditMode = computed(() => !!this.id());

  readonly book = computed(() => {
    const bookId = this.id();
    if (!bookId) return undefined;
    return this.bookService.getBookById(Number(bookId));
  });

  onSave(eventData: any): void {
    const bookData: Book = eventData.target ? eventData.value : eventData;

    if (this.isEditMode()) {
      const currentId = Number(this.id());
      this.bookService.updateBook({ ...bookData, id: currentId });
    } else {
      this.bookService.addBook(bookData);
    }
    this.navigateToAdmin();
  }

  onCancel(): void {
    this.navigateToAdmin();
  }

  private navigateToAdmin(): void {
    this.router.navigate(['/admin']);
  }
}