import { Children, Fragment, isValidElement } from 'react';
import Box from '../../Layout/Box';
import Icon from '../Icon/Icon';
import type { IconProps } from '../Icon/Icon';
import {
  switchControlCss,
  switchIconCss,
  switchIconOffCss,
  switchIconOnCss,
  switchVariant,
} from './Switch.style';
import type { VariantProps } from 'class-variance-authority';
import { cx } from '@linaria/core';

export type SwitchProps = VariantProps<typeof switchVariant> &
  Omit<React.ComponentPropsWithRef<'input'>, 'type' | 'role' | 'children'> & {
    /**
     * Inline label text, plus optional `Switch.IconOn` / `Switch.IconOff`.
     * When there is label text, the switch is wrapped in a `<label>`.
     */
    children?: React.ReactNode;
  };

export type SwitchIconProps = Omit<IconProps, 'size' | 'label'>;

function isSwitchIcon(child: React.ReactNode) {
  return isValidElement(child) && (child.type === SwitchIconOn || child.type === SwitchIconOff);
}

// Children.toArray keeps fragments whole, so `<>…</>` icons would be mistaken for label content.
function flattenChildren(children: React.ReactNode): React.ReactNode[] {
  return Children.toArray(children).flatMap((child) =>
    isValidElement<{ children?: React.ReactNode }>(child) && child.type === Fragment
      ? flattenChildren(child.props.children)
      : [child],
  );
}

function Switch(props: SwitchProps) {
  const { disabled, className, children, ...restProps } = props;
  const rootClassName = cx(switchVariant({ disabled: Boolean(disabled) }), className);

  const childArray = flattenChildren(children);
  const icons = childArray.filter(isSwitchIcon);
  const label = childArray.filter((child) => !isSwitchIcon(child));

  return (
    <Box as={label.length > 0 ? 'label' : 'span'} className={rootClassName}>
      <span className={switchControlCss}>
        <Box as="input" type="checkbox" role="switch" disabled={disabled} {...restProps} />
        <span aria-hidden="true">{icons}</span>
      </span>
      {label}
    </Box>
  );
}

/**
 * An icon inside the Switch's thumb, shown only while the Switch is on.
 * Always decorative: the Switch's label (or `aria-label`) names it.
 */
function SwitchIconOn(props: SwitchIconProps) {
  const { className, ...restProps } = props;

  return (
    <Icon size={null} className={cx(switchIconCss, switchIconOnCss, className)} {...restProps} />
  );
}

/**
 * An icon inside the Switch's thumb, shown only while the Switch is off.
 * Always decorative: the Switch's label (or `aria-label`) names it.
 */
function SwitchIconOff(props: SwitchIconProps) {
  const { className, ...restProps } = props;

  return (
    <Icon size={null} className={cx(switchIconCss, switchIconOffCss, className)} {...restProps} />
  );
}

Switch.IconOn = SwitchIconOn;
Switch.IconOff = SwitchIconOff;

export default Switch;
