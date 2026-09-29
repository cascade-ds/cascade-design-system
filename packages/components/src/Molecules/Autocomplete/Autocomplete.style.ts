import { css } from '@linaria/core';
import { component } from '@cascade-ds/styles';

export const autocompleteItemCss = css`
  display: flex;
  align-items: center;
  gap: ${component.combobox.item.gap};
`;
