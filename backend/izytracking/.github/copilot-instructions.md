# IzyTracking Backend - Copilot Instructions

## Architecture Overview

This is a **Spring Boot 4.x** application using **Clean/Hexagonal Architecture** with **feature-based modular organization**. Each feature (auth, companies, fleet, tracking, b2b) follows a three-layer structure:

```
features/{feature}/
├── domain/           # Business logic (entities, value objects, repository interfaces, use case definitions)
├── application/      # Use case implementations (@Service), DTOs
└── infrastructure/   # External adapters (JPA repositories, API controllers)
```

## Key Patterns

### Domain Layer Conventions

- **Entities**: Rich domain models with validation in constructors (see [Agency.java](src/main/java/com/bussola/izytracking/features/companies/domain/entities/agencies/Agency.java))
- **Value Objects**: Immutable, self-validating (see [LegalDocumentationDetails.java](src/main/java/com/bussola/izytracking/features/companies/domain/value_objects/LegalDocumentationDetails.java))
- **Repository Interfaces**: Define contracts in domain, implement in infrastructure
- **Commands/Queries**: Use Java records for CQRS-style input (e.g., `LoginUserCommand`, `ViewAgencyProfileQuery`)

### Use Case Pattern

```java
// Use cases are @Service classes with single `execute()` method
@Service
public class LoginUserUsecase {
    public LoginResponse execute(LoginUserCommand command) { ... }
}
```

### Infrastructure Layer

- **JPA Adapters**: Domain repository → JPA implementation with entity mapping
  - `JpaUserRepository` implements `UserRepository` (domain interface)
  - `JpaSpringUserSupport` extends `JpaRepository` (Spring Data)
  - Manual `toEntity()`/`toDomain()` mapping (no MapStruct)
- **Controllers**: REST endpoints under `infrastructure/api/controller/`

## Naming Conventions

| Type               | Pattern                                     | Example                                     |
| ------------------ | ------------------------------------------- | ------------------------------------------- |
| Use case (command) | `{Action}{Entity}Usecase`                   | `LoginUserUsecase`, `RegisterAgencyUsecase` |
| Use case (query)   | `Get{What}Usecase`                          | `GetCurrentSessionUsecase`                  |
| Command record     | `{Action}{Entity}Command`                   | `RegisterAgencyCommand`                     |
| Query record       | `{View/Get}{What}Query`                     | `ViewAgencyProfileQuery`                    |
| Response DTO       | `{Entity}Response`                          | `UserResponse`, `LoginResponse`             |
| Domain exception   | `{Specific}Exception extends AuthException` | `UserNotFoundException`                     |

## Authentication & Security

- **JWT-based** with HttpOnly cookies (`access_token`, `refresh_token`)
- `JwtService` handles token generation/validation
- `JwtAuthenticationFilter` extracts JWT from cookies
- User roles: `ADMIN`, `AGENCY`, `TRANSPORT_PROVIDER`, `DRIVER`
- Global error handling via `GlobalExceptionHandler` with `ErrorResponse` DTOs

## API Response Format

All endpoints wrap responses in standard DTOs:

```java
ApiResponse<T>     // Success: { success, message, data, timestamp }
ErrorResponse      // Errors: { code, message, path, errors[], timestamp }
```

## Developer Commands

```bash
# Build
./mvnw clean package

# Run (requires PostgreSQL on localhost:5432/izytracking_db)
./mvnw spring-boot:run

# Test
./mvnw test
```

**Dev user**: On startup, creates `admin@demo.local` / `admin1234` (see [TestAdminUserConfig.java](src/main/java/com/bussola/izytracking/config/dev/TestAdminUserConfig.java))

## Important Files

- [SecurityConfig.java](src/main/java/com/bussola/izytracking/config/security/SecurityConfig.java) - Security setup, stateless sessions
- [GlobalExceptionHandler.java](src/main/java/com/bussola/izytracking/config/api/GlobalExceptionHandler.java) - Exception → HTTP response mapping
- [application.yaml](src/main/resources/application.yaml) - DB, JWT configuration

## When Adding New Features

1. Create package under `features/{feature-name}/` with `domain/`, `application/`, `infrastructure/`
2. Define domain entities, value objects, and repository interface in `domain/`
3. Implement use cases in `application/` with Command/Query records in `domain/usecases/`
4. Add JPA entities and repository adapter in `infrastructure/adapters/repository/jpa/`
5. Create REST controller in `infrastructure/api/controller/`
