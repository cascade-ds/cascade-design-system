import type { Meta, StoryObj } from '@storybook/react-vite';
import Heading from '@/Atoms/Heading/Heading';

const meta = {
  title: 'CascadeDS/Components/Atom/Heading',
  component: Heading,
  tags: ['autodocs'],
  argTypes: {
    level: {
      control: 'radio',
      options: [1, 2, 3, 4, 5, 6],
      description:
        'Semantic heading level; renders the matching `h1`–`h6`. Pick it from the document outline, not from how big it should look.',
    },
    size: {
      control: 'radio',
      options: ['display', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
      description: 'Visual scale, independent of `level`. Leave unset to match the level.',
    },
    color: {
      control: 'radio',
      options: ['primary', 'secondary', 'brand', 'inverse'],
      description: 'Text color. Use `inverse` only on inverse backgrounds.',
    },
  },
  args: {
    children: 'Quarterly revenue overview',
    level: 2,
    color: 'primary',
  },
} satisfies Meta<typeof Heading>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Level1: Story = {
  args: {
    level: 1,
  },
};

export const Level4: Story = {
  args: {
    level: 4,
  },
};

export const Display: Story = {
  args: {
    level: 1,
    size: 'display',
  },
};

export const SizeDiffersFromLevel: Story = {
  args: {
    level: 2,
    size: 'h4',
    children: 'An h2 that looks like an h4',
  },
};

export const Brand: Story = {
  args: {
    color: 'brand',
  },
};
