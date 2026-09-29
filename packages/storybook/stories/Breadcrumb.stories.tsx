import type { Meta, StoryObj } from '@storybook/react-vite';
import { Breadcrumb } from '@cds/components';

const meta = {
  title: 'CascadeDS/Components/Molecule/Breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs'],
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
