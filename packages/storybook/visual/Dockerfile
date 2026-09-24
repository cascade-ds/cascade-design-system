# Renders the visual regression screenshots in Playwright's Linux image, so
# every machine and CI produce identical pixels (fonts render differently per
# OS). Built and run by `pnpm test:visual` (see docker.ts); the saved
# screenshots are bind-mounted in, never baked into the image.
#
# The tag must match @playwright/test in packages/storybook/package.json:
# the image ships the browsers for exactly that version.
FROM mcr.microsoft.com/playwright:v1.63.0-noble

ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0 \
    CASCADE_VISUAL_DOCKER=1
RUN corepack enable

WORKDIR /repo

# Manifests first, so the dependency layer stays cached until they change.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/components/package.json packages/components/
COPY packages/generator/package.json packages/generator/
COPY packages/storybook/package.json packages/storybook/
COPY packages/styles/package.json packages/styles/
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build:style \
    && pnpm --filter @cascade-ds/storybook exec storybook build --quiet

WORKDIR /repo/packages/storybook
ENTRYPOINT ["pnpm", "exec", "playwright", "test"]
