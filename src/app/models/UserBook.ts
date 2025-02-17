export class UserBook {
  google_books_id: string;
  title: string;
  authors: string;
  cover_image: string;
  published_date: string;

  constructor(data: any) {
    this.google_books_id = data.id;
    this.title = data.volumeInfo.title;
    this.authors = data.volumeInfo.authors ? data.volumeInfo.authors.join(', ') : '';
    this.cover_image = data.volumeInfo.imageLinks ? data.volumeInfo.imageLinks.thumbnail : '';
    this.published_date = data.volumeInfo.publishedDate;
  }
}
