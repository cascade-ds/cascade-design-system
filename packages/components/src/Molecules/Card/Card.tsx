import { cx } from '@linaria/core';
import type { VariantProps } from 'class-variance-authority';
import Box from '../../Layout/Box';
import {
  cardBodyCss,
  cardFooterCss,
  cardHeaderCss,
  cardSubtitleCss,
  cardTitleCss,
  cardVariant,
} from './Card.style';

export type CardElement = 'div' | 'article' | 'section' | 'li';

export type CardProps = VariantProps<typeof cardVariant> &
  React.ComponentPropsWithRef<'div'> & {
    /**
     * Element to render. Use `article` for self-contained content, `section`
     * for a titled region of the page, `li` inside a list of cards.
     */
    as?: CardElement;
  };

export type CardHeaderProps = React.ComponentPropsWithRef<'div'>;

export type CardTitleProps = React.ComponentPropsWithRef<'h3'> & {
  /** Heading level. Match it to the page outline; defaults to `h3`. */
  as?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
};

export type CardSubtitleProps = React.ComponentPropsWithRef<'p'>;

export type CardBodyProps = React.ComponentPropsWithRef<'div'>;

export type CardFooterProps = React.ComponentPropsWithRef<'div'>;

/** A bordered surface that groups related content, such as a chart or a list. */
function Card(props: CardProps) {
  const { as = 'div', background, interactive, hover, className, ...restProps } = props;

  return (
    <Box
      {...(restProps as React.ComponentPropsWithRef<'div'>)}
      as={as}
      className={cx(cardVariant({ background, interactive, hover }), className)}
    />
  );
}

/** Stacks the title and subtitle. */
function CardHeader(props: CardHeaderProps) {
  const { className, ...restProps } = props;

  return <Box as="div" className={cx(cardHeaderCss, className)} {...restProps} />;
}

function CardTitle(props: CardTitleProps) {
  const { as = 'h3', className, ...restProps } = props;

  return <Box as={as} className={cx(cardTitleCss, className)} {...restProps} />;
}

function CardSubtitle(props: CardSubtitleProps) {
  const { className, ...restProps } = props;

  return <Box as="p" className={cx(cardSubtitleCss, className)} {...restProps} />;
}

function CardBody(props: CardBodyProps) {
  const { className, ...restProps } = props;

  return <Box as="div" className={cx(cardBodyCss, className)} {...restProps} />;
}

/** Row of actions, aligned to the end. */
function CardFooter(props: CardFooterProps) {
  const { className, ...restProps } = props;

  return <Box as="div" className={cx(cardFooterCss, className)} {...restProps} />;
}

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Subtitle = CardSubtitle;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;
