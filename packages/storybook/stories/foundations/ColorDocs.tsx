/**
 * Blocks for the Foundations/Colors MDX pages. All data comes from
 * `colorTokens.ts` (read from the token JSON); all docs chrome is styled with
 * semantic tokens so it follows the toolbar theme like any component.
 *
 * Swatches paint with the token's CSS variable. The main swatch follows the
 * toolbar theme; the per-theme chips sit inside an element with an explicit
 * `data-theme`, so the generated `[data-theme='light'|'dark']` rules resolve
 * the same variable to that theme's value side by side.
 */
import { css, cx } from '@linaria/core';
import { semantic } from '@cds/styles';
import { useDarkMode } from '@vueless/storybook-dark-mode';
import {
  THEMES,
  aliasesSemantic,
  backgroundTokens,
  componentColors,
  contrastLevel,
  pairContrast,
  primitiveGroupDescription,
  primitivePaletteDescription,
  primitiveRamps,
  rolePairs,
  semanticColors,
  semanticUsesOf,
  textTokens,
  themeDescriptions,
  type ColorGroup,
  type ColorToken,
  type ContrastPair,
  type PrimitiveRamp,
  type ThemeName,
} from './colorTokens';
import {
  DocsScope,
  codeCss,
  groupHeadingCss,
  mutedCss,
  stackCss,
  subgroupHeadingCss,
  tightStackCss,
} from './DocsChrome';

const c = semantic.color;

// Checkerboard under translucent swatches, drawn with two neutral surfaces.
const checkerCss = css`
  background-color: ${c.background.default};
  background-image:
    linear-gradient(45deg, ${c.background.muted} 25%, transparent 25%),
    linear-gradient(-45deg, ${c.background.muted} 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, ${c.background.muted} 75%),
    linear-gradient(-45deg, transparent 75%, ${c.background.muted} 75%);
  background-size: 12px 12px;
  background-position:
    0 0,
    0 6px,
    6px -6px,
    -6px 0;
`;

const swatchFrameCss = css`
  display: block;
  position: relative;
  overflow: hidden;
  border: ${semantic.border.width.default} solid ${c.border.default};
  border-radius: ${semantic.round.md};
  flex-shrink: 0;
`;

const swatchFillCss = css`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${semantic.font.family.heading};
  font-weight: ${semantic.font.weight.semibold};
`;

function isTextLike(token: ColorToken): boolean {
  return /\.(text|icon)\./.test(token.path) || /(^|-)text$/.test(token.name);
}

/** A swatch painted with `var(--token)`: a block for fills, "Aa" for text/icon colors. */
function Swatch({ token, size }: { token: ColorToken; size: number }) {
  const cssVar = `var(${token.cssVar})`;
  const textLike = isTextLike(token);
  return (
    <span
      className={cx(swatchFrameCss, checkerCss)}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <span
        className={swatchFillCss}
        style={
          textLike
            ? {
                color: cssVar,
                backgroundColor: token.path.includes('.inverse')
                  ? c.background.inverse
                  : c.background.default,
                fontSize: size / 2.6,
              }
            : { backgroundColor: cssVar }
        }
      >
        {textLike ? 'Aa' : null}
      </span>
    </span>
  );
}

const tokenRowCss = css`
  display: grid;
  grid-template-columns: auto minmax(0, 1.4fr) minmax(0, 1fr) minmax(0, 1fr);
  gap: ${semantic.gap.md};
  align-items: start;
  padding-block: ${semantic.padding.sm};
  border-top: ${semantic.border.width.default} solid ${c.border.subtle};

  @media (max-width: 720px) {
    grid-template-columns: auto minmax(0, 1fr);

    & > :nth-child(n + 3) {
      grid-column: 2;
    }
  }
`;

const tokenNameCss = css`
  font-weight: ${semantic.font.weight.semibold};
`;

const themeCellCss = css`
  display: flex;
  gap: ${semantic.gap.sm};
  align-items: flex-start;
`;

const themeLabelCss = css`
  font-size: ${semantic.typography.overline.fontSize};
  font-weight: ${semantic.typography.overline.fontWeight};
  letter-spacing: ${semantic.typography.overline.letterSpacing};
  text-transform: uppercase;
  color: ${c.text.secondary};
`;

const warningCss = css`
  color: ${c.feedback.danger};
  font-weight: ${semantic.font.weight.semibold};
`;

const chipCss = css`
  display: block;
  flex-shrink: 0;
`;

