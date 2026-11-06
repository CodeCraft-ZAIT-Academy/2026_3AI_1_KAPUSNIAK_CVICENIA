import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { Cart } from '../cart/cart';
import { Book } from '../../../books/book';
import { BookService } from '../../../books/book.service';

@Component({
  selector: 'app-cart-page',
  imports: [RouterLink, MatButtonModule, Cart],
  templateUrl: './cart-page.html',
  styleUrl: './cart-page.css'
})
export class CartPage {
  private bookService = inject(BookService);
  readonly borrowedBooks = this.bookService.borrowedBooks;
  readonly maxBorrowed = this.bookService.maxBorrowed;

  giveBack(book: Book): void {
    this.bookService.returnBook(book.id);
  }
}