/**
 * Reads the color tokens straight from the DTCG source files in
 * `packages/tokens` and resolves them per theme, so the color docs can never
 * drift from the tokens. Nothing here is copied from the generated output.
 *
 * Resolution mirrors the resolver (`design-system.resolver.json`): the
 * foundation tokens form the base tree and the theme file (light or dark) is
 * layered on top, keyed by token path. Aliases (`{primitive.color.gray.900}`)
 * are followed through that merged tree until a literal value is reached.
 */
import primitiveJson from '../../../tokens/foundation/primitive.tokens.json';
import semanticJson from '../../../tokens/foundation/semantic.tokens.json';
import componentJson from '../../../tokens/foundation/component.tokens.json';
import lightJson from '../../../tokens/themes/color-light.tokens.json';
import darkJson from '../../../tokens/themes/color-dark.tokens.json';

export type ThemeName = 'light' | 'dark';
export const THEMES: readonly ThemeName[] = ['light', 'dark'];

/** A DTCG color value, e.g. `{ colorSpace: 'srgb', components: [1, 1, 1], alpha: 0.5 }`. */
type DtcgColor = {
  colorSpace: string;
  components: number[];
  alpha?: number;
  hex?: string;
};

type TokenNode = {
  $value?: unknown;
  $type?: string;
  $description?: string;
  [key: string]: unknown;
};

type FlatToken = {
  path: string;
  value: unknown;
  type?: string;
  description?: string;
};

export type Rgba = { r: number; g: number; b: number; a: number };

/** One theme's view of a token: its raw `$value`, the alias chain and the final color. */
export type ResolvedValue = {
  /** Raw `$value` as authored, e.g. `{primitive.color.gray.900}` or a literal. */
  raw: string;
  /** Every alias followed, in order (empty when the value is a literal). */
  chain: string[];
  /** The primitive the chain ends at, when it ends at one. */
  primitive?: string;
  /** The resolved color, when the chain ends at a parseable color. */
  color?: Rgba;
  /** Human-readable resolved value (`#18181B`, `#000000 / 50%`). */
  display: string;
  description?: string;
};

export type ColorToken = {
  /** Dotted token path, e.g. `semantic.color.text.primary`. */
  path: string;
  /** Path relative to its group, e.g. `primary` or `categorical.1`. */
  name: string;
  /** CSS custom property name, e.g. `--semantic-color-text-primary`. */
  cssVar: string;
  /** Description, preferring the light file's and falling back to the dark one's. */
  description?: string;
  values: Partial<Record<ThemeName, ResolvedValue>>;
};

export type ColorGroup = {
  /** Dotted path of the group, e.g. `semantic.color.feedback`. */
  path: string;
  /** Path relative to the parent group, e.g. `feedback`. */
  name: string;
  description?: string;
  tokens: ColorToken[];
  groups: ColorGroup[];
};

const primitiveRoot = primitiveJson as unknown as TokenNode;
const semanticRoot = semanticJson as unknown as TokenNode;
const componentRoot = componentJson as unknown as TokenNode;
const themeRoots: Record<ThemeName, TokenNode> = {
  light: lightJson as unknown as TokenNode,
  dark: darkJson as unknown as TokenNode,
};

const ALIAS_PATTERN = /^\{([^}]+)\}$/;

function childEntries(node: TokenNode): [string, TokenNode][] {
  return Object.entries(node).filter(
    (entry): entry is [string, TokenNode] =>
      !entry[0].startsWith('$') && typeof entry[1] === 'object' && entry[1] !== null,
  );
}

function isToken(node: TokenNode): boolean {
  return '$value' in node;
}

