import { afterEach, describe, expect, test } from "vitest";
import {
  addBook,
  averageRating,
  countRead,
  DUPLICATE_ERROR,
  filterBooks,
  loadBooks,
  removeBook,
  saveBooks,
  STORAGE_KEY,
  toggleRead,
  validateNewBook,
} from "./books";
import { initialBooks } from "./data";

describe("filterBooks", () => {
  test("filters by genre", () => {
    const result = filterBooks(initialBooks, { genre: "sci-fi", query: "" });
    expect(result.map((book) => book.title)).toEqual(["Dune", "Neuromancer"]);
  });

  test("returns all books for the genre 'all'", () => {
    expect(filterBooks(initialBooks, { genre: "all", query: "" })).toHaveLength(
      5
    );
  });

  test("finds a title regardless of upper and lower case", () => {
    const result = filterBooks(initialBooks, { genre: "all", query: "dune" });
    expect(result.map((book) => book.title)).toEqual(["Dune"]);
  });

  test("ignores spaces around the search text", () => {
    const result = filterBooks(initialBooks, { genre: "all", query: " Dune " });
    expect(result).toHaveLength(1);
  });
});

describe("toggleRead", () => {
  test("toggles the read status of one book", () => {
    const result = toggleRead(structuredClone(initialBooks), "b3");
    expect(result.find((book) => book.id === "b3")?.isRead).toBe(true);
    expect(result.find((book) => book.id === "b1")?.isRead).toBe(true);
  });

  test("does not change the original list", () => {
    const books = structuredClone(initialBooks);
    const result = toggleRead(books, "b3");
    expect(books.find((book) => book.id === "b3")?.isRead).toBe(false);
    expect(result).not.toBe(books);
  });
});

describe("removeBook", () => {
  test("removes the book with the given id", () => {
    const result = removeBook(initialBooks, "b2");
    expect(result.map((book) => book.id)).toEqual(["b1", "b3", "b4", "b5"]);
  });
});

const emma = {
  title: "Emma",
  author: "Jane Austen",
  genre: "mystery",
  rating: 0,
} as const;

describe("validateNewBook", () => {
  test("accepts a new book", () => {
    expect(validateNewBook(initialBooks, emma)).toBeNull();
  });

  test("requires a title", () => {
    expect(validateNewBook(initialBooks, { ...emma, title: "   " })).toMatch(
      /title/i
    );
  });

  test("requires an author", () => {
    expect(validateNewBook(initialBooks, { ...emma, author: "" })).toMatch(
      /author/i
    );
  });

  test("rejects a duplicate regardless of case and surrounding spaces", () => {
    expect(
      validateNewBook(initialBooks, {
        ...emma,
        title: "  dune ",
        author: "FRANK HERBERT",
      })
    ).toBe(DUPLICATE_ERROR);
  });

  test("accepts the same title by another author", () => {
    expect(
      validateNewBook(initialBooks, { ...emma, title: "Dune" })
    ).toBeNull();
  });
});

describe("addBook", () => {
  test("appends an unread book with trimmed title and author", () => {
    const books = structuredClone(initialBooks);
    const result = addBook(books, {
      ...emma,
      title: " Emma ",
      author: " Jane Austen ",
    });
    expect(result).toHaveLength(6);
    expect(result[5]).toMatchObject({ ...emma, isRead: false });
    expect(result[5].id).not.toBe("");
    expect(books).toHaveLength(5);
  });

  test("gives every book its own id", () => {
    const result = addBook(addBook([], emma), emma);
    expect(result[0].id).not.toBe(result[1].id);
  });
});

describe("loadBooks and saveBooks", () => {
  afterEach(() => localStorage.clear());

  test("returns the fallback when nothing is saved", () => {
    expect(loadBooks(localStorage, initialBooks)).toBe(initialBooks);
  });

  test("loads saved books", () => {
    saveBooks(localStorage, [initialBooks[0]]);
    expect(loadBooks(localStorage, initialBooks)).toEqual([initialBooks[0]]);
  });

  test("returns the fallback for broken JSON", () => {
    localStorage.setItem(STORAGE_KEY, "{not json");
    expect(loadBooks(localStorage, initialBooks)).toBe(initialBooks);
  });

  test("returns the fallback when the saved data has the wrong shape", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ books: [] }));
    expect(loadBooks(localStorage, initialBooks)).toBe(initialBooks);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([{ ...initialBooks[0], genre: "poetry" }])
    );
    expect(loadBooks(localStorage, initialBooks)).toBe(initialBooks);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([{ ...initialBooks[0], rating: 9 }])
    );
    expect(loadBooks(localStorage, initialBooks)).toBe(initialBooks);
  });
});

describe("countRead", () => {
  test("counts the read books", () => {
    expect(countRead(initialBooks)).toBe(2);
  });
});

describe("averageRating", () => {
  test("averages only the rated books", () => {
    expect(averageRating(initialBooks)).toBe(4);
  });

  test("returns null when no book is rated", () => {
    expect(averageRating([initialBooks[2], initialBooks[4]])).toBeNull();
  });

  test("returns null for an empty list", () => {
    expect(averageRating([])).toBeNull();
  });
});
