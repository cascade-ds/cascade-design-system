import type { Meta, StoryObj } from '@storybook/react-vite';
import { VisuallyHidden } from '@cds/components';

const meta = {
  title: 'CascadeDS/Components/Atom/VisuallyHidden',
  component: VisuallyHidden,
  tags: ['autodocs'],
  argTypes: {
    focusable: {
      control: 'boolean',
      description:
        'Reveals the content while it (or something inside it) has keyboard focus. Use for skip links.',
    },
    as: {
      control: 'text',
      description: 'Element to render. Defaults to `span`.',
    },
  },
  args: {
    children: 'Only screen readers announce this text',
    focusable: false,
  },
} satisfies Meta<typeof VisuallyHidden>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <p>
      The text next to this sentence is visually hidden:
      <VisuallyHidden {...args} />
    </p>
  ),
};

export const IconButtonLabel: Story = {
  args: {
    children: 'Close dialog',
  },
  render: (args) => (
    <button type="button">
      <span aria-hidden="true">×</span>
      <VisuallyHidden {...args} />
    </button>
  ),
};

export const SkipLink: Story = {
  args: {
    children: 'Skip to main content',
    focusable: true,
  },
  render: (args) => (
    <div>
      <VisuallyHidden {...args} as="a" href="#main" />
      <p>Press Tab to reveal the skip link above this text.</p>
      <main id="main">Main content</main>
    </div>
  ),
};