/** Flattens a token tree into `path -> token`, inheriting `$type` from groups. */
function flatten(
  node: TokenNode,
  prefix: string[] = [],
  inheritedType?: string,
  out = new Map<string, FlatToken>(),
): Map<string, FlatToken> {
  const type = node.$type ?? inheritedType;
  for (const [key, child] of childEntries(node)) {
    const path = [...prefix, key];
    if (isToken(child)) {
      out.set(path.join('.'), {
        path: path.join('.'),
        value: child.$value,
        type: child.$type ?? type,
        description: child.$description,
      });
    } else {
      flatten(child, path, child.$type ?? type, out);
    }
  }
  return out;
}

function getNode(root: TokenNode, path: string[]): TokenNode | undefined {
  let node: TokenNode | undefined = root;
  for (const key of path) {
    const next: unknown = node?.[key];
    node = typeof next === 'object' && next !== null ? (next as TokenNode) : undefined;
  }
  return node;
}

const primitiveTokens = flatten(primitiveRoot);
const foundationTokens = new Map([
  ...primitiveTokens,
  ...flatten(semanticRoot),
  ...flatten(componentRoot),
]);

/** foundation + theme, merged by path (theme wins), as the resolver composes them. */
const mergedByTheme: Record<ThemeName, Map<string, FlatToken>> = {
  light: new Map([...foundationTokens, ...flatten(themeRoots.light)]),
  dark: new Map([...foundationTokens, ...flatten(themeRoots.dark)]),
};

function isDtcgColor(value: unknown): value is DtcgColor {
  return (
    typeof value === 'object' &&
    value !== null &&
    'components' in value &&
    Array.isArray((value as DtcgColor).components)
  );
}

function clamp01(n: number): number {
  return Math.min(1, Math.max(0, n));
}

function parseHex(hex: string): Rgba | undefined {
  const match = /^#?([0-9a-f]{6})([0-9a-f]{2})?$/i.exec(hex.trim());
  if (!match?.[1]) {
    return undefined;
  }
  const int = parseInt(match[1], 16);
  return {
    r: ((int >> 16) & 255) / 255,
    g: ((int >> 8) & 255) / 255,
    b: (int & 255) / 255,
    a: match[2] ? parseInt(match[2], 16) / 255 : 1,
  };
}

/** Converts a literal color `$value` to sRGB. Only `srgb` (or a hex) is supported. */
function toRgba(value: unknown): Rgba | undefined {
  if (typeof value === 'string') {
    return parseHex(value);
  }
  if (!isDtcgColor(value)) {
    return undefined;
  }
  if (value.colorSpace !== 'srgb') {
    return value.hex ? parseHex(value.hex) : undefined;
  }
  const [r = 0, g = 0, b = 0] = value.components;
  return { r: clamp01(r), g: clamp01(g), b: clamp01(b), a: clamp01(value.alpha ?? 1) };
}

function channelHex(n: number): string {
  return Math.round(n * 255)
    .toString(16)
    .padStart(2, '0')
    .toUpperCase();
}

export function formatColor(color: Rgba): string {
  const hex = `#${channelHex(color.r)}${channelHex(color.g)}${channelHex(color.b)}`;
  if (color.a >= 1) {
    return hex;
  }
  return `${hex} / ${Math.round(color.a * 100)}%`;
}

function formatRaw(value: unknown): string {
  if (typeof value === 'string') {
    return value;
  }
  const color = toRgba(value);
  return color ? formatColor(color) : JSON.stringify(value);
}

/** Follows aliases for one token in one theme. */
function resolve(path: string, theme: ThemeName): ResolvedValue | undefined {
  const tokens = mergedByTheme[theme];
  const start = tokens.get(path);
  if (!start) {
    return undefined;
  }

  const chain: string[] = [];
  let current: FlatToken | undefined;
  let value: unknown = start.value;
  while (typeof value === 'string') {
    const target = ALIAS_PATTERN.exec(value)?.[1];
    if (!target) {
      break;
    }
    if (chain.includes(target)) {
      return { raw: formatRaw(start.value), chain, display: `circular alias → ${target}` };
    }
    chain.push(target);
    current = tokens.get(target);
    if (!current) {
      return { raw: formatRaw(start.value), chain, display: `unresolved alias ${value}` };
    }
    value = current.value;
  }

  const color = toRgba(value);
  const primitive = [...chain].reverse().find((step) => step.startsWith('primitive.'));
  return {
    raw: formatRaw(start.value),
    chain,
    primitive,
    color,
    display: color ? formatColor(color) : formatRaw(value),
    description: start.description,
  };
}

