import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import Pagination from '@/Molecules/Pagination/Pagination';
import type { PaginationProps } from '@/Molecules/Pagination/Pagination';

const meta = {
  title: 'CascadeDS/Components/Molecule/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  argTypes: {
    page: {
      control: 'number',
      description: 'The current page, starting at 1.',
    },
    pageCount: {
      control: 'number',
    },
    siblingCount: {
      control: 'number',
      description: 'Pages shown on each side of the current one.',
    },
    size: {
      control: 'radio',
      options: ['sm', 'md'],
    },
  },
  args: {
    page: 1,
    pageCount: 12,
    siblingCount: 1,
    size: 'md',
  },
} satisfies Meta<typeof Pagination>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Pagination holds no state: keep the page in yours and update it in `onPageChange`. */
function StatefulPagination(props: PaginationProps) {
  const [page, setPage] = useState(props.page);

  return <Pagination {...props} page={page} onPageChange={setPage} />;
}

export const Default: Story = {
  render: (args) => <StatefulPagination key={args.page} {...args} />,
};

export const MiddlePage: Story = {
  ...Default,
  args: {
    page: 6,
  },
};

export const FewPages: Story = {
  ...Default,
  args: {
    pageCount: 4,
  },
};

export const Small: Story = {
  ...Default,
  args: {
    size: 'sm',
    page: 6,
  },
};

/** With `getHref`, every page is a link, for pages rendered by the router or server. */
export const AsLinks: Story = {
  args: {
    page: 3,
    getHref: (page) => `#page-${page}`,
  },
};
