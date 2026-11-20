import { Component, inject, computed } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { BookService } from './books/book.service';
import { NotFound } from './shared/components/not-found/not-found'; 

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatBadgeModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private bookService = inject(BookService);
  readonly borrowedCount = computed(() => this.bookService.borrowedBooks().length);
}