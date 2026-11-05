import { describe, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddBookForm from "./index";

describe("AddBookForm", () => {
  test("submits the entered values", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn(() => null);
    render(<AddBookForm onAdd={onAdd} />);
    await user.type(screen.getByLabelText("Title"), "Emma");
    await user.type(screen.getByLabelText("Author"), "Jane Austen");
    await user.selectOptions(screen.getByLabelText("Book genre"), "mystery");
    await user.selectOptions(screen.getByLabelText("Rating"), "4");
    await user.click(screen.getByRole("button", { name: "Add book" }));
    expect(onAdd).toHaveBeenCalledWith({
      title: "Emma",
      author: "Jane Austen",
      genre: "mystery",
      rating: 4,
    });
  });

  test("clears the form after a successful add", async () => {
    const user = userEvent.setup();
    render(<AddBookForm onAdd={() => null} />);
    await user.type(screen.getByLabelText("Title"), "Emma");
    await user.type(screen.getByLabelText("Author"), "Jane Austen");
    await user.click(screen.getByRole("button", { name: "Add book" }));
    expect(screen.getByLabelText("Title")).toHaveValue("");
    expect(screen.getByLabelText("Author")).toHaveValue("");
    expect(screen.queryByRole("alert")).toBeNull();
  });

  test("shows the error and keeps the input when adding fails", async () => {
    const user = userEvent.setup();
    render(<AddBookForm onAdd={() => "Title is required."} />);
    await user.type(screen.getByLabelText("Author"), "Jane Austen");
    await user.click(screen.getByRole("button", { name: "Add book" }));
    expect(screen.getByRole("alert")).toHaveTextContent("Title is required.");
    expect(screen.getByLabelText("Author")).toHaveValue("Jane Austen");
  });
});
