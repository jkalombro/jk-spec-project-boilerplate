# This contains specific specs for any C#/.NET project to be created

## Folder Structure

```
src/
├── YourApp.Domain/                    — entities, value objects, domain events, repository interfaces
│   ├── Entities/                      — core business entities (inherit from BaseEntity)
│   ├── ValueObjects/                  — immutable value objects
│   ├── Events/                        — domain events (implement INotification)
│   ├── Exceptions/                    — domain-specific exceptions
│   └── Interfaces/                    — IRepository<T> and other domain contracts
│
├── YourApp.Application/               — use cases, CQRS handlers, validation, business rules
│   ├── Common/
│   │   ├── Behaviors/                 — MediatR pipeline behaviors (ValidationBehavior, LoggingBehavior)
│   │   ├── Exceptions/                — ApplicationException, NotFoundException, ValidationException, etc.
│   │   └── Interfaces/                — cross-cutting contracts (ICurrentUser, IDateTime, ITokenService)
│   ├── <Feature>/                     — one folder per domain feature (e.g. Users/, Products/)
│   │   ├── Commands/                  — IRequest<T> command + IRequestHandler<TCommand, TResult> pairs
│   │   ├── Queries/                   — IRequest<T> query + IRequestHandler<TQuery, TResult> pairs
│   │   ├── Validators/                — AbstractValidator<TCommand/TQuery> per command or query
│   │   ├── DTOs/                      — request/response models (domain entities never exposed directly)
│   │   └── Notifications/             — INotification + INotificationHandler pairs (domain events)
│   └── DependencyInjection.cs         — AddApplication() IServiceCollection extension
│
├── YourApp.Infrastructure/            — EF Core, repositories, Identity, external services
│   ├── Persistence/
│   │   ├── ApplicationDbContext.cs    — DbContext; implements IApplicationDbContext
│   │   ├── Configurations/            — IEntityTypeConfiguration<T> per entity
│   │   ├── Migrations/                — EF Core code-first migrations
│   │   └── Repositories/             — concrete IRepository<T> implementations
│   ├── Identity/                      — ASP.NET Core Identity setup, JWT + OAuth token service
│   ├── Services/                      — implementations of application IService interfaces
│   └── DependencyInjection.cs        — AddInfrastructure() IServiceCollection extension
│
└── YourApp.API/                       — Minimal API host; entry point
    ├── Program.cs                     — service registration, middleware pipeline, endpoint mapping
    ├── Endpoints/                     — static classes per feature using MapGroup + versioned prefix
    │   └── <Feature>Endpoints.cs      — e.g. UsersEndpoints.cs, ProductsEndpoints.cs
    ├── Middleware/                    — GlobalExceptionHandlerMiddleware (RFC 7807 ProblemDetails)
    └── Extensions/                   — IServiceCollection / IEndpointRouteBuilder extension helpers

tests/
├── YourApp.Domain.Tests/              — unit tests for domain entities, value objects, domain logic
├── YourApp.Application.Tests/         — unit tests for handlers, validators, behaviors (xUnit, TDD)
└── YourApp.API.IntegrationTests/      — Reqnroll (Gherkin) acceptance tests hitting real endpoints
    ├── Features/                      — .feature files (one per domain feature)
    └── StepDefinitions/               — step definition classes per feature
```

### Layer Placement Rules

1. **Domain is the innermost layer** — no references to Application, Infrastructure, or API. Domain entities, interfaces, and events live here.
2. **Application references Domain only** — use cases (handlers) depend only on domain interfaces, never on Infrastructure or API directly.
3. **Infrastructure references Domain and Application** — implements domain interfaces (repositories, services) and registers them for DI.
4. **API references Application and Infrastructure only for DI registration** — endpoint handlers send MediatR commands/queries; no business logic in endpoints.
5. **No direct DbContext access from Application** — Application only touches `IApplicationDbContext`; concrete `ApplicationDbContext` lives in Infrastructure.

## Clean Architecture

