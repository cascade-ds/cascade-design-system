import type { Meta, StoryObj } from '@storybook/react-vite';
import { Text, Kbd } from '@cds/components';

const meta = {
  title: 'CascadeDS/Components/Atom/Kbd',
  component: Kbd,
  tags: ['autodocs'],
  args: {
    children: 'Esc',
  },
} satisfies Meta<typeof Kbd>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Shortcut: Story = {
  render: () => (
    <Text>
      Press{' '}
      <Kbd title="Command" aria-label="Command">
        ⌘
      </Kbd>{' '}
      <Kbd>K</Kbd> to open the command menu.
    </Text>
  ),
};

export const InText: Story = {
  render: () => (
    <Text>
      Press <Kbd>Esc</Kbd> to close the dialog, or <Kbd>Shift</Kbd> + <Kbd>Tab</Kbd> to move back.
    </Text>
  ),
};
