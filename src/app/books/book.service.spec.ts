import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { BookApiService } from './book-api.service';
import { BookService } from './book.service';

describe('BookService', () => {
  let service: BookService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: BookApiService,
          useValue: { getBooks: () => of([]) },
        },
      ],
    });
    service = TestBed.inject(BookService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});