- Enforce strict layer dependency: `Domain ← Application ← Infrastructure ← API`
- Each project (`YourApp.Domain`, `YourApp.Application`, etc.) is a separate `.csproj`
- Inner layers must never reference outer layers — enforce with `<ProjectReference>` rules
- Cross-cutting concerns (logging, validation) belong in `Application/Common/Behaviors/` as MediatR pipeline behaviors
- Use `DependencyInjection.cs` extension methods in each layer to register its own services — `Program.cs` calls `AddApplication()` + `AddInfrastructure()`

## CQRS & MediatR

- Use **MediatR** for all request dispatching — no direct service calls from endpoints
- **Commands** mutate state; **Queries** return data — never mix the two
- Each command/query lives alongside its handler in the same file (`CreateUserCommand.cs` contains both the record and the handler class)
- All commands and queries must have a corresponding `AbstractValidator<T>` in `Validators/`
- **Pipeline behaviors** (registered in `AddApplication()`):
  - `ValidationBehavior<TRequest, TResponse>` — runs FluentValidation before handler; throws `ValidationException` on failure
  - `LoggingBehavior<TRequest, TResponse>` — logs request name, execution time, and result
- **Notification pattern** — domain events implement `INotification`; publish via `IPublisher.Publish()` inside handlers; side effects handled in `INotificationHandler<T>` classes in `Notifications/`

## Authentication & Authorization

- **JWT Bearer** — all protected endpoints use `RequireAuthorization()`; configure via `AddJwtBearer()` in Infrastructure
- **ASP.NET Core Identity** — user management (registration, login, roles); `IdentityUser` extended with application-specific fields
- **Social Login providers** (both mandatory on all projects):
  - Google: `Microsoft.AspNetCore.Authentication.Google` — OIDC flow
  - Facebook: `Microsoft.AspNetCore.Authentication.Facebook` — OAuth2 flow
- **Token exchange flow**: social provider authenticates user → ASP.NET Core Identity creates or links local account → API issues its own JWT
- Store `ClientId`/`ClientSecret` for OAuth providers in `appsettings.json` (local dev) and environment variables / secrets manager (production) — never hardcode
- JWT settings (`Issuer`, `Audience`, `SecretKey`, `ExpiryMinutes`) must come from configuration, never hardcoded
- Role-based authorization via `[Authorize(Roles = "...")]` or `RequireAuthorization(policy)` — define policies in `AddInfrastructure()`

## Entity Framework & Repository Pattern

- **EF Core (latest)** targeting **SQL Server** via `Microsoft.EntityFrameworkCore.SqlServer`
- **Code-first** only — never modify the database by hand; always use migrations (`dotnet ef migrations add`)
- Entity configuration via `IEntityTypeConfiguration<T>` — one configuration class per entity in `Infrastructure/Persistence/Configurations/`; never configure entities using Data Annotations
- **Repository pattern**:
  - Generic `IRepository<T>` interface defined in `Domain/Interfaces/` — exposes `GetByIdAsync`, `GetAllAsync`, `AddAsync`, `UpdateAsync`, `DeleteAsync`
  - Feature-specific repository interfaces (e.g. `IUserRepository`) also defined in Domain when additional query methods are needed
  - Concrete implementations live in `Infrastructure/Persistence/Repositories/` — the only layer that references `ApplicationDbContext` directly
- **Soft delete** — entities that must be auditable implement `ISoftDeletable` (with `IsDeleted`, `DeletedAt`); global query filter in `ApplicationDbContext` excludes soft-deleted records automatically
- **Auditing** — `BaseEntity` carries `CreatedAt`, `UpdatedAt`; `ApplicationDbContext.SaveChangesAsync()` sets these automatically
- **Unit of Work** — `ApplicationDbContext` acts as the unit of work; call `SaveChangesAsync()` once per request from inside the handler, not from repositories

## Fluent Validation

