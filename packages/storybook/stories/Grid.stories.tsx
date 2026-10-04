import type { Meta, StoryObj } from '@storybook/react-vite';
import { Grid } from '@cds/components';
import { layoutElements } from './foundations/layoutElements';

const cells = (count: number) =>
  Array.from({ length: count }, (_, index) => <span key={index}>Cell {index + 1}</span>);

const meta = {
  title: 'CascadeDS/Components/Layout/Grid',
  component: Grid,
  tags: ['autodocs'],
  argTypes: {
    columns: {
      control: 'select',
      options: [1, 2, 3, 4, 6, 12, 'auto'],
      description:
        'Number of equal-width columns. `12` follows the `semantic.layout.columns` token. `auto` fits as many columns of `minChildWidth` as the width allows.',
    },
    gap: {
      control: 'select',
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl', 'gutter'],
      description:
        'Space between rows and columns. `gutter` follows the `semantic.layout.gutter` token.',
    },
    align: {
      control: 'select',
      options: ['start', 'center', 'end', 'stretch'],
      description: 'Vertical alignment of cells within their row.',
    },
    justify: {
      control: 'select',
      options: ['start', 'center', 'end', 'stretch'],
      description: 'Horizontal alignment of items within their cell.',
    },
    padding: {
      control: 'select',
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Padding around the grid, from the `semantic.padding` scale.',
    },
    minChildWidth: {
      control: 'text',
      description: 'Minimum column width when `columns` is `auto`. Any CSS length.',
    },
    as: {
      control: 'select',
      options: layoutElements,
      description: 'Structural element to render instead of a `div` (e.g. `ul`, `section`).',
    },
  },
  args: {
    children: cells(12),
    columns: 12,
    gap: 'gutter',
    align: 'stretch',
    justify: 'stretch',
    padding: 'none',
  },
} satisfies Meta<typeof Grid>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const TwoColumns: Story = {
  args: {
    columns: 2,
    children: cells(4),
  },
};

export const ThreeColumns: Story = {
  args: {
    columns: 3,
    children: cells(6),
  },
};

export const FourColumns: Story = {
  args: {
    columns: 4,
    gap: 'lg',
    children: cells(8),
  },
};

export const AutoFit: Story = {
  args: {
    columns: 'auto',
    minChildWidth: '12rem',
    gap: 'md',
    children: cells(7),
  },
};