/** One theme's value: a chip scoped to that theme, the alias and the resolved value. */
function ThemeValue({ token, theme }: { token: ColorToken; theme: ThemeName }) {
  const value = token.values[theme];
  if (!value) {
    return (
      <div className={themeCellCss}>
        <span className={warningCss}>Missing in color-{theme}.tokens.json</span>
      </div>
    );
  }
  const directAlias = value.chain[0];
  return (
    <div className={themeCellCss}>
      {/* The chip re-resolves the same variable under this theme's rules. */}
      <span data-theme={theme} className={chipCss}>
        <Swatch token={token} size={32} />
      </span>
      <div className={tightStackCss}>
        <span className={themeLabelCss}>{theme}</span>
        <span className={codeCss}>{value.display}</span>
        {directAlias ? (
          <span className={cx(codeCss, mutedCss)}>→ {directAlias}</span>
        ) : (
          <span className={mutedCss}>literal value</span>
        )}
        {value.primitive && value.primitive !== directAlias ? (
          <span className={cx(codeCss, mutedCss)}>→ {value.primitive}</span>
        ) : null}
      </div>
    </div>
  );
}

function TokenRow({ token }: { token: ColorToken }) {
  const descriptions = THEMES.map((theme) => token.values[theme]?.description);
  const themeSpecific = descriptions[0] !== descriptions[1];
  return (
    <div className={tokenRowCss}>
      <Swatch token={token} size={56} />
      <div className={tightStackCss}>
        <span className={tokenNameCss}>{token.name}</span>
        <span className={codeCss}>{token.path}</span>
        <span className={cx(codeCss, mutedCss)}>{token.cssVar}</span>
        {themeSpecific
          ? THEMES.map((theme, index) =>
              descriptions[index] ? (
                <span key={theme} className={mutedCss}>
                  <strong>{theme}:</strong> {descriptions[index]}
                </span>
              ) : null,
            )
          : token.description && <span className={mutedCss}>{token.description}</span>}
      </div>
      {THEMES.map((theme) => (
        <ThemeValue key={theme} token={token} theme={theme} />
      ))}
    </div>
  );
}

function GroupTokens({ group, depth }: { group: ColorGroup; depth: number }) {
  return (
    <div className={stackCss}>
      {depth > 0 ? (
        <div className={tightStackCss}>
          <h4 className={subgroupHeadingCss}>{group.name}</h4>
          {group.description ? <span className={mutedCss}>{group.description}</span> : null}
        </div>
      ) : null}
      {group.tokens.length > 0 ? (
        <div>
          {group.tokens.map((token) => (
            <TokenRow key={token.path} token={token} />
          ))}
        </div>
      ) : null}
      {group.groups.map((child) => (
        <GroupTokens key={child.path} group={child} depth={depth + 1} />
      ))}
    </div>
  );
}

function countTokens(group: ColorGroup): number {
  return group.tokens.length + group.groups.reduce((sum, g) => sum + countTokens(g), 0);
}

function currentThemeNote(theme: ThemeName) {
  return (
    <span className={mutedCss}>
      Large swatches follow the toolbar theme (now <strong>{theme}</strong>); the small chips always
      show light and dark.
    </span>
  );
}

/** Every purpose group under `semantic.color`, in the order the theme files define them. */
export function SemanticColorGroups() {
  const theme: ThemeName = useDarkMode() ? 'dark' : 'light';
  return (
    <>
      {semanticColors.groups.map((group) => (
        <DocsScope key={group.path}>
          <div className={stackCss}>
            <div className={tightStackCss}>
              <h3 className={groupHeadingCss} id={`color-group-${group.name}`}>
                {group.name}{' '}
                <span className={mutedCss}>
                  · {countTokens(group)} tokens · <code className={codeCss}>{group.path}.*</code>
                </span>
              </h3>
              {group.description ? <span className={mutedCss}>{group.description}</span> : null}
              {currentThemeNote(theme)}
            </div>
            <GroupTokens group={group} depth={0} />
          </div>
        </DocsScope>
      ))}
    </>
  );
}

function allTokens(group: ColorGroup): ColorToken[] {
  return [...group.tokens, ...group.groups.flatMap(allTokens)];
}

const componentIndexCss = css`
  display: flex;
  flex-wrap: wrap;
  gap: ${semantic.gap.sm} ${semantic.gap.md};
`;

const componentIndexLinkCss = css`
  color: ${c.text.link};
`;

/**
 * `component.*` color tokens, one card per component. Flags any token that
 * doesn't alias a semantic color directly, since components must go through
 * the semantic layer to get dark mode.
 */