- **FluentValidation** for all input validation — no Data Annotations on command/query records
- One `AbstractValidator<T>` per command or query, co-located in `<Feature>/Validators/`
- Validators registered automatically via `AddValidatorsFromAssembly(typeof(ApplicationAssembly).Assembly)` in `AddApplication()`
- `ValidationBehavior` MediatR pipeline behavior runs validation before any handler executes — handlers receive only valid requests
- Return `ValidationException` (custom exception caught by `GlobalExceptionHandlerMiddleware`) which maps to HTTP `400 Bad Request` with structured error details

## Minimal API Conventions

- **No controllers** — all endpoints use Minimal API (`app.MapGet`, `app.MapPost`, etc.)
- Group endpoints by feature using `RouteGroupBuilder` with versioned prefixes:
  ```csharp
  var v1 = app.MapGroup("/api/v1");
  v1.MapGroup("/users").MapUsersEndpoints();
  ```
- Each feature's endpoints live in a static class with an `IEndpointRouteBuilder Map<Feature>Endpoints(this IEndpointRouteBuilder app)` extension method
- Always use `TypedResults` (e.g. `TypedResults.Ok(...)`, `TypedResults.Created(...)`, `TypedResults.NoContent()`) — never `Results<T>` raw objects
- Endpoints must be thin: validate authorization → send MediatR command/query → return result; no business logic in endpoints
- Annotate endpoints with `.WithName()`, `.WithSummary()`, `.WithDescription()`, and `.Produces<T>()` / `.ProducesProblem()` for Swagger generation
- Tag endpoints with `.WithTags("FeatureName")` to group them in Swagger UI

## REST & Swagger

### HTTP Verb & Status Code Rules

| Operation                     | Verb   | Success Status                |
| ----------------------------- | ------ | ----------------------------- |
| Fetch collection              | GET    | 200 OK                        |
| Fetch single resource         | GET    | 200 OK / 404 Not Found        |
| Create resource               | POST   | 201 Created + Location header |
| Full replace                  | PUT    | 200 OK                        |
| Partial update                | PATCH  | 200 OK                        |
| Delete                        | DELETE | 204 No Content                |
| Auth actions (login, refresh) | POST   | 200 OK                        |

- Return `RFC 7807 ProblemDetails` for all error responses — handled globally in `GlobalExceptionHandlerMiddleware`
- Route convention: `/api/v{version}/{resource}` — plural nouns, kebab-case for multi-word resources
- Never expose internal identifiers or database keys in URLs when a public-facing slug or UUID is available

### Swagger / OpenAPI

- Use `Microsoft.AspNetCore.OpenApi` + `Swashbuckle.AspNetCore` (or `Scalar`)
- Every endpoint must have `.WithSummary()`, `.WithDescription()`, and response type annotations (`Produces<T>`, `ProducesProblem`)
- Swagger UI enabled in development at `/swagger`; disabled in production unless explicitly enabled
- JWT Bearer auth scheme registered in Swagger so protected endpoints can be tested via UI
- Version Swagger documents per API version (e.g. `v1`, `v2`)

## Logging

- **Serilog** — configured in `Program.cs` via `UseSerilog()`
- Structured logging only — use message templates with named properties, never string interpolation: `Log.Information("User {UserId} logged in", userId)`
- Sinks: Console (development) + File (production minimum); add Seq or other sinks as needed
- Request/response logging via `LoggingBehavior` MediatR pipeline behavior (logs handler name + duration)
- HTTP request logging via `app.UseSerilogRequestLogging()`
- Sensitive data (passwords, tokens) must never appear in logs

## Testing

### Unit Tests (xUnit + TDD)

- **Framework**: xUnit
- **Approach**: TDD — write the failing test first based on acceptance criteria, then implement
- One test project per testable layer: `YourApp.Domain.Tests`, `YourApp.Application.Tests`
- 100% business logic coverage enforced — handlers, validators, domain entities, value objects
- Use `Moq` or `NSubstitute` for mocking dependencies (repositories, services)
- Test naming convention: `MethodName_StateUnderTest_ExpectedBehavior` (e.g. `Handle_WhenUserNotFound_ThrowsNotFoundException`)
- Cover all edge cases: null inputs, boundary values, concurrent access patterns

