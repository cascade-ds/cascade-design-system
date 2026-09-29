import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack, Tag } from '@cds/components';

const tones = ['neutral', 'primary', 'secondary', 'success', 'warning', 'danger', 'info'] as const;

const meta = {
  title: 'CascadeDS/Components/Atom/Tag',
  component: Tag,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'radio',
      options: ['sm', 'md'],
      description: '`sm` for dense contexts such as table cells, `md` everywhere else.',
    },
    tone: {
      control: 'radio',
      options: tones,
      description: 'Same tones as Badge: `neutral`, brand (`primary`, `secondary`) and status.',
    },
    onRemove: {
      description:
        'When set, renders an accessible remove button (named "Remove {label}") that calls this handler.',
    },
    removeLabel: {
      control: 'text',
      description: 'Overrides the remove button accessible name.',
    },
  },
  args: {
    children: 'Design',
    tone: 'neutral',
    size: 'md',
  },
} satisfies Meta<typeof Tag>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Small: Story = {
  args: {
    size: 'sm',
    onRemove: () => {},
  },
};

export const Primary: Story = {
  args: {
    tone: 'primary',
  },
};

export const Removable: Story = {
  args: {
    onRemove: () => {},
  },
};

export const AllTones: Story = {
  render: (args) => (
    <Stack direction="row" gap="sm" wrap>
      {tones.map((tone) => (
        <Tag key={tone} {...args} tone={tone}>
          {tone}
        </Tag>
      ))}
    </Stack>
  ),
};

function FilterList() {
  const [filters, setFilters] = useState(['Design', 'Engineering', 'Marketing']);

  return (
    <Stack direction="row" gap="sm" wrap>
      {filters.map((filter) => (
        <Tag
          key={filter}
          tone="primary"
          onRemove={() => setFilters((current) => current.filter((item) => item !== filter))}
        >
          {filter}
        </Tag>
      ))}
    </Stack>
  );
}

export const RemovableFilters: Story = {
  render: () => <FilterList />,
};
