import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Text,
  Stack,
  ThemeProvider,
  DropdownMenu,
  type DropdownMenuContentProps,
} from '@cds/components';

const meta = {
  title: 'CascadeDS/Components/Molecule/DropdownMenu',
  component: DropdownMenu,
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
} satisfies Meta<typeof DropdownMenu>;

export default meta;

type Story = StoryObj<typeof meta>;

function ProjectMenu(props: {
  defaultOpen?: boolean;
  side?: DropdownMenuContentProps['side'];
  label?: string;
}) {
  const { defaultOpen, side, label = 'Actions' } = props;

  return (
    <DropdownMenu defaultOpen={defaultOpen}>
      <DropdownMenu.Trigger variant="secondary">{label}</DropdownMenu.Trigger>
      <DropdownMenu.Content side={side}>
        <DropdownMenu.Item>Rename</DropdownMenu.Item>
        <DropdownMenu.Item>Duplicate</DropdownMenu.Item>
        <DropdownMenu.Item disabled>Move to…</DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item variant="danger">Delete</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  );
}

export const Default: Story = {
  render: () => <ProjectMenu />,
};

export const Open: Story = {
  render: () => <ProjectMenu defaultOpen />,
};

export const Groups: Story = {
  render: () => (
    <DropdownMenu defaultOpen>
      <DropdownMenu.Trigger variant="secondary">View</DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Group>
          <DropdownMenu.GroupLabel>Sort by</DropdownMenu.GroupLabel>
          <DropdownMenu.Item>Name</DropdownMenu.Item>
          <DropdownMenu.Item>Date modified</DropdownMenu.Item>
        </DropdownMenu.Group>
        <DropdownMenu.Separator />
        <DropdownMenu.Group>
          <DropdownMenu.GroupLabel>Layout</DropdownMenu.GroupLabel>
          <DropdownMenu.Item>Grid</DropdownMenu.Item>
          <DropdownMenu.Item>List</DropdownMenu.Item>
        </DropdownMenu.Group>
      </DropdownMenu.Content>
    </DropdownMenu>
  ),
};

export const Sides: Story = {
  render: () => (
    <Stack direction="row" gap="md" wrap>
      <ProjectMenu side="top" label="Top" />
      <ProjectMenu side="right" label="Right" />
      <ProjectMenu side="bottom" label="Bottom" />
      <ProjectMenu side="left" label="Left" />
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
            <ProjectMenu defaultOpen />
          </Stack>
        </ThemeProvider>
      </Stack>
    </ThemeProvider>
  ),
};

export const Controlled: Story = {
  render: function ControlledMenu() {
    const [lastAction, setLastAction] = useState('none');

    return (
      <Stack gap="md" align="start">
        <Text>Last action: {lastAction}.</Text>
        <DropdownMenu>
          <DropdownMenu.Trigger>Actions</DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item onClick={() => setLastAction('rename')}>Rename</DropdownMenu.Item>
            <DropdownMenu.Item onClick={() => setLastAction('duplicate')}>
              Duplicate
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu>
      </Stack>
    );
  },
};
