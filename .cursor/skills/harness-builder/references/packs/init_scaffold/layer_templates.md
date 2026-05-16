# Architecture Layer Templates

Reference templates for common tech stacks. Adapt to the actual directory structure by inspecting imports; never force these models.

## Backend API

```text
types/models -> config -> db/repo -> services -> middleware -> routes
```

## Full-stack

```text
types -> lib -> db -> services -> components -> features -> app/pages
```

## Monorepo

```text
packages/types -> packages/config -> packages/db -> packages/api
packages/ui -> packages/web
```

## Canonical model

```text
Types -> Config -> Repo -> Service -> Runtime -> UI
```

Providers handle approved cross-cutting concerns such as auth, connectors, telemetry, and feature flags.
