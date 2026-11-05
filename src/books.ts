import type { Book, Genre, GenreFilter } from "./types";

export const STORAGE_KEY = "bookshelf:books";

export const DUPLICATE_ERROR = "This book is already on your shelf.";

const GENRES: Genre[] = ["fantasy", "sci-fi", "mystery", "non-fiction"];

export type NewBook = {
  title: string;
  author: string;
  genre: Genre;
  /** 1 to 5 stars, 0 means "not rated" */
  rating: number;
};

type Filter = {
  genre: GenreFilter;
  query: string;
};

export function filterBooks(books: Book[], { genre, query }: Filter): Book[] {
  const normalizedQuery = query.trim().toLowerCase();
  return books.filter(
    (book) =>
      (genre === "all" || book.genre === genre) &&
      book.title.toLowerCase().includes(normalizedQuery)
  );
}

export function toggleRead(books: Book[], id: string): Book[] {
  return books.map((book) =>
    book.id === id ? { ...book, isRead: !book.isRead } : book
  );
}

export function removeBook(books: Book[], id: string): Book[] {
  return books.filter((book) => book.id !== id);
}

function sameBook(book: Book, title: string, author: string): boolean {
  return (
    book.title.trim().toLowerCase() === title.toLowerCase() &&
    book.author.trim().toLowerCase() === author.toLowerCase()
  );
}

/** Error message for an invalid new book, `null` if it can be added. */
export function validateNewBook(
  books: Book[],
  { title, author }: Pick<NewBook, "title" | "author">
): string | null {
  const trimmedTitle = title.trim();
  const trimmedAuthor = author.trim();
  if (trimmedTitle === "") {
    return "Title is required.";
  }
  if (trimmedAuthor === "") {
    return "Author is required.";
  }
  if (books.some((book) => sameBook(book, trimmedTitle, trimmedAuthor))) {
    return DUPLICATE_ERROR;
  }
  return null;
}

/** Appends an unread book. Title and author are trimmed. */
export function addBook(books: Book[], newBook: NewBook): Book[] {
  return [
    ...books,
    {
      ...newBook,
      id: crypto.randomUUID(),
      title: newBook.title.trim(),
      author: newBook.author.trim(),
      isRead: false,
    },
  ];
}

function isBook(value: unknown): value is Book {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const book = value as Record<string, unknown>;
  return (
    typeof book.id === "string" &&
    typeof book.title === "string" &&
    typeof book.author === "string" &&
    GENRES.includes(book.genre as Genre) &&
    Number.isInteger(book.rating) &&
    (book.rating as number) >= 0 &&
    (book.rating as number) <= 5 &&
    typeof book.isRead === "boolean"
  );
}

/** Saved books, or `fallback` if nothing valid is saved. */
export function loadBooks(storage: Storage, fallback: Book[]): Book[] {
  try {
    const saved = storage.getItem(STORAGE_KEY);
    if (saved === null) {
      return fallback;
    }
    const parsed: unknown = JSON.parse(saved);
    return Array.isArray(parsed) && parsed.every(isBook) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export function saveBooks(storage: Storage, books: Book[]): void {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(books));
  } catch {
    // storage full or unavailable: the app keeps working without saving
  }
}

export function countRead(books: Book[]): number {
  return books.filter((book) => book.isRead).length;
}

/** Average of all rated books, rounded to one decimal. `null` if no book is rated. */
export function averageRating(books: Book[]): number | null {
  const rated = books.filter((book) => book.rating > 0);
  if (rated.length === 0) {
    return null;
  }
  const sum = rated.reduce((total, book) => total + book.rating, 0);
  return Math.round((sum / rated.length) * 10) / 10;
}
