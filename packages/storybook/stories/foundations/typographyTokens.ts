import primitiveJson from '../../../tokens/foundation/primitive.tokens.json';
import semanticJson from '../../../tokens/foundation/semantic.tokens.json';
import componentJson from '../../../tokens/foundation/component.tokens.json';

type TokenNode = {
  $value?: unknown;
  $type?: string;
  $description?: string;
  [key: string]: unknown;
};

type FlatToken = { path: string; value: unknown; type?: string; description?: string };

type Dimension = { value: number; unit: string };

const ALIAS_PATTERN = /^\{([^}]+)\}$/;

function childEntries(node: TokenNode): [string, TokenNode][] {
  return Object.entries(node).filter(
    (entry): entry is [string, TokenNode] =>
      !entry[0].startsWith('$') && typeof entry[1] === 'object' && entry[1] !== null,
  );
}

function flatten(
  node: TokenNode,
  prefix: string[] = [],
  inheritedType?: string,
  out = new Map<string, FlatToken>(),
): Map<string, FlatToken> {
  const type = node.$type ?? inheritedType;
  for (const [key, child] of childEntries(node)) {
    const path = [...prefix, key];
    if ('$value' in child) {
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

const primitiveRoot = primitiveJson as unknown as TokenNode;
const semanticRoot = semanticJson as unknown as TokenNode;
const componentRoot = componentJson as unknown as TokenNode;

const tokens = new Map([
  ...flatten(primitiveRoot),
  ...flatten(semanticRoot),
  ...flatten(componentRoot),
]);

export type Resolved<T> = { value: T | undefined; chain: string[] };

function resolveValue<T>(value: unknown): Resolved<T> {
  const chain: string[] = [];
  let current = value;
  while (typeof current === 'string') {
    const target = ALIAS_PATTERN.exec(current)?.[1];
    if (!target || chain.includes(target)) break;
    chain.push(target);
    current = tokens.get(target)?.value;
  }
  return { value: current as T | undefined, chain };
}

function resolvePath<T>(path: string): Resolved<T> & { description?: string } {
  const token = tokens.get(path);
  return { ...resolveValue<T>(token?.value), description: token?.description };
}

export function cssVarFor(path: string): string {
  return `--${path.split('.').join('-')}`;
}

function isDimension(value: unknown): value is Dimension {
  return typeof value === 'object' && value !== null && 'value' in value && 'unit' in value;
}

export function formatDimension(value: unknown): string {
  if (!isDimension(value)) return String(value ?? '—');
  const own = `${value.value}${value.unit}`;
  return value.unit === 'rem' ? `${own} · ${value.value * 16}px` : own;
}

export function formatFamily(value: unknown): string {
  return Array.isArray(value) ? value.join(', ') : String(value ?? '—');
}

export function primaryFamily(value: unknown): string | undefined {
  return Array.isArray(value) ? (value[0] as string | undefined) : undefined;
}

function camelCase(name: string): string {
  return name.replace(/-([a-z0-9])/g, (_, char: string) => char.toUpperCase());
}

const styleSources = import.meta.glob<string>('../../../components/src/**/*.style.ts', {
  query: '?raw',
  import: 'default',
  eager: true,
});

function usageFor(name: string): string[] {
  const users = new Set<string>();

  const direct = new RegExp(`semantic\\.typography\\.${camelCase(name)}\\.`);
  for (const [file, source] of Object.entries(styleSources)) {
    if (direct.test(source)) {
      const folder = file.split('/').at(-2);
      if (folder) users.add(folder);
    }
  }

  const alias = new RegExp(`\\{semantic\\.typography\\.${name}(\\.|\\})`);
  for (const token of tokens.values()) {
    if (!token.path.startsWith('component.')) continue;
    if (alias.test(JSON.stringify(token.value))) {
      const component = token.path.split('.')[1];
      if (component) users.add(component);
    }
  }

  return [...users].sort((a, b) => a.localeCompare(b));
}

type CompositeValue = {
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: string;
  lineHeight?: string;
  letterSpacing?: string;
};

export type TypographyProperty = {
  cssName: string;
  alias?: string;
  primitive?: string;
  display: string;
  raw: unknown;
};

export type TypographyStyle = {
  path: string;
  name: string;
  jsName: string;
  cssVarPrefix: string;
  description?: string;
  properties: {
    fontFamily: TypographyProperty;
    fontSize: TypographyProperty;
    fontWeight: TypographyProperty;
    lineHeight: TypographyProperty;
    letterSpacing: TypographyProperty;
  };
  usedBy: string[];
};

const PROPERTY_CSS_NAMES = {
  fontFamily: 'font-family',
  fontSize: 'font-size',
  fontWeight: 'font-weight',
  lineHeight: 'line-height',
  letterSpacing: 'letter-spacing',
} as const;

function toProperty(key: keyof CompositeValue, value: string | undefined): TypographyProperty {
  const resolved = resolveValue<unknown>(value);
  const format =
    key === 'fontFamily'
      ? formatFamily
      : key === 'fontSize' || key === 'letterSpacing'
        ? formatDimension
        : (raw: unknown) => String(raw ?? '—');
  return {
    cssName: PROPERTY_CSS_NAMES[key],
    alias: resolved.chain[0],
    primitive: [...resolved.chain].reverse().find((step) => step.startsWith('primitive.')),
    display: format(resolved.value),
    raw: resolved.value,
  };
}

const typographyGroup = (semanticRoot.semantic as TokenNode | undefined)?.typography as
  TokenNode | undefined;

export const typographyStyles: TypographyStyle[] = childEntries(typographyGroup ?? {}).map(
  ([name, node]) => {
    const path = `semantic.typography.${name}`;
    const value = (node.$value ?? {}) as CompositeValue;
    return {
      path,
      name,
      jsName: camelCase(name),
      cssVarPrefix: cssVarFor(path),
      description: node.$description,
      properties: {
        fontFamily: toProperty('fontFamily', value.fontFamily),
        fontSize: toProperty('fontSize', value.fontSize),
        fontWeight: toProperty('fontWeight', value.fontWeight),
        lineHeight: toProperty('lineHeight', value.lineHeight),
        letterSpacing: toProperty('letterSpacing', value.letterSpacing),
      },
      usedBy: usageFor(name),
    };
  },
);

export const typographyDescription = typographyGroup?.$description;

export type ScaleStep = {
  path: string;
  name: string;
  cssVar: string;
  description?: string;
  alias?: string;
  display: string;
  raw: unknown;
};

export type Scale = {
  name: string;
  path: string;
  description?: string;
  steps: ScaleStep[];
};

const fontGroup = (semanticRoot.semantic as TokenNode | undefined)?.font as TokenNode | undefined;

function formatStep(scale: string, raw: unknown): string {
  if (scale === 'family') return formatFamily(raw);
  if (scale === 'size' || scale === 'letter-spacing') return formatDimension(raw);
  return String(raw ?? '—');
}

export const fontScales: Scale[] = childEntries(fontGroup ?? {}).map(([scale, node]) => ({
  name: scale,
  path: `semantic.font.${scale}`,
  description: node.$description,
  steps: childEntries(node).map(([name]) => {
    const path = `semantic.font.${scale}.${name}`;
    const resolved = resolvePath<unknown>(path);
    return {
      path,
      name,
      cssVar: cssVarFor(path),
      description: resolved.description,
      alias: resolved.chain[0],
      display: formatStep(scale, resolved.value),
      raw: resolved.value,
    };
  }),
}));

export function scaleNamed(name: string): Scale | undefined {
  return fontScales.find((scale) => scale.name === name);
}