### Integration / Acceptance Tests (Reqnroll)

- **Framework**: Reqnroll (open-source SpecFlow successor) with xUnit runner
- Test project: `YourApp.API.IntegrationTests`
- Gherkin `.feature` files in `Features/` — one per domain feature; describe behavior from the user's perspective
- Step definitions in `StepDefinitions/` — one class per feature
- Use `WebApplicationFactory<Program>` to spin up the full API in-process
- Use **SQL Server LocalDB** for integration test database — seeded fresh per scenario via `[BeforeScenario]` hooks
- Integration tests cover complete request/response cycles including auth flows, validation rejections, and domain event side effects

## Naming Conventions

- **Interfaces**: `I` prefix — `IRepository<T>`, `IUserService`, `ITokenService`
- **Classes**: PascalCase — `UserService`, `CreateUserCommandHandler`
- **Records (commands/queries/DTOs)**: PascalCase — `CreateUserCommand`, `UserResponse`
- **Async methods**: always suffix with `Async` — `GetByIdAsync`, `HandleAsync`
- **Constants**: `SCREAMING_SNAKE_CASE` for module-level constants
- **Private fields**: `_camelCase` prefix — `_repository`, `_logger`
- **Enums**: PascalCase for name and members — `UserStatus.Active`
- **Files**: PascalCase matching the primary type name — `CreateUserCommand.cs`, `UsersEndpoints.cs`
- **Projects**: `YourApp.<Layer>` — `YourApp.Domain`, `YourApp.Application`, `YourApp.Infrastructure`, `YourApp.API`

## Code Arrangements

Order class members as follows — no exceptions:

```
// Constants & static readonly fields
// Private instance fields
// Constructor(s)
// Public properties
// Public methods
// Private methods
```

## CODING CONVENTIONS

### Should follow Global standards

- If rules are not defined here, always consider the global standards first when coding.
- It should follow a self-documenting code mindset.

### SOLID Principles

- **Single Responsibility** — one reason to change per class; handlers handle one use case
- **Open/Closed** — extend behavior via new handlers/behaviors, not by modifying existing ones
- **Liskov Substitution** — implementations must be substitutable for their interfaces
- **Interface Segregation** — define narrow interfaces; prefer `IReadRepository<T>` + `IWriteRepository<T>` over one fat interface when appropriate
- **Dependency Inversion** — depend on abstractions (interfaces) defined in inner layers; never instantiate infrastructure classes directly

### Inversion of Control (IoC)

- Use `Microsoft.Extensions.DependencyInjection` — no third-party DI containers
- Register services in `DependencyInjection.cs` extension methods per layer
- Lifetime rules:
  - `AddScoped` — repositories, DbContext, MediatR handlers
  - `AddSingleton` — configuration objects, `IHttpClientFactory` wrappers, caches
  - `AddTransient` — FluentValidation validators, stateless utilities
- Never use `ServiceLocator` pattern — always constructor-inject dependencies

## Code Quality

- **EditorConfig** — `.editorconfig` at solution root; enforces indent style, charset, and C#-specific rules
- **SonarAnalyzer.CSharp** — Roslyn analyzer package added to all projects; no analyzer warnings allowed to ship
- **Treat warnings as errors** — `<TreatWarningsAsErrors>true</TreatWarningsAsErrors>` in all `.csproj` files
- All committed code must compile with zero warnings and pass all tests
- No `#pragma warning disable` suppressions without a documented justification comment

## Versioning & Breaking Changes

**Versioning format:** MAJOR.MINOR.BUILD

- **API versioning** via URL segment: `/api/v1/`, `/api/v2/` — managed with `Asp.Versioning.Http`
- New API versions are additive — existing versions must remain backward compatible until explicitly deprecated
- Mark deprecated endpoints with `.Deprecated()` in Minimal API and add a `Sunset` header

**Version**: 1.0.0 | **Ratified**: 2026-04-02 | **Last Amended**: 2026-04-02
