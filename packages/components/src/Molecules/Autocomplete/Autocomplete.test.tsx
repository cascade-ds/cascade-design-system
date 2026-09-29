import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { inputVariant, inputWrapperVariant } from '@/Atoms/Input/Input.style';
import FormField from '@/Molecules/FormField/FormField';
import { comboboxOptionCss, comboboxPopupCss } from '@/Molecules/Combobox/Combobox.style';
import { ThemeProvider } from '@/ThemeProvider';
import Autocomplete from './Autocomplete';
import type { AutocompleteProps } from './Autocomplete';
import { autocompleteItemCss } from './Autocomplete.style';

afterEach(() => {
  cleanup();
});

function expectClasses(element: HTMLElement, className: string) {
  className
    .split(' ')
    .filter(Boolean)
    .forEach((name) => {
      expect(element).toHaveClass(name);
    });
}

const tags = ['bug', 'docs', 'feature', 'fix'];

function renderAutocomplete(
  props: Partial<AutocompleteProps<string>> = {},
  inputProps: Partial<React.ComponentProps<typeof Autocomplete.Input>> = {},
) {
  return render(
    <Autocomplete items={tags} {...props}>
      <Autocomplete.Input aria-label="Tag" placeholder="e.g. feature" {...inputProps} />
      <Autocomplete.Content emptyMessage="No tags found.">
        {(tag: string) => (
          <Autocomplete.Item key={tag} value={tag}>
            {tag}
          </Autocomplete.Item>
        )}
      </Autocomplete.Content>
    </Autocomplete>,
  );
}

describe('Autocomplete', () => {
  it('renders a bare combobox input with the Input styles', () => {
    renderAutocomplete({}, { size: 'sm' });

    const input = screen.getByRole('combobox', { name: 'Tag' });
    expect(input.tagName).toBe('INPUT');
    expectClasses(input, inputVariant({ size: 'sm' }));
  });

  it('wraps the input when it has a start slot', () => {
    renderAutocomplete({}, { start: <svg aria-hidden="true" data-testid="search-icon" /> });

    const input = screen.getByRole('combobox', { name: 'Tag' });
    expect(input).toHaveAttribute('data-start');
    expectClasses(input.parentElement as HTMLElement, inputWrapperVariant());
    expect(screen.getByTestId('search-icon')).toBeInTheDocument();
  });

  it('suggests matching items while typing', async () => {
    const user = userEvent.setup();
    renderAutocomplete();

    await user.type(screen.getByRole('combobox', { name: 'Tag' }), 'f');

    const listbox = await screen.findByRole('listbox');
    expect(listbox.closest(`.${comboboxPopupCss}`)).not.toBeNull();
    await waitFor(() =>
      expect(screen.getAllByRole('option').map((option) => option.textContent)).toEqual([
        'feature',
        'fix',
      ]),
    );
    const option = screen.getByRole('option', { name: 'fix' });
    expect(option).toHaveClass(comboboxOptionCss);
    expect(option).toHaveClass(autocompleteItemCss);
  });

  it('fills the input with a picked suggestion', async () => {
    const user = userEvent.setup();
    const handleValueChange = vi.fn();
    renderAutocomplete({ onValueChange: handleValueChange });

    const input = screen.getByRole('combobox', { name: 'Tag' });
    await user.type(input, 'do');
    await user.click(await screen.findByRole('option', { name: 'docs' }));

    expect(input).toHaveValue('docs');
    expect(handleValueChange).toHaveBeenLastCalledWith('docs', expect.anything());
  });

  it('keeps free text that matches no suggestion', async () => {
    const user = userEvent.setup();
    renderAutocomplete();

    const input = screen.getByRole('combobox', { name: 'Tag' });
    await user.type(input, 'performance');

    expect(await screen.findByText('No tags found.')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(input).toHaveValue('performance');
  });

  describe('inside a FormField', () => {
    it('is named by the field label and described by its hint', () => {
      render(
        <FormField>
          <FormField.Label>Tag</FormField.Label>
          <Autocomplete items={tags}>
            <Autocomplete.Input />
            <Autocomplete.Content>
              {(tag: string) => (
                <Autocomplete.Item key={tag} value={tag}>
                  {tag}
                </Autocomplete.Item>
              )}
            </Autocomplete.Content>
          </Autocomplete>
          <FormField.Hint>Any label works.</FormField.Hint>
        </FormField>,
      );

      const input = screen.getByRole('combobox', { name: 'Tag' });
      expect(input).toHaveAccessibleDescription('Any label works.');
    });

    it("takes the field's disabled state", () => {
      render(
        <FormField disabled>
          <FormField.Label>Tag</FormField.Label>
          <Autocomplete items={tags}>
            <Autocomplete.Input />
            <Autocomplete.Content>
              {(tag: string) => (
                <Autocomplete.Item key={tag} value={tag}>
                  {tag}
                </Autocomplete.Item>
              )}
            </Autocomplete.Content>
          </Autocomplete>
        </FormField>,
      );

      expect(screen.getByRole('combobox', { name: 'Tag' })).toBeDisabled();
    });
  });

  describe('theming through the portal (ADR-006)', () => {
    it('keeps a dark subtree dark inside a light page', async () => {
      render(
        <ThemeProvider initialMode="light">
          <ThemeProvider initialMode="dark">
            <Autocomplete items={tags} defaultOpen>
              <Autocomplete.Input aria-label="Tag" />
              <Autocomplete.Content>
                {(tag: string) => (
                  <Autocomplete.Item key={tag} value={tag}>
                    {tag}
                  </Autocomplete.Item>
                )}
              </Autocomplete.Content>
            </Autocomplete>
          </ThemeProvider>
        </ThemeProvider>,
      );

      const listbox = await screen.findByRole('listbox');
      expect(listbox.closest('[data-theme]')).toHaveAttribute('data-theme', 'dark');
    });
  });
});
