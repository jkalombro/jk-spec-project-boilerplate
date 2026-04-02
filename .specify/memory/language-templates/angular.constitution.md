# This contains specific specs for any ANGULAR project to be created

## Always use TDD approach (Test Driven Development)

When creating services, components, helpers, etc. Always create the test first based on the acceptance criteria before starting the actual task. Always consider the edge cases when creating test. It should have 100% coverage.

## CODING CONVENTIONS

### Should follow Global standards

If rules are not defined here, always consider the global standars first when coding

### Code Arrangements thru Access Modifiers

For variables, functions, lifescycle methods, etc. Follow the arrangement below

```
\\ Inputs
\\ Outputs
\\ Public variables
\\ Constructor
\\ Private variables
\\ Lifecycle methods
\\ Public methods
\\ Internal methods
\\ Private methods
```

## Technical Preferences

- **_Styling:_** SCSS
- **_State Management:_** NgRx
- **_Property Management:_** Use observables over Signals

## Versioning & Breaking Changes

**Versioning format:** MAJOR.MINOR.BUILD

**Version**: 1.0.0 | **Ratified**: 2026-04-02 | **Last Amended**: 2026-04-02
