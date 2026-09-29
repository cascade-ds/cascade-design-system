import { css } from '@linaria/core';
import { component } from '@cascade-ds/styles';

// The input uses Input's styles, and the popup, list, empty message, groups
// and the shared option look come from Combobox.style. A suggestion has no
// check-mark column: typing free text is the value, not a selection.
export const autocompleteItemCss = css`
  display: flex;
  align-items: center;
  gap: ${component.combobox.item.gap};
`;
