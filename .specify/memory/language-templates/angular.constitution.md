# This contains specific specs for any ANGULAR project to be created

## Folder Structure

```
src/
├── styles.scss                          — global stylesheet entry point; imports global.scss
├── assets/
│   └── styles/
│       ├── variables.scss               — design tokens: colors, spacing, typography, layout constants
│       ├── mixins.scss                  — shared SCSS mixins
│       └── global.scss                  — body reset, base typography, element defaults
└── app/
    ├── app.module.ts                    — root NgModule; registers StoreModule.forRoot, EffectsModule.forRoot, StoreDevtoolsModule
    ├── app-routing.module.ts            — top-level routes; lazy-loads all feature modules
    ├── app.component.{ts,html,scss}     — root shell component: toolbar, router-outlet
    │
    ├── store/                           — global NgRx store (state shared across the entire app)
    │   ├── models/                      — TypeScript interfaces for global state slices and entities
    │   ├── actions/                     — createAction definitions for global events
    │   ├── reducers/                    — pure reducer functions + selectors; index.ts exports ActionReducerMap
    │   ├── effects/                     — side-effect handlers (API calls, etc.) that dispatch follow-up actions
    │   └── api/                         — injectable services that perform HTTP/mock calls for global effects
    │
    ├── <feature>/                       — one folder per lazy-loaded feature module (e.g. home/, about/)
    │   ├── <feature>.module.ts          — NgModule; registers StoreModule.forFeature and EffectsModule.forFeature
    │   ├── <feature>.component.{ts,html,scss}  — smart (container) component: selects from store, dispatches actions
    │   ├── components/                  — dumb (presentational) subcomponents used by this feature
    │   │   └── <subcomponent>/
    │   │       └── <subcomponent>.component.{ts,html,scss}
    │   └── store/                       — feature-scoped NgRx store
    │       ├── models/                  — state shape interface + entity models for this feature
    │       ├── actions/                 — feature action creators (load, success, failure pattern)
    │       ├── reducers/                — feature reducer + createFeatureSelector-based selectors
    │       ├── effects/                 — feature effects; call feature api/ services, catch errors
    │       └── api/                     — injectable services that perform HTTP/mock calls for feature effects
    │
    └── shared/                          — cross-feature reusables declared and exported by SharedModule
        ├── shared.module.ts             — declares and exports all shared components; imports CommonModule
        ├── components/                  — generic UI components used across multiple feature modules
        ├── services/                    — singleton services used across multiple feature modules
        └── helpers/                     — pure utility functions (no Angular dependencies)
```

### Component Placement Rules

1. **Child components belong inside the parent's folder.**
   Any component created specifically for one parent component lives in a `components/` subfolder inside that parent's directory.

2. **Module-level sharing → `<feature>/components/` shared folder.**
   If a component or service is used by more than one component within the same feature module, move it to a `shared/` folder inside that feature folder (alongside the module's `components/` directory).

3. **Cross-module sharing → `src/app/shared/`.**
   If a component, service, or helper is used across two or more feature modules it must be moved into the global `shared/` module. It should be declared (if a component) or provided (if a service) there and exported so any module that imports `SharedModule` can use it.

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

### Styling

- Always consider responsiveness. It should look good on all screens be it a pc, tablet, or mobile
- All colors and constants should be defined on `src/assets/styles/variables.scss`
- All shared mixins should be defined on `src/assets/styles/mixins.scss`
- All global styles should be defined on `src/assets/styles/global.scss`

## Technical Preferences

- **_Styling:_** SCSS
- **_State Management:_** NgRx
- **_Property Management:_** Use observables over Signals

## Versioning & Breaking Changes

**Versioning format:** MAJOR.MINOR.BUILD

**Version**: 1.0.0 | **Ratified**: 2026-04-02 | **Last Amended**: 2026-04-02
