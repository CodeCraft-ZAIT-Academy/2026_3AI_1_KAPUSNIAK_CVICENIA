import { Component, input, output, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { Book } from '../../book'; 
import { GENRES } from '../../genres'; 




@Component({
  selector: 'app-book-form',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './book-form.html',
  styleUrl: './book-form.css'
})
export class BookFormComponent implements OnInit {
  genres = GENRES;
  currentYear = new Date().getFullYear();

  book = input<Book | undefined>();

  saved = output<Book>();
  cancelled = output<void>()

  draft: Book = this.emptyBook();

  ngOnInit(): void {
    const initialBook = this.book();
    if (initialBook) {
    
      this.draft = { ...initialBook };
    }
  }

  isEditMode(): boolean {
    return !!this.book();
  }

  emptyBook(): Book {
    return {
      id: 0,
      title: '',
      author: '',
      year: this.currentYear,
      pages: 100,
      genre: '',
      rating: 3,
      available: true,
      favorite: false
    };
  }

  cancel(): void {
    this.cancelled.emit();
  }

  submitForm(form: NgForm): void {
    if (form.invalid) return;

    this.saved.emit({ ...this.draft });
    if (!this.isEditMode()) {
      form.resetForm(this.emptyBook());
    }
  }
}