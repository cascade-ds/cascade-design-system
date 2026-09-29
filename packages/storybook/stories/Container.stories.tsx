import type { Meta, StoryObj } from '@storybook/react-vite';
import { Container } from '@cds/components';
import { layoutElements } from './foundations/layoutElements';

const meta = {
  title: 'CascadeDS/Components/Layout/Container',
  component: Container,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg', 'xl'],
      description:
        'Maximum content width, from `semantic.layout.container`. Page gutters follow `semantic.layout.gutter`.',
    },
    as: {
      control: 'select',
      options: layoutElements,
      description: 'Structural element to render instead of a `div` (e.g. `main`, `section`).',
    },
  },
  args: {
    size: 'xl',
    children:
      'Container content is centred, capped at the chosen max width and inset from the viewport edges by the page gutter.',
  },
} satisfies Meta<typeof Container>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Small: Story = {
  args: {
    size: 'sm',
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
  },
};
