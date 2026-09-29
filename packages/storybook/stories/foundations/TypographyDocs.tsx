/**
 * Blocks for the Foundations/Typography MDX pages. All data comes from
 * `typographyTokens.ts` (read from the token JSON). Specimens are painted with
 * the tokens' CSS variables, so they show exactly what components render.
 */
import { useEffect, useState, type CSSProperties } from 'react';
import { css, cx } from '@linaria/core';
import { semantic } from '@cascade-ds/styles';
import {
  DocsScope,
  codeCss,
  groupHeadingCss,
  mutedCss,
  stackCss,
  tightStackCss,
} from './DocsChrome';
import {
  primaryFamily,
  scaleNamed,
  typographyStyles,
  type ScaleStep,
  type TypographyProperty,
  type TypographyStyle,
} from './typographyTokens';

const c = semantic.color;

const PANGRAM = 'The quick brown fox jumps over the lazy dog';
const SPECIMEN_TEXT = 'Revenue grew 24% this quarter';
const PARAGRAPH =
  'Design tokens describe a decision once, and every component that reads them follows. Change the token, rebuild, and the whole system moves together, in light and dark.';

const rowCss = css`
  display: grid;
  grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr);
  gap: ${semantic.gap.lg};
  align-items: start;
  padding-block: ${semantic.padding.md};
  border-top: ${semantic.border.width.default} solid ${c.border.subtle};

  &:first-child {
    border-top: none;
  }

  @media (max-width: 720px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const specimenCss = css`
  margin: 0;
  color: ${c.text.primary};
  overflow-wrap: anywhere;
`;

const nameCss = css`
  font-weight: ${semantic.font.weight.semibold};
`;

const propsCss = css`
  display: grid;
  grid-template-columns: max-content minmax(0, 1fr);
  gap: ${semantic.gap.xs} ${semantic.gap.md};
  margin: 0;

  & dt {
    color: ${c.text.secondary};
  }

  & dd {
    margin: 0;
  }
`;

const chipListCss = css`
  display: flex;
  flex-wrap: wrap;
  gap: ${semantic.gap.xs};
`;

const chipCss = css`
  font-family: ${semantic.font.family.code};
  font-size: ${semantic.typography.caption.fontSize};
  padding: 0 ${semantic.padding.xs};
  border-radius: ${semantic.round.sm};
  background-color: ${c.background.subtle};
  color: ${c.text.secondary};
`;

const noticeCss = css`
  color: ${c.feedback.warningText};
`;

const okCss = css`
  color: ${c.feedback.successText};
