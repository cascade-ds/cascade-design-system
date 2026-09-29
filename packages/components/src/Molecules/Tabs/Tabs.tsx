import { Tabs as BaseTabs } from '@base-ui/react/tabs';
import { cx } from '@linaria/core';
import { tabsCss, tabsIndicatorCss, tabsListCss, tabsPanelCss, tabsTabCss } from './Tabs.style';

type TabValue = string | number;

export type TabsProps = Omit<React.ComponentPropsWithRef<'div'>, 'defaultValue' | 'onChange'> & {
  children: React.ReactNode;
  /** The active tab's value when controlled. Pair with `onValueChange`. */
  value?: TabValue;
  /** The initially active tab's value when uncontrolled. Defaults to the first enabled tab. */
  defaultValue?: TabValue;
  /** Called when the user activates another tab. */
  onValueChange?: (value: TabValue) => void;
};

export type TabsListProps = React.ComponentPropsWithRef<'div'> & {
  /** Activate a tab as soon as arrow keys move focus to it, instead of on Enter/Space. */
  activateOnFocus?: boolean;
};

export type TabsTabProps = Omit<React.ComponentPropsWithRef<'button'>, 'value'> & {
  /** Matches the `value` of the `Tabs.Panel` this tab shows. */
  value: TabValue;
};

export type TabsPanelProps = React.ComponentPropsWithRef<'div'> & {
  /** Matches the `value` of the `Tabs.Tab` that shows this panel. */
  value: TabValue;
  /** Keep the panel in the DOM while hidden, e.g. to preserve its state. */
  keepMounted?: boolean;
};

/**
 * Switches between panels of related content. Arrow keys move between tabs,
 * Home/End jump to the first/last one.
 */
function Tabs(props: TabsProps) {
  const { value, defaultValue, onValueChange, className, ...restProps } = props;

  return (
    <BaseTabs.Root
      value={value}
      defaultValue={defaultValue}
      onValueChange={
        onValueChange ? (nextValue) => onValueChange(nextValue as TabValue) : undefined
      }
      className={cx(tabsCss, className)}
      {...restProps}
    />
  );
}

/** The row of tabs. Give it an `aria-label` when nothing else names it. */
function TabsList(props: TabsListProps) {
  const { className, children, ...restProps } = props;

  return (
    <BaseTabs.List className={cx(tabsListCss, className)} {...restProps}>
      {children}
      <BaseTabs.Indicator className={tabsIndicatorCss} />
    </BaseTabs.List>
  );
}

/** One tab. Its text names the panel it controls. */
function TabsTab(props: TabsTabProps) {
  const { className, ...restProps } = props;

  return <BaseTabs.Tab className={cx(tabsTabCss, className)} {...restProps} />;
}

/** Content shown while its tab is active. */
function TabsPanel(props: TabsPanelProps) {
  const { className, ...restProps } = props;

  return <BaseTabs.Panel className={cx(tabsPanelCss, className)} {...restProps} />;
}

Tabs.List = TabsList;
Tabs.Tab = TabsTab;
Tabs.Panel = TabsPanel;

export default Tabs;
