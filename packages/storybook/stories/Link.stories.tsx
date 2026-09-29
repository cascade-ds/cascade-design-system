import type { Meta, StoryObj } from '@storybook/react-vite';
import Text from '#/Atoms/Text/Text';
import Link from '#/Atoms/Link/Link';

const meta = {
  title: 'CascadeDS/Components/Atom/Link',
  component: Link,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'radio',
      options: ['inline', 'standalone'],
      description:
        '`inline` is always underlined, for links inside running text. `standalone` underlines on hover and focus, for links on their own line.',
    },
    external: {
      control: 'boolean',
      description: 'Opens in a new tab, shows an arrow and tells screen reader users.',
    },
    as: {
      control: false,
      description: "Element or component to render, e.g. your router's link.",
    },
  },
  args: {
    href: '#pricing',
    children: 'See pricing',
    variant: 'inline',
    external: false,
  },
} satisfies Meta<typeof Link>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Typography comes from the surrounding text, so the link matches it. */
export const InText: Story = {
  render: (args) => (
    <Text>
      Cascade is free for small teams. <Link {...args} /> to compare the paid plans.
    </Text>
  ),
};

export const Standalone: Story = {
  args: {
    variant: 'standalone',
    children: 'Forgot your password?',
  },
};

export const External: Story = {
  args: {
    href: 'https://base-ui.com',
    external: true,
    children: 'Base UI docs',
  },
};
