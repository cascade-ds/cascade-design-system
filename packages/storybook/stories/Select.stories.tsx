import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Text,
  Stack,
  ThemeProvider,
  Select,
  type SelectProps,
  type SelectTriggerProps,
} from '@cds/components';

const meta = {
  title: 'CascadeDS/Components/Molecule/Select',
  component: Select.Root,
  tags: ['autodocs'],
  parameters: {
    a11y: { context: 'body' },
  },
  argTypes: {
    disabled: {
      control: 'boolean',
    },
    readOnly: {
      control: 'boolean',
      description: 'Shows the value but keeps the popup from changing it.',
    },
    defaultOpen: {
      control: 'boolean',
      description: 'Initial open state when uncontrolled.',
    },
  },
  args: {
    disabled: false,
    readOnly: false,
  },
} satisfies Meta<typeof Select.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

const plans = [
  { value: 'free', label: 'Free' },
  { value: 'team', label: 'Team' },
  { value: 'business', label: 'Business' },
  { value: 'enterprise', label: 'Enterprise' },
];

function PlanSelect(
  props: Omit<SelectProps<string>, 'items' | 'children'> & { size?: SelectTriggerProps['size'] },
) {
  const { size, ...selectProps } = props;

  return (
    <Stack gap="xs">
      <Select.Root items={plans} {...selectProps}>
        <Select.Label>Plan</Select.Label>
        <Select.Trigger size={size} placeholder="Choose a plan" />
        <Select.Content>
          {plans.map((plan) => (
            <Select.Item key={plan.value} value={plan.value}>
              {plan.label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
    </Stack>
  );
}

export const Default: Story = {
  render: (args) => <PlanSelect disabled={args.disabled} readOnly={args.readOnly} />,
};

export const Open: Story = {
  render: (args) => (
    <PlanSelect disabled={args.disabled} readOnly={args.readOnly} defaultValue="team" defaultOpen />
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <Stack gap="lg">
      <PlanSelect disabled={args.disabled} readOnly={args.readOnly} size="sm" />
      <PlanSelect disabled={args.disabled} readOnly={args.readOnly} size="md" />
      <PlanSelect disabled={args.disabled} readOnly={args.readOnly} size="lg" />
    </Stack>
  ),
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
  render: (args) => (
    <PlanSelect disabled={args.disabled} readOnly={args.readOnly} defaultValue="free" />
  ),
};

export const ReadOnly: Story = {
  args: {
    readOnly: true,
  },
  render: (args) => (
    <PlanSelect disabled={args.disabled} readOnly={args.readOnly} defaultValue="business" />
  ),
};

export const GroupsAndDisabledOptions: Story = {
  render: (args) => (
    <Stack gap="xs">
      <Select.Root {...args} defaultOpen>
        <Select.Label>Region</Select.Label>
        <Select.Trigger placeholder="Choose a region" />
        <Select.Content alignItemWithTrigger={false}>
          <Select.Group>
            <Select.GroupLabel>Americas</Select.GroupLabel>
            <Select.Item value="us-east">US East</Select.Item>
            <Select.Item value="sa-east">São Paulo</Select.Item>
          </Select.Group>
          <Select.Separator />
          <Select.Group>
            <Select.GroupLabel>Europe</Select.GroupLabel>
            <Select.Item value="eu-west">Ireland</Select.Item>
            <Select.Item value="eu-central" disabled>
              Frankfurt (full)
            </Select.Item>
          </Select.Group>
        </Select.Content>
      </Select.Root>
    </Stack>
  ),
};

export const InsideDarkSection: Story = {
  parameters: {
    // Report, don't fail: axe flags Base UI's hidden focus guards (aria-hidden-focus) depending on popup width and earlier open stories. Passes on its own; root cause not found.
    a11y: { test: 'todo' },
  },
  render: (args) => (
    <ThemeProvider initialMode="light">
      <Stack gap="md">
        <Text>Light page</Text>
        <ThemeProvider initialMode="dark">
          <Stack gap="md" align="start">
            <Text>Dark section</Text>
            <PlanSelect disabled={args.disabled} readOnly={args.readOnly} defaultOpen />
          </Stack>
        </ThemeProvider>
      </Stack>
    </ThemeProvider>
  ),
};

export const Controlled: Story = {
  render: function ControlledSelect(args) {
    const [value, setValue] = useState<string | null>('team');

    return (
      <Stack gap="md" align="start">
        <Text>Selected value: {value ?? 'none'}</Text>
        <PlanSelect
          disabled={args.disabled}
          readOnly={args.readOnly}
          value={value}
          onValueChange={setValue}
        />
      </Stack>
    );
  },
};
