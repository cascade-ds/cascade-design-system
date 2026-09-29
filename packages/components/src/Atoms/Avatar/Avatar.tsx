import { Avatar as BaseAvatar } from '@base-ui/react/avatar';
import { avatarFallbackCss, avatarImageCss, avatarVariant } from './Avatar.style';
import type { VariantProps } from 'class-variance-authority';
import { cx } from '@linaria/core';

export type AvatarProps = VariantProps<typeof avatarVariant> &
  Omit<React.ComponentPropsWithRef<'span'>, 'children'> & {
    /** Who the avatar shows. It names the avatar and gives the default initials. */
    name: string;
    /** Image URL. Until it loads, or if it fails, the fallback shows instead. */
    src?: string;
    /** Shown without an image. Defaults to the initials of `name`. */
    fallback?: React.ReactNode;
  };

/** First letters of the first and last words: "Ada Lovelace" → "AL". */
function getInitials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const first = words.at(0)?.charAt(0) ?? '';
  const last = words.length > 1 ? (words.at(-1)?.charAt(0) ?? '') : '';
  return (first + last).toUpperCase();
}

/**
 * A person's picture, falling back to their initials (or `fallback`) while
 * the image loads or when there is none. Exposed as one image named `name`.
 * When the name is already shown next to it, pass `aria-hidden` so it isn't
 * announced twice.
 */
function Avatar(props: AvatarProps) {
  const { size, name, src, fallback, className, ...restProps } = props;

  return (
    <BaseAvatar.Root
      role="img"
      aria-label={name}
      className={cx(avatarVariant({ size }), className)}
      {...restProps}
    >
      {src && <BaseAvatar.Image src={src} alt="" className={avatarImageCss} />}
      <BaseAvatar.Fallback aria-hidden="true" className={avatarFallbackCss}>
        {fallback ?? getInitials(name)}
      </BaseAvatar.Fallback>
    </BaseAvatar.Root>
  );
}

export default Avatar;