export function cssVarFor(path: string): string {
  return `--${path.split('.').join('-')}`;
}

function mergeKeys(nodes: (TokenNode | undefined)[]): string[] {
  const keys: string[] = [];
  for (const node of nodes) {
    if (!node) continue;
    for (const [key] of childEntries(node)) {
      if (!keys.includes(key)) keys.push(key);
    }
  }
  return keys;
}

/**
 * Builds the semantic color tree from the union of the light and dark theme
 * files, keeping the authored group order, so a token that exists in only one
 * theme still shows up (with its missing value flagged).
 */
function buildGroup(path: string[], name: string): ColorGroup {
  const nodes = THEMES.map((theme) => getNode(themeRoots[theme], path));
  const group: ColorGroup = {
    path: path.join('.'),
    name,
    description: nodes.find((node) => node?.$description)?.$description,
    tokens: [],
    groups: [],
  };

  for (const key of mergeKeys(nodes)) {
    const childPath = [...path, key];
    const children = nodes.map((node) => node?.[key] as TokenNode | undefined);
    if (children.some((child) => child && isToken(child))) {
      const dotted = childPath.join('.');
      const values: ColorToken['values'] = {};
      for (const theme of THEMES) {
        const resolved = resolve(dotted, theme);
        if (resolved) values[theme] = resolved;
      }
      group.tokens.push({
        path: dotted,
        name: key,
        cssVar: cssVarFor(dotted),
        description: values.light?.description ?? values.dark?.description,
        values,
      });
    } else {
      group.groups.push(buildGroup(childPath, key));
    }
  }
  return group;
}

const SEMANTIC_COLOR_PATH = ['semantic', 'color'];

/** `semantic.color.*`, grouped by purpose exactly as the theme files group it. */
export const semanticColors: ColorGroup = buildGroup(SEMANTIC_COLOR_PATH, 'color');

/** Top-level description of each theme file's `semantic.color` group. */
export const themeDescriptions: Partial<Record<ThemeName, string>> = Object.fromEntries(
  THEMES.map((theme) => [theme, getNode(themeRoots[theme], SEMANTIC_COLOR_PATH)?.$description]),
);

/** Finds a semantic color token by path. */
export function findSemanticToken(path: string, group = semanticColors): ColorToken | undefined {
  return (
    group.tokens.find((token) => token.path === path) ??
    group.groups.map((child) => findSemanticToken(path, child)).find(Boolean)
  );
}

// --- Component colors --------------------------------------------------------

/**
 * The color-typed tokens of one subtree of `component.tokens.json`, keeping
 * the authored nesting. Returns `undefined` when the subtree has no colors, so
 * spacing- or typography-only groups drop out.
 */
function buildColorSubtree(
  node: TokenNode,
  path: string[],
  inheritedType?: string,
): ColorGroup | undefined {
  const type = node.$type ?? inheritedType;
  const group: ColorGroup = {
    path: path.join('.'),
    name: path[path.length - 1] ?? '',
    description: node.$description,
    tokens: [],
    groups: [],
  };

  for (const [key, child] of childEntries(node)) {
    const childPath = [...path, key];
    if (isToken(child)) {
      if ((child.$type ?? type) !== 'color') continue;
      const dotted = childPath.join('.');
      const values: ColorToken['values'] = {};
      for (const theme of THEMES) {
        const resolved = resolve(dotted, theme);
        if (resolved) values[theme] = resolved;
      }
      group.tokens.push({
        path: dotted,
        name: key,
        cssVar: cssVarFor(dotted),
        description: child.$description,
        values,
      });
    } else {
      const subtree = buildColorSubtree(child, childPath, child.$type ?? type);
      if (subtree) group.groups.push(subtree);
    }
  }

  return group.tokens.length > 0 || group.groups.length > 0 ? group : undefined;
}