`;

/** Paints text with every property of a composite typography token. */
function styleVars(style: TypographyStyle): CSSProperties {
  const prefix = style.cssVarPrefix;
  return {
    fontFamily: `var(${prefix}-font-family)`,
    fontSize: `var(${prefix}-font-size)`,
    fontWeight: `var(${prefix}-font-weight)`,
    lineHeight: `var(${prefix}-line-height)`,
    letterSpacing: `var(${prefix}-letter-spacing)`,
  };
}

/**
 * Whether a font is installed or loaded in this browser. Compares text width
 * with and without the font in front of two different fallbacks: if neither
 * changes, the browser is using the fallback.
 */
function isFontAvailable(family: string): boolean {
  const context = document.createElement('canvas').getContext('2d');
  if (!context) return true;
  const sample = 'mmmmmmmmmmlli0123456789';
  return ['monospace', 'serif'].some((fallback) => {
    context.font = `72px ${fallback}`;
    const without = context.measureText(sample).width;
    context.font = `72px "${family}", ${fallback}`;
    return context.measureText(sample).width !== without;
  });
}

function useFontAvailable(family: string | undefined): boolean | undefined {
  const [available, setAvailable] = useState<boolean>();
  useEffect(() => {
    if (!family) return;
    const check = () => setAvailable(isFontAvailable(family));
    check();
    // A web font may still be loading on first render.
    void document.fonts?.ready.then(check);
  }, [family]);
  return available;
}

function FontStatus({ family }: { family: string | undefined }) {
  const available = useFontAvailable(family);
  if (!family || available === undefined) return null;
  return available ? (
    <span className={cx(mutedCss, okCss)}>{family} is rendering in this browser.</span>
  ) : (
    <span className={cx(mutedCss, noticeCss)}>
      {family} isn&apos;t installed or loaded here, so this specimen uses the next font in the
      stack.
    </span>
  );
}

function AliasLine({ alias, primitive }: { alias?: string; primitive?: string }) {
  if (!alias) return <span className={mutedCss}>literal value</span>;
  return (
    <span className={cx(codeCss, mutedCss)}>
      → {alias}
      {primitive && primitive !== alias ? ` → ${primitive}` : null}
    </span>
  );
}

// --- Font families -----------------------------------------------------------

/** Each `semantic.font.family.*` with its stack, a specimen and whether it loads. */
export function FontFamilies() {
  const families = scaleNamed('family')?.steps ?? [];
  return (
    <DocsScope>
      <div>
        {families.map((step) => (
          <div key={step.path} className={rowCss}>
            <div className={tightStackCss}>
              <p
                className={specimenCss}
                style={{ fontFamily: `var(${step.cssVar})`, fontSize: '1.5rem' }}
              >
                {PANGRAM}
              </p>
              <p
                className={cx(specimenCss, mutedCss)}
                style={{ fontFamily: `var(${step.cssVar})` }}
              >
                ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789 {'{}[]()<>=+-*/'}
              </p>
            </div>
            <div className={tightStackCss}>
              <span className={nameCss}>{step.name}</span>
              <span className={codeCss}>{step.path}</span>
              {step.description ? <span className={mutedCss}>{step.description}</span> : null}
              <span className={codeCss}>{step.display}</span>
              <AliasLine alias={step.alias} />
              <FontStatus family={primaryFamily(step.raw)} />
            </div>
          </div>
        ))}
      </div>
    </DocsScope>
  );
}

// --- Composite styles --------------------------------------------------------

function PropertyRow({ label, property }: { label: string; property: TypographyProperty }) {
  return (
    <>
      <dt>{label}</dt>
      <dd className={tightStackCss}>
        <span className={codeCss}>{property.display}</span>
        <AliasLine alias={property.alias} primitive={property.primitive} />
      </dd>
    </>
  );
}

function StyleRow({ style }: { style: TypographyStyle }) {
  const { properties } = style;
  return (
    <div className={rowCss} id={`typography-${style.name}`}>
      <div className={tightStackCss}>
        <p className={specimenCss} style={styleVars(style)}>
          {style.name === 'code' ? 'const total = rows.reduce(sum, 0);' : SPECIMEN_TEXT}
        </p>
      </div>
      <div className={tightStackCss}>
        <span className={nameCss}>{style.name}</span>
        <span className={codeCss}>{style.path}</span>
        <span className={cx(codeCss, mutedCss)}>{style.cssVarPrefix}-*</span>
        {style.description ? <span className={mutedCss}>{style.description}</span> : null}
        <dl className={cx(propsCss, mutedCss)}>
          <PropertyRow label="size" property={properties.fontSize} />
          <PropertyRow label="weight" property={properties.fontWeight} />
          <PropertyRow label="line height" property={properties.lineHeight} />
          <PropertyRow label="tracking" property={properties.letterSpacing} />
          <PropertyRow label="family" property={properties.fontFamily} />
        </dl>
        {style.usedBy.length > 0 ? (
          <div className={tightStackCss}>
            <span className={mutedCss}>Used by</span>
            <span className={chipListCss}>
              {style.usedBy.map((user) => (
                <span key={user} className={chipCss}>
                  {user}
                </span>
              ))}
            </span>
          </div>
        ) : (
          <span className={mutedCss}>Not used by any component yet.</span>
        )}
      </div>
    </div>
  );
}

/** Every `semantic.typography.*` style: a live specimen and its resolved values. */
export function TypographyStyles() {
  return (
    <DocsScope>
      <div>
        {typographyStyles.map((style) => (
          <StyleRow key={style.path} style={style} />
        ))}
      </div>
    </DocsScope>
  );
}

// --- Scales ------------------------------------------------------------------

function ScaleRows({
  steps,
  specimen,
}: {
  steps: ScaleStep[];
  specimen: (step: ScaleStep) => React.ReactNode;
}) {
  return (
    <div>
      {steps.map((step) => (
        <div key={step.path} className={rowCss}>
          <div>{specimen(step)}</div>
          <div className={tightStackCss}>
            <span className={nameCss}>{step.name}</span>
            <span className={codeCss}>{step.path}</span>
            <span className={codeCss}>{step.display}</span>
            <AliasLine alias={step.alias} />
            {step.description ? <span className={mutedCss}>{step.description}</span> : null}
          </div>
        </div>
      ))}
    </div>
  );
}

const lineHeightBoxCss = css`
  margin: 0;
  max-width: 36ch;
  background-image: linear-gradient(${c.border.subtle} 1px, transparent 1px);
  background-size: 100% 1lh;
`;

/** One `semantic.font.*` scale with a specimen per step. */
export function FontScale({
  scale,
}: {
  scale: 'size' | 'weight' | 'line-height' | 'letter-spacing';
}) {
  const data = scaleNamed(scale);
  if (!data) return null;

  const specimen = (step: ScaleStep) => {
    const variable = `var(${step.cssVar})`;
    switch (scale) {
      case 'size':
        return (
          <p className={specimenCss} style={{ fontSize: variable, lineHeight: 1.2 }}>
            {SPECIMEN_TEXT}
          </p>
        );
      case 'weight':
        return (
          <p className={specimenCss} style={{ fontWeight: variable, fontSize: '1.25rem' }}>
            {SPECIMEN_TEXT}
          </p>
        );
      case 'line-height':
        return (
          <p className={cx(specimenCss, lineHeightBoxCss)} style={{ lineHeight: variable }}>
            {PARAGRAPH}
          </p>
        );
      case 'letter-spacing':
        return (
          <p className={specimenCss} style={{ letterSpacing: variable, fontSize: '1.25rem' }}>
            {SPECIMEN_TEXT.toUpperCase()}
          </p>
        );
    }
  };

  return (
    <DocsScope>
      <div className={stackCss}>
        <div className={tightStackCss}>
          <h3 className={groupHeadingCss}>
            {scale}{' '}
            <span className={mutedCss}>
              · <code className={codeCss}>{data.path}.*</code>
            </span>
          </h3>
          {data.description ? <span className={mutedCss}>{data.description}</span> : null}
        </div>
        <ScaleRows steps={data.steps} specimen={specimen} />
      </div>
    </DocsScope>
  );
}
