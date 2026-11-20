import { Pipe, PipeTransform } from '@angular/core';
import { Book } from './book';

@Pipe({
  name: 'bookFilter',
  standalone: true,
})
export class BookFilterPipe implements PipeTransform {
  transform(
    books: Book[] | null | undefined,
    searchText: string = '',
    availability: string = 'all',
    favoriteOnly: boolean = false
  ): Book[] {
    if (!books?.length) {
      return [];
    }

    const query = (searchText ?? '').trim().toLowerCase();

    return books.filter((book) => {
      const title = (book.title ?? '').toLowerCase();
      const author = (book.author ?? '').toLowerCase();
      const matchesSearch = !query || title.includes(query) || author.includes(query);

      const matchesAvailability =
        availability === 'all' ||
        (availability === 'available' && book.available === true) ||
        (availability === 'borrowed' && book.available === false);

      const matchesFavorite = !favoriteOnly || book.favorite === true;

      return matchesSearch && matchesAvailability && matchesFavorite;
    });
  }
}