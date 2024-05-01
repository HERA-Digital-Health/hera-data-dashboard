import { clsx } from 'clsx';

type Props = {
  size: 'h1' | 'h2' | 'h3';
  children: React.ReactNode;
  className?: string;
};

export function Heading({ size, children, className }: Props): JSX.Element {
  const headingClassName = clsx('tracking-wide', className, {
    'text-2xl': size === 'h1',
    'text-xl': size === 'h2',
    'text-lg': size === 'h3',
  });

  switch (size) {
    case 'h1':
      return <h1 className={headingClassName}>{children}</h1>;
    case 'h2':
      return <h2 className={headingClassName}>{children}</h2>;
    case 'h3':
      return <h3 className={headingClassName}>{children}</h3>;
    default:
      throw new Error(`Invalid heading size '${size}'`);
  }
}
