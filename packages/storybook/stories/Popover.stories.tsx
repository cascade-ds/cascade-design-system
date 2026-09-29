import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Text, Stack, ThemeProvider, Popover, type PopoverContentProps } from '@cds/components';

const meta = {
  title: 'CascadeDS/Components/Molecule/Popover',
  component: Popover,
  tags: ['autodocs'],
  parameters: {
    a11y: { context: 'body' },
  },
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Controlled open state. Pair with `onOpenChange`.',
    },
    defaultOpen: {
      control: 'boolean',
      description: 'Initial open state when uncontrolled.',
    },
  },
  args: {
    children: null,
  },
} satisfies Meta<typeof Popover>;

export default meta;

type Story = StoryObj<typeof meta>;

function FiltersPopover(props: {
  defaultOpen?: boolean;
  side?: PopoverContentProps['side'];
  label?: string;
}) {
  const { defaultOpen, side, label = 'Filters' } = props;

  return (
    <Popover defaultOpen={defaultOpen}>
      <Popover.Trigger variant="secondary">{label}</Popover.Trigger>
      <Popover.Content side={side}>
        <Popover.Title>Filter results</Popover.Title>
        <Popover.Description>Narrow the table to the statuses you care about.</Popover.Description>
        <Popover.Close variant="ghost" size="sm">
          Done
        </Popover.Close>
      </Popover.Content>
    </Popover>
  );
}

export const Default: Story = {
  render: () => <FiltersPopover />,
};

export const Open: Story = {
  render: () => <FiltersPopover defaultOpen />,
};

export const Sides: Story = {
  render: () => (
    <Stack direction="row" gap="md" wrap>
      <FiltersPopover side="top" label="Top" />
      <FiltersPopover side="right" label="Right" />
      <FiltersPopover side="bottom" label="Bottom" />
      <FiltersPopover side="left" label="Left" />
    </Stack>
  ),
};

export const InsideDarkSection: Story = {
  render: () => (
    <ThemeProvider initialMode="light">
      <Stack gap="md">
        <Text>Light page</Text>
        <ThemeProvider initialMode="dark">
          <Stack gap="md" align="start">
            <Text>Dark section</Text>
            <FiltersPopover defaultOpen />
          </Stack>
        </ThemeProvider>
      </Stack>
    </ThemeProvider>
  ),
};

export const Controlled: Story = {
  render: function ControlledPopover() {
    const [open, setOpen] = useState(false);

    return (
      <Stack gap="md" align="start">
        <Text>The popover is {open ? 'open' : 'closed'}.</Text>
        <Popover open={open} onOpenChange={setOpen}>
          <Popover.Trigger>Settings</Popover.Trigger>
          <Popover.Content>
            <Popover.Title>Settings</Popover.Title>
            <Popover.Description>Controlled from the story state.</Popover.Description>
            <Popover.Close variant="ghost" size="sm">
              Close
            </Popover.Close>
          </Popover.Content>
        </Popover>
      </Stack>
    );
  },
};
