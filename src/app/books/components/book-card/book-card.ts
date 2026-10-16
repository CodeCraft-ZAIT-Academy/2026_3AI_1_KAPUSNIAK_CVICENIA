import { Component, input, output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Book } from '../../book';
import { BookDetail } from '../book-detail/book-detail';
import { BookFormComponent } from '../book-form/book-form';
import { getGenreColor } from '../../genre-colors';

@Component({
  selector: 'app-book-card',
  imports: [MatCardModule, BookFormComponent, MatButtonModule, MatIconModule, BookDetail],
  templateUrl: './book-card.html',
  styleUrl: './book-card.css'
})
export class BookCard {
  book = input.required<Book>();

  borrowed = output<void>();
  returned = output<void>();
  edited = output<Book>(); 
  deleted = output<number>();

  showDetails: boolean = false;
  favorite: boolean = false;
  editing: boolean = false; 
  confirmingDelete: boolean = false;

  toggleEdit(): void {
    this.editing = !this.editing;
    this.confirmingDelete = false;
  }

  toggleDeleteConfirm(): void {
    this.confirmingDelete = !this.confirmingDelete;
    this.editing = false;
  }

  confirmDelete(): void {
    this.deleted.emit(this.book().id);
  }

  onSaveEdit(updatedBook: Book): void {
    this.edited.emit(updatedBook);
    this.editing = false; 
  }
  genreColor(): string {
    return getGenreColor(this.book().genre);
  }

  toggleDetails(): void {
    this.showDetails = !this.showDetails;
  }
  
  toggleFavorite(): void {
    this.book().favorite = !this.book().favorite;
  }

  borrow(): void {
    this.borrowed.emit();
  }
  
  giveBack(): void {
    this.returned.emit();
  }
}