import { h, ComponentChildren } from 'preact';
import style from './checkbox.css';
import clsx from 'clsx';

interface InputProps {
  id: string;
}

interface OwnProps {
  name: string;
  title?: string;
  error?: string;
  render: (props: InputProps) => ComponentChildren;
}

export default ({ name, error, render, title }: OwnProps) => (
  <div className={clsx(style.root, { [style.error]: error })}>
    {render({ id: name })}
    {title && <label for={name}>{title}</label>}
    {error && <span>{error}</span>}
  </div>
);
