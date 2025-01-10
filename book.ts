// The book class does not follow SRP as it is doing many things.

class Book {
  private title: string;
  private author: string;
  private currentPage: number;
  private totalPages: number;

  constructor(title: string, author: string, totalPages: number) {
    this.title = title;
    this.author = author;
    this.totalPages = totalPages;
    this.currentPage = 1;
  }

  getTitle(): string {
    return this.title;
  }

  getAuthor(): string {
    return this.author;
  }

  turnPage(): void {
    if (this.hasNextPage()) {
      this.currentPage++;
    }
  }

  getCurrentPage(): string {
    return `Current page content of page ${this.currentPage}`;
  }

  getLocation(): string {
    return `Shelf 1, Room 3`;
  }

  private hasNextPage(): boolean {
    return this.currentPage < this.totalPages;
  }
}

interface Printer {
  printPage(page: string): void;
}

class PlainTextPrinter implements Printer {
  printPage(page: string): void {
    console.log(page);
  }
}

class HtmlPrinter implements Printer {
  printPage(page: string): void {
    console.log(`<div style="single-page">${page}</div>`);
  }
}

class BookStorageService {
  static save(book: Book): void {
    const filename = `/documents/${book.getTitle()} - ${book.getAuthor()}.json`;
    const fileContent = JSON.stringify(book);
    console.log(`Saving book to ${filename} with content:`, fileContent);
  }
}

const book = new Book("A Great Book", "John Doe", 200);
const plainPrinter = new PlainTextPrinter();
const htmlPrinter = new HtmlPrinter();

book.turnPage();
console.log(book.getCurrentPage());
plainPrinter.printPage(book.getCurrentPage());
htmlPrinter.printPage(book.getCurrentPage());

BookStorageService.save(book);
