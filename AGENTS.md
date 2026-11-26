# Agent instructions

## Engineering practices

- Follow SOLID principles where they improve clarity and maintainability. Keep responsibilities focused, depend on small interfaces or pure functions where useful, and avoid adding abstractions that the application does not need.
- Prefer simple, readable JavaScript and reuse existing patterns before introducing new dependencies or infrastructure.
- Validate user input and handle empty, invalid, and boundary cases explicitly.
- Keep the interface accessible: use semantic HTML, labels, keyboard-operable controls, and clear feedback for errors and results.
- Avoid unsafe DOM insertion. Render user-provided text as text, not executable markup.
- Keep user-facing application text in Spanish and preserve the existing purple visual theme unless the task requests otherwise.

## Testing and review

- Add or update focused unit tests for new behavior and bug fixes. Use the built-in Node.js test runner and keep business logic testable independently of the DOM where practical.
- Run `npm test` after making changes and resolve failures related to the work before finishing.
- Before finishing, review the complete diff for correctness, unintended changes, regressions, and consistency with these instructions. Report any validation that could not be completed.
- Update the README when setup or run instructions change.
