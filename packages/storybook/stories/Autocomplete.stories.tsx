import type { Meta, StoryObj } from '@storybook/react-vite';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { FormField, Autocomplete, type AutocompleteProps } from '@cds/components';

const meta = {
  title: 'CascadeDS/Components/Molecule/Autocomplete',
  component: Autocomplete,
  tags: ['autodocs'],
  parameters: {
    a11y: { context: 'body' },
  },
  argTypes: {
    disabled: {
      control: 'boolean',
    },
    mode: {
      control: 'radio',
      options: ['list', 'both', 'inline', 'none'],
      description:
        '`list` filters the suggestions; `both` also completes the input inline; `none` shows every suggestion unfiltered.',
    },
  },
  args: {
    disabled: false,
  },
} satisfies Meta<typeof Autocomplete>;

export default meta;

type Story = StoryObj<typeof meta>;

const tags = ['accessibility', 'bug', 'design', 'docs', 'feature', 'fix', 'performance', 'tokens'];

type StoryArgs = Pick<AutocompleteProps<string>, 'disabled' | 'mode'>;

function controls(args: StoryArgs): StoryArgs {
  return { disabled: args.disabled, mode: args.mode };
}

function TagAutocomplete(
  props: StoryArgs & { defaultValue?: string; defaultOpen?: boolean; search?: boolean },
) {
  const { search, ...autocompleteProps } = props;

  return (
    <FormField>
      <FormField.Label>Label</FormField.Label>
      <Autocomplete items={tags} {...autocompleteProps}>
        <Autocomplete.Input
          placeholder="e.g. feature"
          start={search ? <MagnifyingGlassIcon /> : undefined}
        />
        <Autocomplete.Content emptyMessage="No matching labels. Press Enter to use yours.">
          {(tag: string) => (
            <Autocomplete.Item key={tag} value={tag}>
              {tag}
            </Autocomplete.Item>
          )}
        </Autocomplete.Content>
      </Autocomplete>
      <FormField.Hint>Pick a suggestion or type a new label.</FormField.Hint>
    </FormField>
  );
}

export const Default: Story = {
  render: (args) => <TagAutocomplete {...controls(args)} />,
};

export const Open: Story = {
  render: (args) => <TagAutocomplete {...controls(args)} defaultValue="f" defaultOpen />,
};

export const Search: Story = {
  render: (args) => <TagAutocomplete {...controls(args)} search />,
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
  render: (args) => <TagAutocomplete {...controls(args)} defaultValue="docs" />,
};
