import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Text, Grid, Card } from '@cds/components';

const meta = {
  title: 'CascadeDS/Components/Molecule/Card',
  component: Card.Root,
  tags: ['autodocs'],
  argTypes: {
    as: {
      control: 'select',
      options: ['div', 'article', 'section', 'li'],
      description:
        'Element to render: `article` for self-contained content, `section` for a titled region, `li` inside a list of cards.',
    },
    background: {
      control: 'select',
      options: [
        'default',
        'subtle',
        'brand',
        'secondary',
        'tertiary',
        'accent',
        'success',
        'info',
        'danger',
      ],
      description:
        'Fill of the card. Each variant also sets its own border, and the border an interactive card shows on hover. `default` is the page surface; the others tint the card to a brand or feedback color.',
    },
    interactive: {
      control: 'boolean',
      description:
        'Lifts the card on hover and while it holds focus. Use it when the card holds one primary link or button.',
    },
    hover: {
      control: 'boolean',
      description:
        'Pointer hover lift and border change of an `interactive` card. Set `false` to remove it; the focus lift stays. No effect on a card that is not `interactive`.',
    },
  },
  args: {
    as: 'div',
    background: 'default',
    interactive: false,
    hover: true,
  },
} satisfies Meta<typeof Card.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Card.Root {...args}>
      <Card.Header>
        <Card.Title>Monthly revenue</Card.Title>
        <Card.Subtitle>Last 30 days, all regions</Card.Subtitle>
      </Card.Header>
      <Card.Body>
        <Text>Revenue grew 12% over the previous period, led by subscription renewals.</Text>
      </Card.Body>
      <Card.Footer>
        <Button.Root variant="ghost" size="sm">
          Export
        </Button.Root>
        <Button.Root size="sm">View report</Button.Root>
      </Card.Footer>
    </Card.Root>
  ),
};

export const Backgrounds: Story = {
  render: (args) => (
    <Grid columns={3} gap="lg">
      {(
        [
          'default',
          'subtle',
          'brand',
          'secondary',
          'tertiary',
          'accent',
          'success',
          'info',
          'danger',
        ] as const
      ).map((background) => (
        <Card.Root key={background} {...args} background={background}>
          <Card.Header>
            <Card.Title>{background}</Card.Title>
            <Card.Subtitle>Fill and border change together</Card.Subtitle>
          </Card.Header>
        </Card.Root>
      ))}
    </Grid>
  ),
};

export const BodyOnly: Story = {
  render: (args) => (
    <Card.Root {...args}>
      <Text>A card needs no header or footer.</Text>
    </Card.Root>
  ),
};

export const Interactive: Story = {
  args: {
    as: 'article',
    interactive: true,
  },
  render: (args) => (
    <Card.Root {...args}>
      <Card.Header>
        <Card.Title>Onboarding checklist</Card.Title>
        <Card.Subtitle>4 of 6 steps done</Card.Subtitle>
      </Card.Header>
      <Card.Footer>
        <Button.Root variant="link" size="sm">
          Continue setup
        </Button.Root>
      </Card.Footer>
    </Card.Root>
  ),
};

export const InAGrid: Story = {
  render: () => (
    <Grid as="ul" columns={3} gap="md" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
      {['Active users', 'Sessions', 'Conversion'].map((title) => (
        <Card.Root key={title} as="li">
          <Card.Header>
            <Card.Title>{title}</Card.Title>
            <Card.Subtitle>This week</Card.Subtitle>
          </Card.Header>
        </Card.Root>
      ))}
    </Grid>
  ),
};
