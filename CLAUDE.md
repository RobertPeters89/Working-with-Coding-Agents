# Bookshelf

A small app to list, search, filter, mark as read and remove books.

## Stack

React 19, TypeScript, Vite. Tests: Vitest with Testing Library (jsdom).

## Commands

- `npm run dev` starts the app
- `npm run test:run` runs the tests once. **Never use `npm test`**: it starts the watch mode and never finishes.
- `npm run check` checks the types
- `npm run build` builds the app

## Conventions

- Components live in `src/components/<Name>/index.tsx`, with a type `<Name>Props` for the props and the test in `<Name>.test.tsx` next to it.
- Logic that is not UI lives in `src/books.ts` and is tested in `src/books.test.ts`.
- State is never changed in place, functions return new arrays.
- Shared types are in `src/types.ts`.

## Off limits

- Do not add dependencies without asking.
- Do not edit `src/data.ts`.
- Never change a test to make it pass, unless the requirement changed.
