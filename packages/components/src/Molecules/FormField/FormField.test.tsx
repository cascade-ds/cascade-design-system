import '@testing-library/jest-dom/vitest';
import { createRef, useState } from 'react';
import { renderToString } from 'react-dom/server';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { labelVariant } from '@/Atoms/Label/Label.style';
import { textareaVariant } from '@/Atoms/Textarea/Textarea.style';
import FormField, { useFormFieldControl } from './FormField';
import { formFieldErrorCss, formFieldHintCss, formFieldInputVariant } from './FormField.style';

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

function EmailField({
  error,
  ...props
}: Partial<React.ComponentProps<typeof FormField>> & { error?: string }) {
  return (
    <FormField {...props}>
      <FormField.Label>Email</FormField.Label>
      <FormField.Input type="email" />
      <FormField.Hint>We never share it.</FormField.Hint>
      {error && <FormField.Error>{error}</FormField.Error>}
    </FormField>
  );
}

describe('FormField', () => {
  it('names the input with its label', () => {
    render(<EmailField />);

    const input = screen.getByRole('textbox', { name: 'Email' });
    expect(input.tagName).toBe('INPUT');
    expect(input).toHaveAttribute('type', 'email');
  });

  it('renders the label as a Cascade Label', () => {
    render(<EmailField />);

    expectClasses(screen.getByText('Email'), labelVariant());
  });

  it('describes the input with the hint', () => {
    render(<EmailField />);

    expect(screen.getByRole('textbox', { name: 'Email' })).toHaveAccessibleDescription(
      'We never share it.',
    );
    expect(screen.getByText('We never share it.')).toHaveClass(formFieldHintCss);
  });

  it('is valid while no error is rendered', () => {
    render(<EmailField />);

    expect(screen.getByRole('textbox', { name: 'Email' })).not.toBeInvalid();
  });

  it('shows a rendered error, describes the input with it and marks it invalid', () => {
    render(<EmailField error="Enter a valid email." />);

    const input = screen.getByRole('textbox', { name: 'Email' });
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('Enter a valid email.')).toHaveClass(formFieldErrorCss);
    expect(input).toHaveAccessibleDescription('We never share it. Enter a valid email.');
  });

  it('lets an explicit invalid prop override the rendered error', () => {
    render(<EmailField error="Checking…" invalid={false} />);

    expect(screen.getByRole('textbox', { name: 'Email' })).not.toBeInvalid();
  });

  it('marks the input invalid without an error message when invalid', () => {
    render(<EmailField invalid />);

    expect(screen.getByRole('textbox', { name: 'Email' })).toHaveAttribute('aria-invalid', 'true');
  });

  it('drops the error from the description once it is removed', () => {
    const { rerender } = render(<EmailField error="Enter a valid email." />);
    rerender(<EmailField />);

    const input = screen.getByRole('textbox', { name: 'Email' });
    expect(input).not.toBeInvalid();
    expect(input).toHaveAccessibleDescription('We never share it.');
  });

  it('points the label at a custom control id', () => {
    render(<EmailField controlId="signup-email" />);

    expect(screen.getByRole('textbox', { name: 'Email' })).toHaveAttribute('id', 'signup-email');
  });

  it('marks the input required and shows the label marker', () => {
    render(<EmailField required />);

    expect(screen.getByRole('textbox', { name: /Email/ })).toBeRequired();
    expect(screen.getByText('*')).toHaveAttribute('aria-hidden', 'true');
  });

  it('disables the input and the label', () => {
    render(<EmailField disabled />);

    expect(screen.getByRole('textbox', { name: 'Email' })).toBeDisabled();
    expectClasses(screen.getByText('Email'), labelVariant({ disabled: true }));
  });

  it.each(['sm', 'md', 'lg'] as const)('applies the class for the %s input size', (size) => {
    render(
      <FormField>
        <FormField.Label>Name</FormField.Label>
        <FormField.Input size={size} />
      </FormField>,
    );

    expectClasses(screen.getByRole('textbox', { name: 'Name' }), formFieldInputVariant({ size }));
  });

  it('throws when a part is rendered outside a FormField', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => render(<FormField.Hint>Orphan</FormField.Hint>)).toThrow(
      'FormField.Hint must be rendered inside a FormField.',
    );
    consoleError.mockRestore();
  });

  describe('state stays with the consumer', () => {
    it('passes ref, name, onChange and onBlur through (register-style libraries)', async () => {
      const user = userEvent.setup();
      const ref = createRef<HTMLInputElement>();
      const handleChange = vi.fn();
      const handleBlur = vi.fn();

      render(
        <FormField>
          <FormField.Label>Email</FormField.Label>
          <FormField.Input ref={ref} name="email" onChange={handleChange} onBlur={handleBlur} />
        </FormField>,
      );

      const input = screen.getByRole('textbox', { name: 'Email' });
      await user.type(input, 'a');
      await user.tab();
      expect(ref.current).toBe(input);
      expect(input).toHaveAttribute('name', 'email');
      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });

    it('supports a controlled value', async () => {
      const user = userEvent.setup();

      function Controlled() {
        const [value, setValue] = useState('');
        return (
          <FormField>
            <FormField.Label>Code</FormField.Label>
            <FormField.Input
              value={value}
              onChange={(event) => setValue(event.target.value.toUpperCase())}
            />
          </FormField>
        );
      }

      render(<Controlled />);
      await user.type(screen.getByRole('textbox', { name: 'Code' }), 'ab');
      expect(screen.getByRole('textbox', { name: 'Code' })).toHaveValue('AB');
    });

    it('runs no validation of its own', async () => {
      const user = userEvent.setup();

      render(
        <form noValidate onSubmit={(event) => event.preventDefault()}>
          <FormField required>
            <FormField.Label>Email</FormField.Label>
            <FormField.Input />
          </FormField>
          <button type="submit">Send</button>
        </form>,
      );

      const input = screen.getByRole('textbox', { name: /Email/ });
      await user.click(input);
      await user.tab();
      await user.click(screen.getByRole('button', { name: 'Send' }));
      expect(input).not.toHaveAttribute('aria-invalid');
    });
  });

  describe('FormField.Control', () => {
    it('wires any control to the label, hint, error and field state', () => {
      render(
        <FormField required>
          <FormField.Label>Due date</FormField.Label>
          <FormField.Control>
            {(controlProps) => <input type="date" {...controlProps} />}
          </FormField.Control>
          <FormField.Hint>Pick a weekday.</FormField.Hint>
          <FormField.Error>Pick a date.</FormField.Error>
        </FormField>,
      );

      const input = screen.getByLabelText(/Due date/);
      expect(input).toHaveAttribute('type', 'date');
      expect(input).toBeRequired();
      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(input).toHaveAccessibleDescription('Pick a weekday. Pick a date.');
    });
  });

  describe('useFormFieldControl', () => {
    it('keeps props set on the control', () => {
      function Custom() {
        const controlProps = useFormFieldControl({ id: 'own-id', 'aria-describedby': 'extra' });
        return <input {...controlProps} />;
      }

      render(
        <FormField disabled>
          <Custom />
          <FormField.Hint>Hint.</FormField.Hint>
          <span id="extra">Extra.</span>
        </FormField>,
      );

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('id', 'own-id');
      expect(input).toBeDisabled();
      expect(input).toHaveAccessibleDescription('Extra. Hint.');
    });

    it('returns the props unchanged outside a FormField', () => {
      function Custom() {
        return <input {...useFormFieldControl({ 'aria-label': 'Alone' })} />;
      }

      render(<Custom />);

      const input = screen.getByRole('textbox', { name: 'Alone' });
      expect(input).not.toHaveAttribute('id');
      expect(input).not.toHaveAttribute('aria-describedby');
    });
  });

  describe('FormField.Textarea', () => {
    it('renders a Cascade Textarea wired to the label, hint and error', () => {
      render(
        <FormField required>
          <FormField.Label>Bio</FormField.Label>
          <FormField.Textarea size="sm" />
          <FormField.Hint>A short intro.</FormField.Hint>
          <FormField.Error>Bio is too long.</FormField.Error>
        </FormField>,
      );

      const textarea = screen.getByRole('textbox', { name: /Bio/ });
      expect(textarea.tagName).toBe('TEXTAREA');
      expectClasses(textarea, textareaVariant({ size: 'sm' }));
      expect(textarea).toBeRequired();
      expect(textarea).toHaveAttribute('aria-invalid', 'true');
      expect(textarea).toHaveAccessibleDescription('A short intro. Bio is too long.');
    });
  });

  describe('several hints and errors', () => {
    function PasswordField({ errors }: { errors: string[] }) {
      return (
        <FormField>
          <FormField.Label>Password</FormField.Label>
          <FormField.Input type="text" />
          <FormField.Hint>At least 8 characters.</FormField.Hint>
          <FormField.Hint>Mix letters and numbers.</FormField.Hint>
          {errors.map((error) => (
            <FormField.Error key={error}>{error}</FormField.Error>
          ))}
        </FormField>
      );
    }

    it('gives every part its own id and describes the control with all of them', () => {
      render(<PasswordField errors={['Too short.', 'Add a number.']} />);

      const ids = [
        'At least 8 characters.',
        'Mix letters and numbers.',
        'Too short.',
        'Add a number.',
      ].map((text) => screen.getByText(text).id);
      expect(new Set(ids).size).toBe(4);
      expect(screen.getByRole('textbox', { name: 'Password' })).toHaveAccessibleDescription(
        'At least 8 characters. Mix letters and numbers. Too short. Add a number.',
      );
    });

    it('keeps the remaining error wired when another one is removed', () => {
      const { rerender } = render(<PasswordField errors={['Too short.', 'Add a number.']} />);
      rerender(<PasswordField errors={['Add a number.']} />);

      const input = screen.getByRole('textbox', { name: 'Password' });
      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(input).toHaveAccessibleDescription(
        'At least 8 characters. Mix letters and numbers. Add a number.',
      );
    });
  });

  describe('server rendering', () => {
    it('wires the label, hint and error into the first render', () => {
      const html = renderToString(<EmailField error="Enter a valid email." />);
      const container = document.createElement('div');
      container.innerHTML = html;

      const input = container.querySelector('input')!;
      const [hintId, errorId] = input.getAttribute('aria-describedby')!.split(' ');
      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(container.querySelector(`[id="${hintId}"]`)).toHaveTextContent('We never share it.');
      expect(container.querySelector(`[id="${errorId}"]`)).toHaveTextContent(
        'Enter a valid email.',
      );
      expect(
        container.querySelector(`[id="${input.getAttribute('aria-labelledby')}"]`),
      ).toHaveTextContent('Email');
    });
  });

  it('wires parts nested inside other components once they mount', () => {
    function FieldMessages() {
      return (
        <div>
          <FormField.Hint>Nested hint.</FormField.Hint>
          <FormField.Error>Nested error.</FormField.Error>
        </div>
      );
    }

    render(
      <FormField>
        <FormField.Label>City</FormField.Label>
        <FormField.Input />
        <FieldMessages />
      </FormField>,
    );

    const input = screen.getByRole('textbox', { name: 'City' });
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('Nested hint. Nested error.');
  });

  describe('naming custom controls', () => {
    it('names a control that <label for> cannot reach', () => {
      render(
        <FormField>
          <FormField.Label>Assignee</FormField.Label>
          <FormField.Control>
            {(controlProps) => (
              <div
                role="combobox"
                tabIndex={0}
                aria-expanded="false"
                aria-controls="assignee-options"
                {...controlProps}
              />
            )}
          </FormField.Control>
        </FormField>,
      );

      expect(screen.getByRole('combobox', { name: 'Assignee' })).toBeInTheDocument();
    });

    it('keeps a name the control already has', () => {
      function Custom() {
        return <input {...useFormFieldControl({ 'aria-label': 'Search' })} />;
      }

      render(
        <FormField>
          <FormField.Label>Filters</FormField.Label>
          <Custom />
        </FormField>,
      );

      const input = screen.getByRole('textbox', { name: 'Search' });
      expect(input).not.toHaveAttribute('aria-labelledby');
    });
  });
});
