# ADR-004: Monorepo release tooling — Changesets over Lerna

## Status

Accepted

## Context

The design system used Lerna for monorepo package management, versioning,
and publishing. pnpm workspaces (`pnpm-workspace.yaml`) already resolve
cross-package dependencies (`workspace:*`) across the monorepo, so Lerna's
workspace/graph responsibilities overlap with what pnpm already does. Keeping
both means two tools sharing the same "how do these packages relate to each
other" responsibility.

Separately, releases need a way to (a) decide what version bump each changed
package gets, and (b) publish those packages, ideally driven from CI rather
than a manual step.

## Decision

Replace Lerna with [Changesets](https://github.com/changesets/changesets)
(`@changesets/cli`), and let pnpm workspaces be the single source of truth
for monorepo package linking.

Reasons:

- Changesets handles both versioning **and** publishing from one place,
  driven by changeset files authored alongside a PR, instead of Lerna
  inferring bumps from commit history/conventions.
- pnpm workspaces already manage cross-package linking, so Lerna's
  workspace-graph role is redundant once Changesets covers versioning and
  publishing — one tool per responsibility: pnpm for workspace linking,
  Changesets for versioning + publishing.
- Changesets is meant to run in CI to consume accumulated changeset files
  and cut version bumps automatically — including bumping
  `@cascade-ds/storybook` — instead of needing a separate release step wired
  to Lerna.

## Consequences

- `lerna.json` is removed; `.changeset/config.json` and `.changeset/README.md`
  are added.
- CI needs a Changesets step (e.g. `changeset version` + `changeset publish`,
  or the equivalent GitHub Action) to consume changeset files and cut
  releases automatically.
- Contributors add a changeset (`pnpm changeset`) alongside PRs that touch a
  publishable package, instead of relying on Lerna's commit-based bumping.
- **Follow-up (resolved 2026-09-24):** `.changeset/config.json` lists
  `@cascade-ds/storybook` under `ignore`, which seemed to conflict with the
  plan to auto-bump Storybook's version. It stays ignored: Storybook is
  private, never published, and imports component source through the `@/`
  alias, so it always shows the code being released and its version carries
  no information. The README's pipeline no longer has a Storybook bump step.
