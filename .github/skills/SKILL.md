---
name: skills
description: 'Use when working in React or TypeScript code in this repo. Enforces function components only, avoids class-based frontend patterns, and prefers destructuring when it improves clarity.'
---

# Frontend Conventions

Apply these rules across `src/**` in this repository.

- Use only functional React components.
- Do not introduce `React.Component`, `React.PureComponent`, or class-based component patterns.
- Prefer plain functions, typed objects, and factory helpers over classes in frontend code.
- Destructure props, parameters, and repeated object reads when that makes the code easier to scan.
- Skip destructuring when it would reduce clarity, create name collisions, or make the code more verbose.
- Place helper functions in a separate `helpers.ts` file in the same folder as the component or logic file.
- Place file-level constants/variables in a separate `constants.ts` file in the same folder as the component or logic file.
- Name newly created variables with a lowercase first letter (for example `newVariable`).
- Place TanStack query and mutation modules in `src/lib/queries-requests/**`.
- Use per-domain files such as `queries.ts`, `requests.ts`, and `mutations.ts`.
- Keep UI modules (`src/pages/**`, `src/components/**`, `src/shared/**`) free of direct `services/api-client` calls.
- Destructure TanStack hook results at the call site (for example: `const { data, isLoading, isSuccess } = useDataQuery()`) instead of keeping a single query result object.
- Avoid namespaced React types such as `React.ReactNode` and `React.FC`; import React types directly (for example: `import type { ReactNode } from 'react'`).
- Do not use `JSX.Element`, `JSX.IntrinsicElements`, or any other type from the `JSX` namespace in new code. Use the equivalent React types instead (for example: `ReactElement` instead of `JSX.Element`).
- If a component grows to roughly 150-200 lines, prefer breaking it into smaller imported subcomponents and/or extracting related logic for readability when feasible.
- Follow repository Oxlint restricted imports: avoid `useMemo`, `useCallback`, and `useContext` imports from `react`; avoid default `React` import; import `screen` from `shadow-dom-testing-library`.
- Prefer semantic test queries first and add `data-testid` for unstable or hard-to-target elements.
- Reuse test setup from `src/tests/setup.tsx` and test wrappers from `src/tests/test-helpers.tsx`.
- Follow enforced naming: kebab-case folders under `src/**/*`; kebab-case files in enforced domains; and no `index.ts` or `index.tsx` files.

# Examples

Prefer:

```ts
function UserCard({ user, onSelect }: UserCardProps) {
  const { name, role } = user
  return <button onClick={onSelect}>{name} ({role})</button>
}
```

Avoid:

```ts
class UserCard extends React.Component<UserCardProps> {
  render() {
    return <button onClick={this.props.onSelect}>{this.props.user.name}</button>
  }
}
```

# Future Updates

Add more frontend-specific agent guidance here when the rule should be discoverable as a skill rather than always-on workspace behavior.