export function ComponentColorGroups() {
  const theme: ThemeName = useDarkMode() ? 'dark' : 'light';
  const offLayer = componentColors.flatMap(allTokens).filter((token) => !aliasesSemantic(token));

  return (
    <>
      <DocsScope>
        <div className={stackCss}>
          <nav aria-label="Components" className={componentIndexCss}>
            {componentColors.map((group) => (
              <a
                key={group.path}
                href={`#component-colors-${group.name}`}
                className={componentIndexLinkCss}
              >
                {group.name}
              </a>
            ))}
          </nav>
          {offLayer.length > 0 ? (
            <div className={tightStackCss}>
              <span className={warningCss}>
                {offLayer.length} token(s) don&apos;t alias a semantic color directly:
              </span>
              {offLayer.map((token) => (
                <span key={token.path} className={codeCss}>
                  {token.path} → {token.values.light?.chain[0] ?? token.values.light?.raw}
                </span>
              ))}
            </div>
          ) : (
            <span className={mutedCss}>
              Every component color aliases a semantic color, so all of them follow the theme.
            </span>
          )}
        </div>
      </DocsScope>
      {componentColors.map((group) => (
        <DocsScope key={group.path}>
          <div className={stackCss}>
            <div className={tightStackCss}>
              <h3 className={groupHeadingCss} id={`component-colors-${group.name}`}>
                {group.name}{' '}
                <span className={mutedCss}>
                  · {countTokens(group)} tokens · <code className={codeCss}>{group.path}.*</code>
                </span>
              </h3>
              {group.description ? <span className={mutedCss}>{group.description}</span> : null}
              {currentThemeNote(theme)}
            </div>
            <GroupTokens group={group} depth={0} />
          </div>
        </DocsScope>
      ))}
    </>
  );
}

const themeNotesCss = css`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: ${semantic.gap.md};
`;

/** The `$description` each theme file puts on `semantic.color`. */
export function ThemeNotes() {
  return (
    <DocsScope>
      <div className={themeNotesCss}>
        {THEMES.map((theme) => (
          <div key={theme} className={tightStackCss}>
            <span className={themeLabelCss}>{theme} theme</span>
            <span>{themeDescriptions[theme] ?? 'No description.'}</span>
            <span className={cx(codeCss, mutedCss)}>
              packages/tokens/themes/color-{theme}.tokens.json
            </span>
          </div>
        ))}
      </div>
    </DocsScope>
  );
}

// --- Primitive palette -------------------------------------------------------

const rampCss = css`
  display: flex;
  flex-direction: column;
  gap: ${semantic.gap.sm};
  padding-block: ${semantic.padding.sm};
  border-top: ${semantic.border.width.default} solid ${c.border.subtle};
`;

const rampStepsCss = css`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(72px, 1fr));
  gap: ${semantic.gap.sm};
`;

const stepCss = css`
  display: flex;
  flex-direction: column;
  gap: ${semantic.gap.xs};
  min-width: 0;
`;

const stepSwatchCss = css`
  position: relative;
  height: 48px;
  overflow: hidden;
  border: ${semantic.border.width.default} solid ${c.border.default};
  border-radius: ${semantic.round.md};
`;

function stepTitle(path: string): string {
  const uses = semanticUsesOf(path);
  const lines = THEMES.map(
    (theme) => `${theme}: ${uses[theme].length ? uses[theme].join(', ') : '(unused)'}`,
  );
  return `${path}\nAliased by\n${lines.join('\n')}`;
}

