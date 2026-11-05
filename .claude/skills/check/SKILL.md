---
name: check
description: Run the type check and the tests and report whether everything still works. Use when the user asks if everything still works, if the code is OK, or after finishing a change. Read-only, never changes files.
allowed-tools: Bash(npm run check), Bash(npm run test:run)
---

Check that the project is healthy. Do not change any file.

1. Run `npm run check` (type check).
2. Run `npm run test:run` (tests, run once). Never use `npm test`, it starts the watch mode and never finishes.
3. Run both even if the first one fails, so the report is complete.

Report in this form:

- Type check: passed / failed
- Tests: passed / failed (number of passed and failed tests)
- For each failure: file, line and the error message in one line

Do not fix anything and do not change a test. If something failed, name the likely cause and ask whether it should be fixed.
