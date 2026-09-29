import { css } from '@linaria/core';
import { component } from '@cascade-ds/styles';
import { cva } from 'class-variance-authority';

const baseKbdCss = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  min-width: ${component.kbd.minWidth};
  padding-inline: ${component.kbd.paddingInline};
  border: ${component.kbd.borderWidth} solid ${component.kbd.color.border};
  border-bottom-width: ${component.kbd.borderWidthBottom};
  border-radius: ${component.kbd.radius};
  background-color: ${component.kbd.color.background};
  color: ${component.kbd.color.text};
  font-family: ${component.kbd.typography.fontFamily};
  font-size: ${component.kbd.typography.fontSize};
  font-weight: ${component.kbd.typography.fontWeight};
  line-height: ${component.kbd.typography.lineHeight};
  letter-spacing: ${component.kbd.typography.letterSpacing};
  white-space: nowrap;
  vertical-align: baseline;
`;

export const kbdVariant = cva(baseKbdCss);
