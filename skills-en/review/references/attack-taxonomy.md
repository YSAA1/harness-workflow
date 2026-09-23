# Attack Taxonomy

Used for the Adversarial Pass of `review`. Construct attack hypotheses by taxonomy instead of improvising.

## Five attack-surface categories

### 1. Boundary attacks (Boundary)

Boundary conditions of input or state are broken.

- Null values: `null`, `undefined`, empty strings, empty collections, missing fields
- Extremes: zero, negative numbers, max value + 1, overflow, underflow
- Boundary crossing: off-by-one, array out-of-bounds, string truncation
- Type confusion: numbers treated as strings, objects treated as arrays, JSON type mismatches

**Priority checks**: any function that receives external input, loop boundaries, collection operations.

### 2. Timing attacks (Timing)

Execution order or concurrent behavior produces unexpected results.

- Race conditions: shared state modified concurrently
- Async ordering: Promise/callback firing order differs from assumptions
- Timeout/retry: state inconsistent after timeout, retries causing duplicate operations
- Event timing: event A arrives before event B but the code assumes the opposite

**Priority checks**: async/await, Promise.all, setTimeout, event listeners, database transactions.

### 3. Identity attacks (Identity)

Authentication, authorization, or session boundaries are bypassed or confused.

- Permission bypass: paths missing an auth check, direct object references
- Session confusion: token reuse, session fixation, cross-user data leakage
- Role escalation: low-privilege users performing high-privilege operations
- Input injection: SQL/command/template injection through user input

**Priority checks**: API handlers, middleware, auth guards, database queries, user-input concatenation.

### 4. Contract attacks (Contract)

API, type, or interface conventions are violated.

- Return-value mutation: the function returns a different type on some paths
- Schema drift: API response format inconsistent with documentation
- Parameter contract violation: callers pass arguments that do not meet the convention
- Version incompatibility: interface behavior changes after a dependency upgrade

**Priority checks**: public APIs, exported functions, cross-module calls, dependency updates.

### 5. Data attacks (Data)

State consistency or persistence is broken.

- Partial updates: only part of the associated state was updated
- Cascade failures: omissions when deleting/modifying associated data
- State corruption: invalid state gets persisted
- Data races: concurrent writes cause data inconsistency

**Priority checks**: database operations, cache updates, state management, file I/O.

## Select by change type

| Change type | Core categories | Secondary categories |
| --- | --- | --- |
| New API endpoint | Identity, Contract | Boundary |
| Database schema change | Data | Timing |
| UI interaction change | Timing, Boundary | Identity |
| Dependency upgrade | Contract | — |
| Configuration change | Boundary | Identity |
| Algorithm/logic change | Boundary, Data | Timing |
| Refactor (no behavior change) | Contract | — |
| Performance optimization | Timing | Data |

## How to use

Select checks by relevant risk; there is no requirement of at least one hypothesis per category, nor of filling in irrelevant skipped items. Findings must state the trigger condition, impact, and evidence; having no findings is allowed.
