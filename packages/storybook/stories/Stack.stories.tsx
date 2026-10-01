import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack } from '@cds/components';
import { layoutElements } from './foundations/layoutElements';

const items = ['One', 'Two', 'Three'].map((label) => <span key={label}>{label}</span>);

const meta = {
  title: 'CascadeDS/Components/Layout/Stack',
  component: Stack,
  tags: ['autodocs'],
  argTypes: {
    direction: {
      control: 'radio',
      options: ['column', 'row'],
      description: 'Main axis the children are laid out along.',
    },
    gap: {
      control: 'select',
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'],
      description: 'Space between children, from the `semantic.stack` scale.',
    },
    align: {
      control: 'select',
      options: ['start', 'center', 'end', 'stretch'],
      description: 'Alignment of children on the cross axis.',
    },
    justify: {
      control: 'select',
      options: ['start', 'center', 'end', 'between'],
      description: 'Distribution of children along the main axis.',
    },
    wrap: {
      control: 'boolean',
      description: 'Lets children wrap onto new lines when they overflow.',
    },
    grow: {
      control: 'boolean',
      description: 'Sets `flex: 1` so the Stack fills free space in a flex parent.',
    },
    as: {
      control: 'select',
      options: layoutElements,
      description: 'Structural element to render instead of a `div` (e.g. `ul`, `nav`).',
    },
  },
  args: {
    children: items,
    direction: 'column',
    gap: 'md',
    align: 'stretch',
    justify: 'start',
    wrap: false,
    grow: false,
  },
} satisfies Meta<typeof Stack>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Row: Story = {
  args: {
    direction: 'row',
    align: 'center',
  },
};

export const SpaceBetween: Story = {
  args: {
    direction: 'row',
    justify: 'between',
  },
};

export const Wrapping: Story = {
  args: {
    direction: 'row',
    wrap: true,
    children: Array.from({ length: 24 }, (_, index) => <span key={index}>Item {index + 1}</span>),
  },
};
