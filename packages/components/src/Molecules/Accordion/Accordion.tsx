import { Accordion as BaseAccordion } from '@base-ui/react/accordion';
import { cx } from '@linaria/core';
import type { VariantProps } from 'class-variance-authority';
import {
  accordionHeaderCss,
  accordionIconCss,
  accordionItemCss,
  accordionPanelContentCss,
  accordionPanelCss,
  accordionTriggerCss,
  accordionVariant,
} from './Accordion.style';

type ItemValue = string | number;

export type AccordionProps = VariantProps<typeof accordionVariant> &
  Omit<React.ComponentPropsWithRef<'div'>, 'defaultValue' | 'onChange'> & {
    children: React.ReactNode;
    /** Values of the open items when controlled. Pair with `onValueChange`. */
    value?: ItemValue[];
    /** Values of the items open at first when uncontrolled. */
    defaultValue?: ItemValue[];
    /** Called with the open items' values when one opens or closes. */
    onValueChange?: (value: ItemValue[]) => void;
    /** Lets several items be open at once. Otherwise opening one closes the others. */
    multiple?: boolean;
    /** Disables every item. */
    disabled?: boolean;
    /**
     * Keeps closed panels in the DOM, hidden, so the browser's find-in-page can
     * search them and open the matching item.
     */
    hiddenUntilFound?: boolean;
  };

export type AccordionItemProps = React.ComponentPropsWithRef<'div'> & {
  /** Identifies the item in `value` / `defaultValue`. Generated when unset. */
  value?: ItemValue;
  disabled?: boolean;
};

export type AccordionTriggerProps = React.ComponentPropsWithRef<'button'> & {
  /**
   * Level of the heading that wraps the trigger. Pick the one that fits the
   * page outline. Defaults to 3.
   */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
};

export type AccordionPanelProps = React.ComponentPropsWithRef<'div'>;

/**
 * A stack of sections that expand and collapse. Each `Accordion.Item` pairs
 * an `Accordion.Trigger` (a button inside a heading) with an
 * `Accordion.Panel`.
 */
function Accordion(props: AccordionProps) {
  const { value, defaultValue, onValueChange, background, className, ...restProps } = props;

  return (
    <BaseAccordion.Root
      value={value}
      defaultValue={defaultValue}
      onValueChange={
        onValueChange ? (nextValue) => onValueChange(nextValue as ItemValue[]) : undefined
      }
      className={cx(accordionVariant({ background }), className)}
      {...restProps}
    />
  );
}

/** One section: a trigger and its panel. */
function AccordionItem(props: AccordionItemProps) {
  const { className, ...restProps } = props;

  return <BaseAccordion.Item className={cx(accordionItemCss, className)} {...restProps} />;
}

/** The heading button that opens and closes the item's panel. */
function AccordionTrigger(props: AccordionTriggerProps) {
  const { headingLevel = 3, className, children, ...restProps } = props;
  const Heading = `h${headingLevel}` as const;

  return (
    <BaseAccordion.Header className={accordionHeaderCss} render={<Heading />}>
      <BaseAccordion.Trigger className={cx(accordionTriggerCss, className)} {...restProps}>
        {children}
        <svg className={accordionIconCss} viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="M4 6l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </BaseAccordion.Trigger>
    </BaseAccordion.Header>
  );
}

/** The item's content, shown while it is open. */
function AccordionPanel(props: AccordionPanelProps) {
  const { className, children, ...restProps } = props;

  return (
    <BaseAccordion.Panel className={cx(accordionPanelCss, className)} {...restProps}>
      <div className={accordionPanelContentCss}>{children}</div>
    </BaseAccordion.Panel>
  );
}

export {
  Accordion as Root,
  AccordionItem as Item,
  AccordionTrigger as Trigger,
  AccordionPanel as Panel,
};
