import { Book } from './book';


export function createEmptyBook(): Book {
  return {
    id: 0,
    title: '',
    author: '',
    year: new Date().getFullYear(),
    available: true,
    genre: '',
    rating: 3,
    pages: 100,
    favorite: false
  };
}