/**
 * One group per component (`component.button`, `component.alert`, …) holding
 * its color tokens. Components alias semantic colors, so each token resolves
 * per theme through the semantic layer.
 */
export const componentColors: ColorGroup[] = childEntries(getNode(componentRoot, ['component']) ?? {})
  .map(([key, node]) => buildColorSubtree(node, ['component', key]))
  .filter((group): group is ColorGroup => group !== undefined);

/** Whether a component token aliases a semantic color directly, as components must. */
export function aliasesSemantic(token: ColorToken): boolean {
  return THEMES.every((theme) => token.values[theme]?.chain[0]?.startsWith('semantic.') ?? false);
}

// --- Primitive palette -------------------------------------------------------

export type PrimitiveStep = {
  path: string;
  name: string;
  cssVar: string;
  color?: Rgba;
  display: string;
  description?: string;
};

export type PrimitiveRamp = {
  path: string;
  name: string;
  description?: string;
  steps: PrimitiveStep[];
};

const PRIMITIVE_COLOR_PATH = ['primitive', 'color'];
const primitiveColorRoot = getNode(primitiveRoot, PRIMITIVE_COLOR_PATH);

export const primitivePaletteDescription = primitiveColorRoot?.$description;

function toStep(path: string, name: string): PrimitiveStep {
  const token = primitiveTokens.get(path);
  const color = toRgba(token?.value);
  return {
    path,
    name,
    cssVar: cssVarFor(path),
    color,
    display: color ? formatColor(color) : formatRaw(token?.value),
    description: token?.description,
  };
}

/**
 * Every `primitive.color.*` ramp. A group whose children are tokens is one
 * ramp (`gray`, `alpha.black`); loose tokens directly under `primitive.color`
 * (`white`, `black`) are collected into a single "base" ramp.
 */
function buildRamps(node: TokenNode, path: string[], out: PrimitiveRamp[] = []): PrimitiveRamp[] {
  const loose: PrimitiveStep[] = [];
  const steps: PrimitiveStep[] = [];
  for (const [key, child] of childEntries(node)) {
    const childPath = [...path, key];
    if (isToken(child)) {
      (path.length === PRIMITIVE_COLOR_PATH.length ? loose : steps).push(
        toStep(childPath.join('.'), key),
      );
    } else {
      buildRamps(child, childPath, out);
    }
  }
  if (steps.length > 0) {
    out.push({
      path: path.join('.'),
      name: path.slice(PRIMITIVE_COLOR_PATH.length).join('.'),
      description: node.$description,
      steps,
    });
  }
  if (loose.length > 0) {
    out.push({ path: path.join('.'), name: 'base', steps: loose });
  }
  return out;
}

export const primitiveRamps: PrimitiveRamp[] = primitiveColorRoot
  ? buildRamps(primitiveColorRoot, PRIMITIVE_COLOR_PATH)
  : [];

/** Descriptions of intermediate primitive groups such as `alpha`. */
export function primitiveGroupDescription(path: string): string | undefined {
  return getNode(primitiveRoot, path.split('.'))?.$description;
}

/** Semantic tokens that alias a given primitive, per theme (for "used by" hints). */
export function semanticUsesOf(primitivePath: string): Record<ThemeName, string[]> {
  const uses: Record<ThemeName, string[]> = { light: [], dark: [] };
  const visit = (group: ColorGroup) => {
    for (const token of group.tokens) {
      for (const theme of THEMES) {
        if (token.values[theme]?.primitive === primitivePath) uses[theme].push(token.path);
      }
    }
    group.groups.forEach(visit);
  };
  visit(semanticColors);
  return uses;
}

