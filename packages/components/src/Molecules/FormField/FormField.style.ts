import { css } from '@linaria/core';
import { component } from '@cascade-ds/styles';

export const formFieldCss = css`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: ${component.input.label.gap};
  min-width: 0;
`;

export const formFieldHelperCss = css`
  margin: 0;
  font-family: ${component.input.helper.typography.fontFamily};
  font-size: ${component.input.helper.typography.fontSize};
  font-weight: ${component.input.helper.typography.fontWeight};
  line-height: ${component.input.helper.typography.lineHeight};
  letter-spacing: ${component.input.helper.typography.letterSpacing};
`;

export const formFieldHintCss = css`
  color: ${component.input.helper.color};
`;

export const formFieldErrorCss = css`
  color: ${component.input.helper.colorInvalid};
`;
