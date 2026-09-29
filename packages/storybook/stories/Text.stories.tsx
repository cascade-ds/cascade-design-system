import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { css } from '@linaria/core';
import { motion as m } from 'motion/react';
import { motion } from '@cascade-ds/styles/motion';
import Button from '@/Atoms/Button/Button';
import VisuallyHidden from '@/Atoms/VisuallyHidden/VisuallyHidden';
import Stack from '@/Layout/Stack/Stack';
import Text from '@/Atoms/Text/Text';
import type { TextProps } from '@/Atoms/Text/Text';

// Transforms need a box, and `pre` keeps a lone space from collapsing.
const segmentCss = css`
  display: inline-block;
  white-space: pre;
`;

// Clips each word so it rises into view from below its own line.
const wordMaskCss = css`
  display: inline-block;
  overflow: hidden;
  vertical-align: bottom;
`;

type TextRevealProps = Pick<TextProps, 'variant' | 'size' | 'weight' | 'color'> & {
  text: string;
  by: 'character' | 'word';
};

// Splits the text into Motion spans that animate in one after another. The
// spans are hidden from assistive tech, which reads the full sentence once
// from VisuallyHidden instead of letter by letter.
function TextReveal({ text, by, ...textProps }: TextRevealProps) {
  const [playCount, setPlayCount] = useState(0);
  const segments = by === 'character' ? Array.from(text) : text.split(' ');
  const stagger = by === 'character' ? motion.stagger.fast : motion.stagger.normal;

  return (
    <Stack align="start">
      <Text {...textProps}>
        <VisuallyHidden>{text}</VisuallyHidden>
        <span aria-hidden="true" key={playCount}>
          {segments.map((segment, index) =>
            by === 'character' ? (
              <m.span
                key={index}
                className={segmentCss}
                initial={{ opacity: 0, y: '100%' }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: motion.duration.slow,
                  ease: motion.easing.overshoot,
                  delay: index * stagger,
                }}
              >
                {segment}
              </m.span>
            ) : (
              <span key={index}>
                <span className={wordMaskCss}>
                  <m.span
                    className={segmentCss}
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    transition={{
                      duration: motion.duration.moderate,
                      ease: motion.easing.emphasized,
                      delay: index * stagger,
                    }}
                  >
                    {segment}
                  </m.span>
                </span>{' '}
              </span>
            ),
          )}
        </span>
      </Text>
      <Button variant="secondary" size="sm" onClick={() => setPlayCount((count) => count + 1)}>
        Replay
      </Button>
    </Stack>
  );
}

const meta = {
  title: 'CascadeDS/Components/Atom/Text',
  component: Text,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'radio',
      options: ['body', 'caption'],
      description:
        'Typographic role. `body` for running text (renders a `p`), `caption` for small supporting text (renders a `span`). Sets the default size, weight and color.',
    },
    size: {
      control: 'radio',
      options: ['xs', 'sm', 'md', 'lg'],
      description:
        'Overrides the font size set by `variant`. Leave unset to use the variant default.',
    },
    weight: {
      control: 'radio',
      options: ['regular', 'medium', 'semibold', 'bold'],
      description:
        'Overrides the font weight set by `variant`. Leave unset to use the variant default.',
    },
    color: {
      control: 'select',
      options: [
        'primary',
        'secondary',
        'tertiary',
        'disabled',
        'brand',
        'inverse',
        'danger',
        'success',
        'warning',
        'info',
      ],
      description:
        'Overrides the text color set by `variant` (`body` defaults to `primary`, `caption` to `secondary`). Use `inverse` only on inverse backgrounds.',
    },
    as: {
      control: 'select',
      options: ['p', 'span', 'div', 'label', 'strong', 'em', 'small'],
      description: 'Element to render. Defaults to `p` for `body` and `span` for `caption`.',
    },
  },
  args: {
    children: 'The quick brown fox jumps over the lazy dog.',
    variant: 'body',
  },
} satisfies Meta<typeof Text>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Caption: Story = {
  args: {
    variant: 'caption',
    children: 'Last updated 5 minutes ago',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
  },
};

export const Bold: Story = {
  args: {
    weight: 'bold',
  },
};

export const Secondary: Story = {
  args: {
    color: 'secondary',
  },
};

export const Danger: Story = {
  args: {
    color: 'danger',
    children: 'Something went wrong.',
  },
};

export const AsStrong: Story = {
  args: {
    as: 'strong',
    weight: 'semibold',
    children: 'Important inline text',
  },
};

/**
 * Letters rise in one by one with a slight overshoot, `motion.stagger.fast`
 * apart. Needs `MotionProvider` from `@cascade-ds/components/motion`.
 */
export const MotionCharacterReveal: Story = {
  args: {
    size: 'lg',
    weight: 'semibold',
  },
  render: ({ children, variant, size, weight, color }) => (
    <TextReveal {...{ variant, size, weight, color }} text={String(children)} by="character" />
  ),
};

/**
 * Words slide up from behind their own line, `motion.stagger.normal` apart.
 * Needs `MotionProvider` from `@cascade-ds/components/motion`.
 */
export const MotionWordReveal: Story = {
  args: {
    size: 'lg',
    children: 'Design tokens drive every animation, from timing to easing.',
  },
  render: ({ children, variant, size, weight, color }) => (
    <TextReveal {...{ variant, size, weight, color }} text={String(children)} by="word" />
  ),
};
