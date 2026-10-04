import type { Meta, StoryObj } from '@storybook/react-vite';
import { Text, Stack, ThemeProvider, Tooltip, type TooltipContentProps } from '@cds/components';

const meta = {
  title: 'CascadeDS/Components/Molecule/Tooltip',
  component: Tooltip.Root,
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
    disabled: {
      control: 'boolean',
      description: 'Stops the tooltip from opening.',
    },
  },
  args: {
    children: null,
  },
} satisfies Meta<typeof Tooltip.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

function SaveTooltip(props: {
  defaultOpen?: boolean;
  side?: TooltipContentProps['side'];
  label?: string;
}) {
  const { defaultOpen, side, label = 'Save' } = props;

  return (
    <Tooltip.Root defaultOpen={defaultOpen}>
      <Tooltip.Trigger variant="secondary">{label}</Tooltip.Trigger>
      <Tooltip.Content side={side}>Save changes (Ctrl+S)</Tooltip.Content>
    </Tooltip.Root>
  );
}

export const Default: Story = {
  render: () => <SaveTooltip />,
};

export const Open: Story = {
  render: () => <SaveTooltip defaultOpen />,
};

export const Sides: Story = {
  render: () => (
    <Stack direction="row" gap="md" wrap>
      <SaveTooltip side="top" label="Top" />
      <SaveTooltip side="right" label="Right" />
      <SaveTooltip side="bottom" label="Bottom" />
      <SaveTooltip side="left" label="Left" />
    </Stack>
  ),
};

export const Group: Story = {
  render: () => (
    <Tooltip.Provider>
      <Stack direction="row" gap="sm">
        {['Bold', 'Italic', 'Underline'].map((label) => (
          <Tooltip.Root key={label}>
            <Tooltip.Trigger variant="ghost">{label}</Tooltip.Trigger>
            <Tooltip.Content>{`Format as ${label.toLowerCase()}`}</Tooltip.Content>
          </Tooltip.Root>
        ))}
      </Stack>
    </Tooltip.Provider>
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
            <SaveTooltip defaultOpen side="right" />
          </Stack>
        </ThemeProvider>
      </Stack>
    </ThemeProvider>
  ),
};
