import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Cross2Icon, MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { Label, Stack, Input } from '@cds/components';

const meta = {
  title: 'CascadeDS/Components/Atom/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
      description: 'Controls the minimum height, inline padding and typography.',
    },
    disabled: {
      control: 'boolean',
    },
    readOnly: {
      control: 'boolean',
      description: 'Value can be selected and copied but not edited.',
    },
    'aria-invalid': {
      control: 'boolean',
      description: 'Marks the value as invalid and applies the invalid border.',
    },
    start: {
      control: false,
      description: 'Content before the text, sized as an icon (e.g. a search icon).',
    },
    end: {
      control: false,
      description: 'Content after the text, sized as an icon (e.g. a clear button).',
    },
  },
  args: {
    'aria-label': 'Name',
    placeholder: 'Ada Lovelace',
    size: 'md',
    disabled: false,
    readOnly: false,
  },
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <Stack gap="md">
      <Input {...args} size="sm" aria-label="Small" placeholder="Small" />
      <Input {...args} size="md" aria-label="Medium" placeholder="Medium" />
      <Input {...args} size="lg" aria-label="Large" placeholder="Large" />
    </Stack>
  ),
};

export const WithLabel: Story = {
  args: {
    'aria-label': undefined,
    id: 'input-name',
  },
  render: (args) => (
    <Stack gap="xs">
      <Label htmlFor={args.id}>Name</Label>
      <Input {...args} />
    </Stack>
  ),
};

/** A search field: an icon in the start slot. Clicking the icon focuses the input. */
export const WithStartIcon: Story = {
  args: {
    type: 'search',
    'aria-label': 'Search',
    placeholder: 'Search projects',
    start: <MagnifyingGlassIcon />,
  },
};

function ClearableInput(props: React.ComponentProps<typeof Input>) {
  const [value, setValue] = useState('Cascade');

  return (
    <Input
      {...props}
      value={value}
      onChange={(event) => setValue(event.target.value)}
      start={<MagnifyingGlassIcon />}
      end={
        value ? (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => setValue('')}
            style={{ display: 'flex', padding: 0, border: 0, background: 'none', color: 'inherit' }}
          >
            <Cross2Icon />
          </button>
        ) : null
      }
    />
  );
}

/** A button in the end slot stays clickable. */
export const WithClearButton: Story = {
  args: {
    type: 'search',
    'aria-label': 'Search',
  },
  render: (args) => <ClearableInput {...args} />,
};

export const Invalid: Story = {
  args: {
    'aria-invalid': true,
    defaultValue: 'not-an-email',
  },
};

export const ReadOnly: Story = {
  args: {
    readOnly: true,
    defaultValue: 'This value cannot be edited.',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    start: <MagnifyingGlassIcon />,
  },
};
