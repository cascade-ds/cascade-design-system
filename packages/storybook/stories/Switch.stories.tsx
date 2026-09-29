import { CheckIcon, MoonIcon, SunIcon } from '@radix-ui/react-icons';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Switch } from '@cds/components';

const meta = {
  title: 'CascadeDS/Components/Atom/Switch',
  component: Switch,
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: 'text',
      description:
        'Inline label text, plus optional `Switch.IconOn` / `Switch.IconOff` shown inside the thumb (no icon by default). Without label text, name the switch with `aria-label` or an external `<label htmlFor>`.',
    },
    disabled: {
      control: 'boolean',
    },
  },
  args: {
    children: 'Email notifications',
    disabled: false,
  },
} satisfies Meta<typeof Switch>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const On: Story = {
  args: {
    defaultChecked: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const DisabledOn: Story = {
  args: {
    disabled: true,
    defaultChecked: true,
  },
};

export const WithIcons: Story = {
  args: {
    'aria-label': 'Dark mode',
    children: (
      <>
        <Switch.IconOn>
          <MoonIcon />
        </Switch.IconOn>
        <Switch.IconOff>
          <SunIcon />
        </Switch.IconOff>
      </>
    ),
  },
};

export const WithOnIconOnly: Story = {
  args: {
    defaultChecked: true,
    children: (
      <>
        <Switch.IconOn>
          <CheckIcon />
        </Switch.IconOn>
        Email notifications
      </>
    ),
  },
};

export const WithoutVisibleLabel: Story = {
  args: {
    children: undefined,
    'aria-label': 'Dark mode',
  },
};
