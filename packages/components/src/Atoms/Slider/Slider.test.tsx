import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Slider from './Slider';
import { sliderVariant } from './Slider.style';

afterEach(() => {
  cleanup();
});

describe('Slider', () => {
  it('renders a slider named by its label', () => {
    render(<Slider label="Volume" defaultValue={40} />);

    const slider = screen.getByRole('slider', { name: 'Volume' });
    expect(slider).toHaveAttribute('aria-valuenow', '40');
  });

  it('can be named with aria-label instead of a visible label', () => {
    render(<Slider aria-label="Volume" defaultValue={40} />);

    expect(screen.getByRole('slider', { name: 'Volume' })).toBeInTheDocument();
  });

  it('applies the variant classes to the root', () => {
    const { container } = render(<Slider label="Volume" defaultValue={40} className="custom" />);

    const root = container.firstChild as HTMLElement;
    sliderVariant()
      .split(' ')
      .filter(Boolean)
      .forEach((name) => expect(root).toHaveClass(name));
    expect(root).toHaveClass('custom');
  });

  it('shows the value only when asked', () => {
    const { rerender } = render(<Slider label="Volume" defaultValue={40} />);
    expect(screen.queryByText('40')).not.toBeInTheDocument();

    rerender(<Slider label="Volume" defaultValue={40} showValue />);
    expect(screen.getByText('40')).toBeInTheDocument();
  });

  it('changes value with the arrow keys and reports it', async () => {
    const user = userEvent.setup();
    const handleValueChange = vi.fn();
    render(<Slider label="Volume" defaultValue={40} onValueChange={handleValueChange} />);

    const slider = screen.getByRole('slider', { name: 'Volume' });
    slider.focus();
    await user.keyboard('{ArrowRight}');

    expect(handleValueChange).toHaveBeenLastCalledWith(41, expect.anything());
    expect(slider).toHaveAttribute('aria-valuenow', '41');
  });

  it('renders one named thumb per value for a range', () => {
    render(
      <Slider
        label="Price"
        defaultValue={[20, 80]}
        thumbLabels={['Minimum price', 'Maximum price']}
        showValue
      />,
    );

    expect(screen.getByRole('slider', { name: 'Minimum price' })).toHaveAttribute(
      'aria-valuenow',
      '20',
    );
    expect(screen.getByRole('slider', { name: 'Maximum price' })).toHaveAttribute(
      'aria-valuenow',
      '80',
    );
    expect(screen.getByText('20 – 80')).toBeInTheDocument();
  });

  it('uses getAriaValueText for the spoken value', () => {
    render(
      <Slider label="Budget" defaultValue={40} getAriaValueText={(_, value) => `$${value}`} />,
    );

    expect(screen.getByRole('slider', { name: 'Budget' })).toHaveAttribute('aria-valuetext', '$40');
  });

  it('does not change while disabled', async () => {
    const user = userEvent.setup();
    const handleValueChange = vi.fn();
    render(<Slider label="Volume" defaultValue={40} disabled onValueChange={handleValueChange} />);

    const slider = screen.getByRole('slider', { name: 'Volume' });
    expect(slider).toBeDisabled();

    slider.focus();
    await user.keyboard('{ArrowRight}');
    expect(handleValueChange).not.toHaveBeenCalled();
  });
});

describe('Slider colors', () => {
  it('applies the class for a color variant', () => {
    const { container } = render(<Slider defaultValue={40} aria-label="Volume" color="success" />);

    expect(container.firstChild).toHaveClass(sliderVariant({ color: 'success' }));
  });
});
