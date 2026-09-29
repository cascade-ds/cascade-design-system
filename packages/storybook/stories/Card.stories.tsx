import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Text, Grid, Card } from '@cds/components';

const meta = {
  title: 'CascadeDS/Components/Molecule/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    as: {
      control: 'select',
      options: ['div', 'article', 'section', 'li'],
      description:
        'Element to render: `article` for self-contained content, `section` for a titled region, `li` inside a list of cards.',
    },
    interactive: {
      control: 'boolean',
      description:
        'Lifts the card on hover and while it holds focus. Use it when the card holds one primary link or button.',
    },
  },
  args: {
    as: 'div',
    interactive: false,
  },
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Card {...args}>
      <Card.Header>
        <Card.Title>Monthly revenue</Card.Title>
        <Card.Subtitle>Last 30 days, all regions</Card.Subtitle>
      </Card.Header>
      <Card.Body>
        <Text>Revenue grew 12% over the previous period, led by subscription renewals.</Text>
      </Card.Body>
      <Card.Footer>
        <Button variant="ghost" size="sm">
          Export
        </Button>
        <Button size="sm">View report</Button>
      </Card.Footer>
    </Card>
  ),
};

export const BodyOnly: Story = {
  render: (args) => (
    <Card {...args}>
      <Text>A card needs no header or footer.</Text>
    </Card>
  ),
};

export const Interactive: Story = {
  args: {
    as: 'article',
    interactive: true,
  },
  render: (args) => (
    <Card {...args}>
      <Card.Header>
        <Card.Title>Onboarding checklist</Card.Title>
        <Card.Subtitle>4 of 6 steps done</Card.Subtitle>
      </Card.Header>
      <Card.Footer>
        <Button variant="link" size="sm">
          Continue setup
        </Button>
      </Card.Footer>
    </Card>
  ),
};

export const InAGrid: Story = {
  render: () => (
    <Grid as="ul" columns={3} gap="md" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
      {['Active users', 'Sessions', 'Conversion'].map((title) => (
        <Card key={title} as="li">
          <Card.Header>
            <Card.Title>{title}</Card.Title>
            <Card.Subtitle>This week</Card.Subtitle>
          </Card.Header>
        </Card>
      ))}
    </Grid>
  ),
};
