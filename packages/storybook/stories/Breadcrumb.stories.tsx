import type { Meta, StoryObj } from '@storybook/react-vite';
import { Breadcrumb } from '@cds/components';

const meta = {
  title: 'CascadeDS/Components/Molecule/Breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: 'select',
      options: [
        'neutral',
        'primary',
        'secondary',
        'tertiary',
        'accent',
        'success',
        'info',
        'danger',
      ],
      description:
        'Text color of the trail. `neutral` is the default; the others are AA on the page surfaces.',
    },
  },
  args: {
    'aria-label': 'Breadcrumb',
  },
} satisfies Meta<typeof Breadcrumb>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Breadcrumb {...args}>
      <Breadcrumb.Item href="#home">Home</Breadcrumb.Item>
      <Breadcrumb.Item href="#projects">Projects</Breadcrumb.Item>
      <Breadcrumb.Item current>Cascade</Breadcrumb.Item>
    </Breadcrumb>
  ),
};

export const Long: Story = {
  render: (args) => (
    <div style={{ maxWidth: '20rem' }}>
      <Breadcrumb {...args}>
        <Breadcrumb.Item href="#home">Home</Breadcrumb.Item>
        <Breadcrumb.Item href="#workspace">Acme workspace</Breadcrumb.Item>
        <Breadcrumb.Item href="#projects">Projects</Breadcrumb.Item>
        <Breadcrumb.Item href="#cascade">Cascade</Breadcrumb.Item>
        <Breadcrumb.Item current>Deployment settings</Breadcrumb.Item>
      </Breadcrumb>
    </div>
  ),
};

export const Colors: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: '0.75rem' }}>
      {(
        [
          'neutral',
          'primary',
          'secondary',
          'tertiary',
          'accent',
          'success',
          'info',
          'danger',
        ] as const
      ).map((color) => (
        <Breadcrumb key={color} {...args} color={color} aria-label={`Breadcrumb ${color}`}>
          <Breadcrumb.Item href="#home">Home</Breadcrumb.Item>
          <Breadcrumb.Item href="#projects">Projects</Breadcrumb.Item>
          <Breadcrumb.Item current>{color}</Breadcrumb.Item>
        </Breadcrumb>
      ))}
    </div>
  ),
};
