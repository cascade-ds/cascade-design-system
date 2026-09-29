import { css } from '@linaria/core';
import { component } from '@cascade-ds/styles';
import { cva } from 'class-variance-authority';

const baseAvatarCss = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-sizing: border-box;
  overflow: hidden;
  border-radius: ${component.avatar.radius};
  background-color: ${component.avatar.color.background};
  color: ${component.avatar.color.text};
  font-family: ${component.avatar.typography.fontFamily};
  font-size: ${component.avatar.typography.fontSize};
  font-weight: ${component.avatar.typography.fontWeight};
  line-height: ${component.avatar.typography.lineHeight};
  letter-spacing: ${component.avatar.typography.letterSpacing};
  vertical-align: middle;
  user-select: none;
`;

const sizes = {
  xs: css`
    width: ${component.avatar.size.xs};
    height: ${component.avatar.size.xs};
  `,
  sm: css`
    width: ${component.avatar.size.sm};
    height: ${component.avatar.size.sm};
  `,
  md: css`
    width: ${component.avatar.size.md};
    height: ${component.avatar.size.md};
  `,
  lg: css`
    width: ${component.avatar.size.lg};
    height: ${component.avatar.size.lg};
  `,
  xl: css`
    width: ${component.avatar.size.xl};
    height: ${component.avatar.size.xl};
  `,
};

export const avatarVariant = cva(baseAvatarCss, {
  variants: {
    size: sizes,
  },
  defaultVariants: {
    size: 'md',
  },
});

export const avatarImageCss = css`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const avatarFallbackCss = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;
