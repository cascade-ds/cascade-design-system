import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import Text from '@/Atoms/Text/Text';
import Stack from '@/Layout/Stack/Stack';
import Tabs from '@/Molecules/Tabs/Tabs';

const meta = {
  title: 'CascadeDS/Components/Molecule/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'text',
      description: "The active tab's value when controlled. Pair with `onValueChange`.",
    },
    defaultValue: {
      control: 'text',
      description: 'The initially active tab when uncontrolled. Defaults to the first enabled tab.',
    },
  },
  args: {
    defaultValue: 'overview',
    children: null,
  },
} satisfies Meta<typeof Tabs>;

export default meta;

type Story = StoryObj<typeof meta>;

function ProjectTabs(props: { defaultValue?: string; disableSettings?: boolean }) {
  const { defaultValue, disableSettings } = props;

  return (
    <Tabs defaultValue={defaultValue}>
      <Tabs.List aria-label="Project">
        <Tabs.Tab value="overview">Overview</Tabs.Tab>
        <Tabs.Tab value="activity">Activity</Tabs.Tab>
        <Tabs.Tab value="settings" disabled={disableSettings}>
          Settings
        </Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="overview">
        <Text>A summary of the project and its current status.</Text>
      </Tabs.Panel>
      <Tabs.Panel value="activity">
        <Text>Recent commits, comments and deployments.</Text>
      </Tabs.Panel>
      <Tabs.Panel value="settings">
        <Text>Project name, visibility and members.</Text>
      </Tabs.Panel>
    </Tabs>
  );
}

export const Default: Story = {
  render: (args) => <ProjectTabs defaultValue={args.defaultValue as string | undefined} />,
};

export const DisabledTab: Story = {
  render: () => <ProjectTabs disableSettings />,
};

export const Controlled: Story = {
  render: function ControlledTabs() {
    const [value, setValue] = useState<string | number>('activity');

    return (
      <Stack gap="md">
        <Text>Active tab: {value}</Text>
        <Tabs value={value} onValueChange={setValue}>
          <Tabs.List aria-label="Account">
            <Tabs.Tab value="profile">Profile</Tabs.Tab>
            <Tabs.Tab value="activity">Activity</Tabs.Tab>
            <Tabs.Tab value="billing">Billing</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="profile">
            <Text>Your name and avatar.</Text>
          </Tabs.Panel>
          <Tabs.Panel value="activity">
            <Text>Where and when you signed in.</Text>
          </Tabs.Panel>
          <Tabs.Panel value="billing">
            <Text>Plan and invoices.</Text>
          </Tabs.Panel>
        </Tabs>
      </Stack>
    );
  },
};