// --- Contrast ----------------------------------------------------------------

function linearize(channel: number): number {
  return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
}

function luminance({ r, g, b }: Rgba): number {
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
}

/** Paints `top` over an opaque `bottom` (for translucent foregrounds). */
function composite(top: Rgba, bottom: Rgba): Rgba {
  const mix = (t: number, b: number) => t * top.a + b * (1 - top.a);
  return { r: mix(top.r, bottom.r), g: mix(top.g, bottom.g), b: mix(top.b, bottom.b), a: 1 };
}

/**
 * WCAG 2.x contrast ratio. Returns `undefined` when the background is
 * translucent, since its effective color depends on what sits beneath it.
 */
export function contrastRatio(foreground: Rgba, background: Rgba): number | undefined {
  if (background.a < 1) {
    return undefined;
  }
  const fg = foreground.a < 1 ? composite(foreground, background) : foreground;
  const [light, dark] = [luminance(fg), luminance(background)].sort((a, b) => b - a) as [
    number,
    number,
  ];
  return (light + 0.05) / (dark + 0.05);
}

export type ContrastLevel = 'AAA' | 'AA' | 'AA large' | 'fail';

export function contrastLevel(ratio: number): ContrastLevel {
  if (ratio >= 7) return 'AAA';
  if (ratio >= 4.5) return 'AA';
  if (ratio >= 3) return 'AA large';
  return 'fail';
}

export type ContrastPair = {
  foreground: ColorToken;
  background: ColorToken;
};

function groupAt(path: string): ColorGroup | undefined {
  const visit = (group: ColorGroup): ColorGroup | undefined =>
    group.path === path ? group : group.groups.map(visit).find(Boolean);
  return visit(semanticColors);
}

function isOpaqueInBothThemes(token: ColorToken): boolean {
  return THEMES.every((theme) => (token.values[theme]?.color?.a ?? 0) >= 1);
}

/** `semantic.color.text.*` and the opaque `semantic.color.background.*` tokens. */
export const textTokens: ColorToken[] = groupAt('semantic.color.text')?.tokens ?? [];
export const backgroundTokens: ColorToken[] = (
  groupAt('semantic.color.background')?.tokens ?? []
).filter(isOpaqueInBothThemes);

/**
 * Role pairs derived from the naming conventions in the theme files:
 * - `text.on-<x>` sits on the fill `brand.<x>` or `feedback.<x>`;
 * - `<group>.<x>-text` sits on its siblings `<x>-subtle` and `<x>-muted`.
 */
export const rolePairs: ContrastPair[] = (() => {
  const pairs: ContrastPair[] = [];
  for (const text of textTokens) {
    const role = /^on-(.+)$/.exec(text.name)?.[1];
    if (!role) continue;
    const fill = ['brand', 'feedback']
      .map((group) => findSemanticToken(`semantic.color.${group}.${role}`))
      .find(Boolean);
    if (fill) pairs.push({ foreground: text, background: fill });
  }
  for (const groupName of ['brand', 'feedback']) {
    const group = groupAt(`semantic.color.${groupName}`);
    for (const token of group?.tokens ?? []) {
      const role = /^(.+)-text$/.exec(token.name)?.[1];
      if (!role) continue;
      for (const suffix of ['subtle', 'muted']) {
        const background = group?.tokens.find((t) => t.name === `${role}-${suffix}`);
        if (background) pairs.push({ foreground: token, background });
      }
    }
  }
  return pairs;
})();

export function pairContrast(pair: ContrastPair, theme: ThemeName): number | undefined {
  const fg = pair.foreground.values[theme]?.color;
  const bg = pair.background.values[theme]?.color;
  return fg && bg ? contrastRatio(fg, bg) : undefined;
}
