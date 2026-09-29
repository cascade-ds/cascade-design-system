import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { inputVariant, inputWrapperVariant } from '../../Atoms/Input/Input.style';
import FormField from '../FormField/FormField';
import { ThemeProvider } from '../../ThemeProvider';
import Combobox from './Combobox';
import type { ComboboxProps } from './Combobox';
import { comboboxItemCss, comboboxPopupCss } from './Combobox.style';

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

const fruits = ['Apple', 'Banana', 'Blueberry', 'Cherry'];

function renderCombobox(
  props: Partial<ComboboxProps<string>> = {},
  inputProps: Partial<React.ComponentProps<typeof Combobox.Input>> = {},
) {
  return render(
    <Combobox items={fruits} {...props}>
      <Combobox.Input aria-label="Fruit" placeholder="Search fruits" {...inputProps} />
      <Combobox.Content emptyMessage="No fruits found.">
        {(fruit: string) => (
          <Combobox.Item key={fruit} value={fruit}>
            {fruit}
          </Combobox.Item>
        )}
      </Combobox.Content>
    </Combobox>,
  );
}

describe('Combobox', () => {
  it('renders a combobox input with the Input styles', () => {
    renderCombobox({}, { size: 'lg' });

    const input = screen.getByRole('combobox', { name: 'Fruit' });
    expect(input.tagName).toBe('INPUT');
    expectClasses(input, inputVariant({ size: 'lg' }));
    expectClasses(input.parentElement as HTMLElement, inputWrapperVariant({ size: 'lg' }));
  });

  it('opens the options from the chevron button', async () => {
    const user = userEvent.setup();
    renderCombobox();

    await user.click(screen.getByRole('button', { name: 'Show options' }));

    const listbox = await screen.findByRole('listbox');
    expect(listbox.closest(`.${comboboxPopupCss}`)).not.toBeNull();
    const options = screen.getAllByRole('option');
    expect(options.map((option) => option.textContent)).toEqual(fruits);
    expect(options[0]).toHaveClass(comboboxItemCss);
  });

  it('filters the options while typing', async () => {
    const user = userEvent.setup();
    renderCombobox();

    await user.type(screen.getByRole('combobox', { name: 'Fruit' }), 'b');

    await waitFor(() =>
      expect(screen.getAllByRole('option').map((option) => option.textContent)).toEqual([
        'Banana',
        'Blueberry',
      ]),
    );
  });

  it('shows the empty message when nothing matches', async () => {
    const user = userEvent.setup();
    renderCombobox();

    await user.type(screen.getByRole('combobox', { name: 'Fruit' }), 'zzz');

    expect(await screen.findByText('No fruits found.')).toBeInTheDocument();
    expect(screen.queryByRole('option')).not.toBeInTheDocument();
  });

  it('selects an option with the keyboard and reports the value', async () => {
    const user = userEvent.setup();
    const handleValueChange = vi.fn();
    renderCombobox({ onValueChange: handleValueChange });

    const input = screen.getByRole('combobox', { name: 'Fruit' });
    await user.type(input, 'che');
    await user.keyboard('{ArrowDown}{Enter}');

    expect(handleValueChange).toHaveBeenCalledWith('Cherry', expect.anything());
    await waitFor(() => expect(input).toHaveValue('Cherry'));
  });

  it('marks the selected option', async () => {
    const user = userEvent.setup();
    renderCombobox({ defaultValue: 'Banana' });

    await user.click(screen.getByRole('button', { name: 'Show options' }));

    expect(await screen.findByRole('option', { name: 'Banana' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });

  it('filters grouped items and names each group by its label', async () => {
    const user = userEvent.setup();
    const regions = [
      { value: 'Americas', items: ['New York', 'Toronto'] },
      { value: 'Europe', items: ['Berlin', 'Lisbon'] },
    ];

    render(
      <Combobox items={regions}>
        <Combobox.Input aria-label="Office" />
        <Combobox.Content>
          {(group: (typeof regions)[number]) => (
            <Combobox.Group key={group.value} items={group.items}>
              <Combobox.GroupLabel>{group.value}</Combobox.GroupLabel>
              <Combobox.Collection>
                {(office: string) => (
                  <Combobox.Item key={office} value={office}>
                    {office}
                  </Combobox.Item>
                )}
              </Combobox.Collection>
            </Combobox.Group>
          )}
        </Combobox.Content>
      </Combobox>,
    );

    await user.type(screen.getByRole('combobox', { name: 'Office' }), 'l');

    await waitFor(() =>
      expect(screen.getAllByRole('option').map((option) => option.textContent)).toEqual([
        'Berlin',
        'Lisbon',
      ]),
    );
    expect(screen.getByRole('group', { name: 'Europe' })).toBeInTheDocument();
  });

  it('takes a custom chevron label', () => {
    renderCombobox({}, { triggerLabel: 'Mostrar opções' });

    expect(screen.getByRole('button', { name: 'Mostrar opções' })).toBeInTheDocument();
  });

  it('does not open when disabled', async () => {
    const user = userEvent.setup();
    renderCombobox({ disabled: true });

    await user.click(screen.getByRole('combobox', { name: 'Fruit' }));

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  describe('inside a FormField', () => {
    it('is named by the field label and described by its hint and error', () => {
      render(
        <FormField invalid>
          <FormField.Label>Fruit</FormField.Label>
          <Combobox items={fruits}>
            <Combobox.Input />
            <Combobox.Content>
              {(fruit: string) => (
                <Combobox.Item key={fruit} value={fruit}>
                  {fruit}
                </Combobox.Item>
              )}
            </Combobox.Content>
          </Combobox>
          <FormField.Hint>Used for the smoothie.</FormField.Hint>
          <FormField.Error>Pick a fruit.</FormField.Error>
        </FormField>,
      );

      const input = screen.getByRole('combobox', { name: 'Fruit' });
      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(input).toHaveAccessibleDescription(expect.stringContaining('Used for the smoothie.'));
      expect(input).toHaveAccessibleDescription(expect.stringContaining('Pick a fruit.'));
    });

    it("takes the field's disabled state", () => {
      render(
        <FormField disabled>
          <FormField.Label>Fruit</FormField.Label>
          <Combobox items={fruits}>
            <Combobox.Input />
            <Combobox.Content>
              {(fruit: string) => (
                <Combobox.Item key={fruit} value={fruit}>
                  {fruit}
                </Combobox.Item>
              )}
            </Combobox.Content>
          </Combobox>
        </FormField>,
      );

      expect(screen.getByRole('combobox', { name: 'Fruit' })).toBeDisabled();
    });
  });

  describe('theming through the portal (ADR-006)', () => {
    it('keeps a dark subtree dark inside a light page', async () => {
      render(
        <ThemeProvider initialMode="light">
          <ThemeProvider initialMode="dark">
            <Combobox items={fruits} defaultOpen>
              <Combobox.Input aria-label="Fruit" />
              <Combobox.Content>
                {(fruit: string) => (
                  <Combobox.Item key={fruit} value={fruit}>
                    {fruit}
                  </Combobox.Item>
                )}
              </Combobox.Content>
            </Combobox>
          </ThemeProvider>
        </ThemeProvider>,
      );

      const listbox = await screen.findByRole('listbox');
      expect(listbox.closest('[data-theme]')).toHaveAttribute('data-theme', 'dark');
    });
  });
});
