import { css } from '@linaria/core';
import { component, semantic } from '@cascade-ds/styles';
import { cva } from 'class-variance-authority';

const baseAlertCss = css`
  box-sizing: border-box;
  display: flex;
  align-items: flex-start;
  gap: ${component.alert.gap};
  padding: ${component.alert.padding};
  border-width: ${semantic.border.width.default};
  border-style: solid;
  font-family: ${component.alert.typography.fontFamily};
  font-size: ${component.alert.typography.fontSize};
  font-weight: ${component.alert.typography.fontWeight};
  line-height: ${component.alert.typography.lineHeight};
  letter-spacing: ${component.alert.typography.letterSpacing};
`;

const tones = {
  info: css`
    background-color: ${component.alert.color.info.background};
    border-color: ${component.alert.color.info.border};
    color: ${component.alert.color.info.text};
    --cascade-alert-icon-color: ${component.alert.color.info.icon};
  `,
  success: css`
    background-color: ${component.alert.color.success.background};
    border-color: ${component.alert.color.success.border};
    color: ${component.alert.color.success.text};
    --cascade-alert-icon-color: ${component.alert.color.success.icon};
  `,
  warning: css`
    background-color: ${component.alert.color.warning.background};
    border-color: ${component.alert.color.warning.border};
    color: ${component.alert.color.warning.text};
    --cascade-alert-icon-color: ${component.alert.color.warning.icon};
  `,
  danger: css`
    background-color: ${component.alert.color.danger.background};
    border-color: ${component.alert.color.danger.border};
    color: ${component.alert.color.danger.text};
    --cascade-alert-icon-color: ${component.alert.color.danger.icon};
  `,
};

const layouts = {
  inline: css`
    border-radius: ${component.alert.radius};
  `,
  banner: css`
    width: 100%;
    border-radius: ${semantic.round.none};
    border-inline-width: ${semantic.border.width.none};
    border-block-start-width: ${semantic.border.width.none};
    padding-inline: ${component.alert.banner.paddingInline};
  `,
};

export const alertVariant = cva(baseAlertCss, {
  variants: {
    tone: tones,
    layout: layouts,
  },
  defaultVariants: {
    tone: 'info',
    layout: 'inline',
  },
});

export const alertIconCss = css`
  color: var(--cascade-alert-icon-color);
`;

export const alertBodyCss = css`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: ${component.alert.contentGap};
  min-width: 0;
`;

export const alertTitleCss = css`
  margin: 0;
  font: inherit;
  font-weight: ${component.alert.titleFontWeight};
`;

export const alertDescriptionCss = css`
  margin: 0;
`;

export const alertDismissCss = css`
  flex-shrink: 0;
`;
