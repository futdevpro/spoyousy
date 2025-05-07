
# Project Standards

## Documentation
- Always read and follow the `specifications.md` for the app.
- When the user commands to create something new in the app that is not included in `specifications.md`, add it to `specifications.md`.
- Always maintain and enhance existing documentation and user guidance.
- Never remove or simplify setup instructions, troubleshooting guides, or user assistance content.
- Always preserve and improve existing code comments and documentation.
- When the user asks about how/why/etc, always add documentation to the code.

## Code Quality
- Always try to comply with Sonar defaults and best practices for code quality.
- Never remove or reduce error handling, logging, or debugging capabilities.
- Never remove or reduce the verbosity of helpful error messages or user feedback.
- Always add code documentation whenever it is useful, and at every method.
- Use existing patterns and tech stack unless otherwise instructed.
- Prefer stability and maintainability over introducing new dependencies or patterns.

## Project Organization
- Keep interfaces and constants in separate files.
- Keep all exports in separate files with specific naming conventions:
  - Constants: `*.const.ts`
  - Interfaces: `*.interface.ts`
  - Types: `*.type.ts`
  - Enums: `*.enum.ts`
  - Models: `*.model.ts`
- Use `.spec.ts` for all unit test files.

## Component Standards
- File rules:
  - Create separate files (html, scss, etc.) if content is longer than 5 rows
  - Do not create separate files if content is 5 rows or less
  - Never create or keep empty files
  - Keep component logic and template separate when template exceeds 5 rows
  - Use inline templates only for very small components (5 rows or less)
  - Maintain consistent file structure across all components

## Angular Standards
### Dependency Injection
- In component scripts, always inject services using `inject` instead of constructor inputs.

### UI/UX
- Use Tailwind CSS for styling.
- In component templates, always use Tailwind CSS for styling.
- Use Angular's built-in control flow syntax (@if, @for) instead of structural directives (*ngIf, *ngFor).

### State Management
- Use Angular Signals for state management instead of Observables.
- For Angular Signals, always use "*_$" naming convention. (something_$)

## Development Process
### Testing & Quality
- Always try to create unit tests for new implementations.
- Always run tests after bigger implementations.
- Always run `npm run build` after changing anything in the scripts.
- Keep the startup flow robust and user-friendly (loading screen, error handling, etc.).

### Logging & Debugging
- Put logs before and after all executions.
- Use emojis in logs to make them more readable.
- For log emojis, always try to use different emojis for each step, except for ✅ success, ⚠️ warning, ❌ error, and similar status emojis, which should remain consistent.
- All logs should always be specific and unique—no two logs should be the same or collide.

# Agent Behavior
- Always apply fixes: When an issue or error is identified, always apply the fix immediately, without asking for confirmation.
- When getting a command that requires multiple tasks/steps, always do them one by one.
- Always provide feedback when reading and following rules by starting responses with a confirmation of rule reading.
- Never remove or simplify existing descriptions, documentation, logs, user helpers, or any other helpful content.
- When the user commands to do something in a new way (global how-to), add that to this file.
- Never add made-up content: Only implement exactly what is requested by the user.

---

*This file should be updated any time new global instructions or best practices are established.* 