function Ramp({ ramp }: { ramp: PrimitiveRamp }) {
  const parent = ramp.path.split('.').slice(0, -1).join('.');
  const parentDescription = ramp.name.includes('.') ? primitiveGroupDescription(parent) : undefined;
  return (
    <div className={rampCss}>
      <div className={tightStackCss}>
        <span className={tokenNameCss}>{ramp.name}</span>
        <span className={cx(codeCss, mutedCss)}>
          {ramp.name === 'base' ? `${ramp.path}.{white,black}` : `${ramp.path}.*`}
        </span>
        {(ramp.description ?? parentDescription) ? (
          <span className={mutedCss}>{ramp.description ?? parentDescription}</span>
        ) : null}
      </div>
      <div className={rampStepsCss}>
        {ramp.steps.map((step) => (
          <div key={step.path} className={stepCss} title={stepTitle(step.path)}>
            <span className={cx(stepSwatchCss, checkerCss)} aria-hidden="true">
              <span className={swatchFillCss} style={{ backgroundColor: `var(${step.cssVar})` }} />
            </span>
            <span className={tokenNameCss}>{step.name}</span>
            <span className={cx(codeCss, mutedCss)}>{step.display}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const noticeCss = css`
  display: flex;
  flex-direction: column;
  gap: ${semantic.gap.xs};
  padding: ${semantic.padding.md};
  border: ${semantic.border.width.default} solid ${c.feedback.warningBorder};
  border-radius: ${semantic.round.md};
  background-color: ${c.feedback.warningSubtle};
  color: ${c.text.primary};
`;

/** Every `primitive.color.*` ramp with its steps and resolved values. */
export function PrimitivePalette() {
  return (
    <DocsScope>
      <div className={stackCss}>
        <div className={noticeCss} role="note">
          <strong>Primitives are not for components.</strong>
          <span>
            Components reference <code className={codeCss}>semantic.*</code> or{' '}
            <code className={codeCss}>component.*</code> tokens only. Primitives are the raw palette
            semantic tokens alias; they do not change between light and dark.
          </span>
        </div>
        {primitivePaletteDescription ? (
          <span className={mutedCss}>{primitivePaletteDescription}</span>
        ) : null}
        <span className={mutedCss}>
          Hover a step to see which semantic tokens alias it in each theme.
        </span>
        <div>
          {primitiveRamps.map((ramp) => (
            <Ramp key={`${ramp.path}:${ramp.name}`} ramp={ramp} />
          ))}
        </div>
      </div>
    </DocsScope>
  );
}

// --- Contrast ----------------------------------------------------------------

const tableWrapCss = css`
  overflow-x: auto;
`;

const tableCss = css`
  border-collapse: separate;
  border-spacing: 2px;
  font-size: ${semantic.typography.bodySm.fontSize};

  & th {
    font-weight: ${semantic.font.weight.semibold};
    text-align: left;
    padding: ${semantic.padding.xs};
    white-space: nowrap;
  }

  & thead th {
    font-family: ${semantic.font.family.code};
    font-weight: ${semantic.font.weight.regular};
    color: ${c.text.secondary};
  }
`;

const cellCss = css`
  padding: ${semantic.padding.xs} ${semantic.padding.sm};
  border-radius: ${semantic.round.sm};
  white-space: nowrap;
  text-align: center;
  font-variant-numeric: tabular-nums;
`;

const failCellCss = css`
  outline: ${semantic.border.width.strong} dashed ${c.border.danger};
  outline-offset: -3px;
`;

const themePanelCss = css`
  background-color: ${c.background.canvas};
  color: ${c.text.primary};
  border-radius: ${semantic.round.md};
  padding: ${semantic.padding.md};
`;

function ratioLabel(ratio: number | undefined): string {
  return ratio === undefined ? 'n/a' : `${ratio.toFixed(2)} ${contrastLevel(ratio)}`;
}

/**
 * A contrast sample. The cell carries its own `data-theme`, so both variables
 * resolve under that theme whatever theme surrounds it.
 */
function ContrastCell({ pair, theme }: { pair: ContrastPair; theme: ThemeName }) {
  const ratio = pairContrast(pair, theme);
  const fails = ratio !== undefined && ratio < 4.5;
  return (
    <td
      data-theme={theme}
      className={cx(cellCss, fails && failCellCss)}
      style={{
        color: `var(${pair.foreground.cssVar})`,
        backgroundColor: `var(${pair.background.cssVar})`,
      }}
      title={`${pair.foreground.path} on ${pair.background.path} (${theme}): ${ratioLabel(ratio)}`}
    >
      {ratioLabel(ratio)}
    </td>
  );
}

/**
 * Every `text.*` token against every opaque `background.*` token, per theme.
 * Each table sits inside `data-theme`, so its cells paint that theme's values.
 */
export function TextOnBackgroundContrast() {
  return (
    <DocsScope>
      <div className={stackCss}>
        {THEMES.map((theme) => (
          <div key={theme} data-theme={theme} className={themePanelCss}>
            <div className={stackCss}>
              <span className={themeLabelCss}>{theme} theme</span>
              <div className={tableWrapCss}>
                <table className={tableCss}>
                  <thead>
                    <tr>
                      <th scope="col">text ↓ / background →</th>
                      {backgroundTokens.map((bg) => (
                        <th key={bg.path} scope="col">
                          {bg.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {textTokens.map((text) => (
                      <tr key={text.path}>
                        <th scope="row" className={codeCss}>
                          {text.name}
                        </th>
                        {backgroundTokens.map((bg) => (
                          <ContrastCell
                            key={bg.path}
                            pair={{ foreground: text, background: bg }}
                            theme={theme}
                          />
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DocsScope>
  );
}

/** Foreground/background pairs the token names say belong together. */
export function RolePairContrast() {
  return (
    <DocsScope>
      <div className={tableWrapCss}>
        <table className={tableCss}>
          <thead>
            <tr>
              <th scope="col">foreground</th>
              <th scope="col">on background</th>
              {THEMES.map((theme) => (
                <th key={theme} scope="col">
                  {theme}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rolePairs.map((pair) => (
              <tr key={`${pair.foreground.path}|${pair.background.path}`}>
                <th scope="row" className={codeCss}>
                  {pair.foreground.path.replace('semantic.color.', '')}
                </th>
                <td className={codeCss}>{pair.background.path.replace('semantic.color.', '')}</td>
                {THEMES.map((theme) => (
                  <ContrastCell key={theme} pair={pair} theme={theme} />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DocsScope>
  );
}
