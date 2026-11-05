---
name: new-component
description: Create a new React component with props type and test, following the project conventions. Takes the component name and its purpose as arguments.
disable-model-invocation: true
argument-hint: <ComponentName> <what it does>
---

Create a new component from these arguments: $ARGUMENTS

The first word is the component name (PascalCase), the rest describes its purpose. If the name is missing or not PascalCase, ask before creating anything.

Follow the conventions in `CLAUDE.md`:

1. Create `src/components/<Name>/index.tsx` with a default export and a type `<Name>Props` for the props. Look at `src/components/BookCard/index.tsx` for the style.
2. Create `src/components/<Name>/<Name>.test.tsx` next to it, with Vitest and Testing Library. Cover the purpose described in the arguments.
3. Logic that is not UI goes into `src/books.ts` with a test in `src/books.test.ts`. State is never changed in place, functions return new arrays.
4. Do not wire the component into `App.tsx` unless the arguments say so. Do not edit `src/data.ts`. Do not add dependencies.
5. Run `npm run check` and `npm run test:run` (never `npm test`) and fix problems in the new files.

Finish with a short list of the created files.
