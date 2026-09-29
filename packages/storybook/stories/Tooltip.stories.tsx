import type { Meta, StoryObj } from '@storybook/react-vite';
import Text from '@/Atoms/Text/Text';
import Stack from '@/Layout/Stack/Stack';
import { ThemeProvider } from '@/ThemeProvider';
import Tooltip from '@/Molecules/Tooltip/Tooltip';
import type { TooltipContentProps } from '@/Molecules/Tooltip/Tooltip';

const meta = {
  title: 'CascadeDS/Components/Molecule/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  parameters: {
    // Tooltips are portaled to <body>, outside the story root: check the
    // whole page so open tooltips are covered by the a11y tests too.
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
} satisfies Meta<typeof Tooltip>;

export default meta;

type Story = StoryObj<typeof meta>;

function SaveTooltip(props: {
  defaultOpen?: boolean;
  side?: TooltipContentProps['side'];
  label?: string;
}) {
  const { defaultOpen, side, label = 'Save' } = props;

  return (
    <Tooltip defaultOpen={defaultOpen}>
      <Tooltip.Trigger variant="secondary">{label}</Tooltip.Trigger>
      <Tooltip.Content side={side}>Save changes (Ctrl+S)</Tooltip.Content>
    </Tooltip>
  );
}

export const Default: Story = {
  render: () => <SaveTooltip />,
};

export const Open: Story = {
  render: () => <SaveTooltip defaultOpen />,
};

/** `side` picks where the tooltip goes; it flips when there isn't room. */
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

/**
 * Inside a `Tooltip.Provider`, once one tooltip is open, moving to a
 * neighbour opens its tooltip instantly.
 */
export const Group: Story = {
  render: () => (
    <Tooltip.Provider>
      <Stack direction="row" gap="sm">
        {['Bold', 'Italic', 'Underline'].map((label) => (
          <Tooltip key={label}>
            <Tooltip.Trigger variant="ghost">{label}</Tooltip.Trigger>
            <Tooltip.Content>{`Format as ${label.toLowerCase()}`}</Tooltip.Content>
          </Tooltip>
        ))}
      </Stack>
    </Tooltip.Provider>
  ),
};

/**
 * The tooltip is portaled to `<body>`, yet keeps the theme of the subtree it
 * was opened from: a dark section on a light page opens a dark tooltip
 * (ADR-006).
 */
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
