import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Stack,
  FormField,
  Combobox,
  type ComboboxInputProps,
  type ComboboxProps,
} from '@cds/components';

const meta = {
  title: 'CascadeDS/Components/Molecule/Combobox',
  component: Combobox.Root,
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
    autoHighlight: {
      control: 'boolean',
      description: 'Highlights the first match while typing, so Enter picks it.',
    },
  },
  args: {
    disabled: false,
    readOnly: false,
  },
} satisfies Meta<typeof Combobox.Root>;

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
    <FormField.Root>
      <FormField.Label>Time zone</FormField.Label>
      <Combobox.Root items={timezones} {...comboboxProps}>
        <Combobox.Input size={size} placeholder="Search time zones" />
        <Combobox.Content emptyMessage="No time zones found.">
          {(timezone: string) => (
            <Combobox.Item key={timezone} value={timezone}>
              {timezone}
            </Combobox.Item>
          )}
        </Combobox.Content>
      </Combobox.Root>
    </FormField.Root>
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

export const Groups: Story = {
  render: (args) => (
    <FormField.Root>
      <FormField.Label>Office</FormField.Label>
      <Combobox.Root {...controls(args)} items={regions} defaultOpen>
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
      </Combobox.Root>
    </FormField.Root>
  ),
};

export const Invalid: Story = {
  render: (args) => (
    <FormField.Root>
      <FormField.Label>Time zone</FormField.Label>
      <Combobox.Root {...controls(args)} items={timezones}>
        <Combobox.Input placeholder="Search time zones" />
        <Combobox.Content emptyMessage="No time zones found.">
          {(timezone: string) => (
            <Combobox.Item key={timezone} value={timezone}>
              {timezone}
            </Combobox.Item>
          )}
        </Combobox.Content>
      </Combobox.Root>
      <FormField.Error>Choose a time zone.</FormField.Error>
    </FormField.Root>
  ),
};
