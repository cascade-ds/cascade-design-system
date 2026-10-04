import type { Meta, StoryObj } from '@storybook/react-vite';
import { Accordion } from '@cds/components';

const meta = {
  title: 'CascadeDS/Components/Molecule/Accordion',
  component: Accordion.Root,
  tags: ['autodocs'],
  argTypes: {
    background: {
      control: 'select',
      options: ['default', 'subtle', 'surface', 'brand', 'secondary'],
      description:
        'Fill of the whole accordion. `default` is transparent with dividers; the others draw a filled, bordered, rounded block. `surface` is the page surface color, for use on a canvas.',
    },
    multiple: {
      control: 'boolean',
      description: 'Lets several items be open at once. Otherwise opening one closes the others.',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables every item.',
    },
    hiddenUntilFound: {
      control: 'boolean',
      description: "Lets the browser's find-in-page search closed panels and open the match.",
    },
  },
  args: {
    background: 'default',
    multiple: false,
    disabled: false,
    hiddenUntilFound: false,
    children: null,
  },
} satisfies Meta<typeof Accordion.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

const faqs = [
  {
    value: 'plans',
    question: 'Can I change plans later?',
    answer: 'Yes. Upgrades apply right away; downgrades apply at the end of the billing period.',
  },
  {
    value: 'seats',
    question: 'How are seats counted?',
    answer: 'Every member who signed in during the billing period counts as one seat.',
  },
  {
    value: 'export',
    question: 'Can I export my data?',
    answer: 'Any admin can export all projects as JSON from the workspace settings.',
  },
];

export const Default: Story = {
  render: (args) => (
    <Accordion.Root {...args}>
      {faqs.map((faq) => (
        <Accordion.Item key={faq.value} value={faq.value}>
          <Accordion.Trigger>{faq.question}</Accordion.Trigger>
          <Accordion.Panel>{faq.answer}</Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  ),
};

export const Backgrounds: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: '1.5rem' }}>
      {(['default', 'subtle', 'surface', 'brand', 'secondary'] as const).map((background) => (
        <Accordion.Root key={background} {...args} background={background}>
          {faqs.slice(0, 2).map((faq) => (
            <Accordion.Item key={faq.value} value={faq.value}>
              <Accordion.Trigger>{`${background}: ${faq.question}`}</Accordion.Trigger>
              <Accordion.Panel>{faq.answer}</Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      ))}
    </div>
  ),
  args: {
    defaultValue: ['plans'],
  },
};

export const OpenByDefault: Story = {
  ...Default,
  args: {
    defaultValue: ['seats'],
  },
};

export const Multiple: Story = {
  ...Default,
  args: {
    multiple: true,
    defaultValue: ['plans', 'seats'],
  },
};

export const DisabledItem: Story = {
  render: (args) => (
    <Accordion.Root {...args}>
      <Accordion.Item value="general">
        <Accordion.Trigger>General</Accordion.Trigger>
        <Accordion.Panel>Workspace name, URL and time zone.</Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item value="sso" disabled>
        <Accordion.Trigger>Single sign-on (Enterprise plan)</Accordion.Trigger>
        <Accordion.Panel>SAML and SCIM settings.</Accordion.Panel>
      </Accordion.Item>
    </Accordion.Root>
  ),
};
