import type { Meta, StoryObj } from '@storybook/react-vite';
import Spinner from '#/Atoms/Spinner/Spinner';

const meta = {
  title: 'CascadeDS/Components/Atom/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
      description: 'Matches the `sm` / `md` / `lg` icon sizes so it sits alongside text and icons.',
    },
    label: {
      control: 'text',
      description: 'Accessible name announced to assistive technology. Defaults to "Loading".',
    },
  },
  args: {
    size: 'md',
    label: 'Loading',
  },
} satisfies Meta<typeof Spinner>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Small: Story = {
  args: {
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
  },
};

export const CustomLabel: Story = {
  args: {
    label: 'Loading results',
  },
};
