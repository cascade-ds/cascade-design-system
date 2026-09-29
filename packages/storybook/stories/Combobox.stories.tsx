import type { Meta, StoryObj } from '@storybook/react-vite';
import Stack from '@/Layout/Stack/Stack';
import FormField from '@/Molecules/FormField/FormField';
import Combobox from '@/Molecules/Combobox/Combobox';
import type { ComboboxInputProps, ComboboxProps } from '@/Molecules/Combobox/Combobox';

const meta = {
  title: 'CascadeDS/Components/Molecule/Combobox',
  component: Combobox,
  tags: ['autodocs'],
  parameters: {
    // Popups are portaled to <body>, outside the story root: check the whole
    // page so open popups are covered by the a11y tests too.
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
    autoHighlight: {
      control: 'boolean',
      description: 'Highlights the first match while typing, so Enter picks it.',
    },
  },
  args: {
    disabled: false,
    readOnly: false,
  },
} satisfies Meta<typeof Combobox>;

export default meta;

type Story = StoryObj<typeof meta>;

const timezones = [
  'America/New_York',
  'America/Sao_Paulo',
  'Asia/Kolkata',
  'Asia/Tokyo',
  'Australia/Sydney',
  'Europe/Berlin',
  'Europe/Lisbon',
  'Europe/London',
  'Pacific/Auckland',
  'UTC',
];

type StoryArgs = Pick<ComboboxProps<string>, 'disabled' | 'readOnly' | 'autoHighlight'>;

/** The story controls, without the generic props Storybook types as `unknown`. */
function controls(args: StoryArgs): StoryArgs {
  return { disabled: args.disabled, readOnly: args.readOnly, autoHighlight: args.autoHighlight };
}

function TimezoneCombobox(
  props: StoryArgs & {
    defaultValue?: string;
    defaultOpen?: boolean;
    size?: ComboboxInputProps['size'];
  },
) {
  const { size, ...comboboxProps } = props;

  return (
    <FormField>
      <FormField.Label>Time zone</FormField.Label>
      <Combobox items={timezones} {...comboboxProps}>
        <Combobox.Input size={size} placeholder="Search time zones" />
        <Combobox.Content emptyMessage="No time zones found.">
          {(timezone: string) => (
            <Combobox.Item key={timezone} value={timezone}>
              {timezone}
            </Combobox.Item>
          )}
        </Combobox.Content>
      </Combobox>
    </FormField>
  );
}

export const Default: Story = {
  render: (args) => <TimezoneCombobox {...controls(args)} />,
};

export const Open: Story = {
  render: (args) => (
    <TimezoneCombobox {...controls(args)} defaultValue="Europe/Lisbon" defaultOpen />
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <Stack gap="lg">
      <TimezoneCombobox {...controls(args)} size="sm" />
      <TimezoneCombobox {...controls(args)} size="md" />
      <TimezoneCombobox {...controls(args)} size="lg" />
    </Stack>
  ),
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
  render: (args) => <TimezoneCombobox {...controls(args)} defaultValue="UTC" />,
};

const regions = [
  { value: 'Americas', items: ['New York', 'São Paulo', 'Toronto'] },
  { value: 'Europe', items: ['Berlin', 'Lisbon', 'London'] },
];

/**
 * Grouped `items` render a `Combobox.Group` per group. `Combobox.Collection`
 * renders the group's options that match what was typed.
 */
export const Groups: Story = {
  render: (args) => (
    <FormField>
      <FormField.Label>Office</FormField.Label>
      <Combobox {...controls(args)} items={regions} defaultOpen>
        <Combobox.Input placeholder="Search offices" />
        <Combobox.Content emptyMessage="No offices found.">
          {(group: (typeof regions)[number]) => (
            <Combobox.Group key={group.value} items={group.items}>
              <Combobox.GroupLabel>{group.value}</Combobox.GroupLabel>
              <Combobox.Collection>
                {(office: string) => (
                  <Combobox.Item key={office} value={office}>
                    {office}
                  </Combobox.Item>
                )}
              </Combobox.Collection>
            </Combobox.Group>
          )}
        </Combobox.Content>
      </Combobox>
    </FormField>
  ),
};

export const Invalid: Story = {
  render: (args) => (
    <FormField>
      <FormField.Label>Time zone</FormField.Label>
      <Combobox {...controls(args)} items={timezones}>
        <Combobox.Input placeholder="Search time zones" />
        <Combobox.Content emptyMessage="No time zones found.">
          {(timezone: string) => (
            <Combobox.Item key={timezone} value={timezone}>
              {timezone}
            </Combobox.Item>
          )}
        </Combobox.Content>
      </Combobox>
      <FormField.Error>Choose a time zone.</FormField.Error>
    </FormField>
  ),
};
