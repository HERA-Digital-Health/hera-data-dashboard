import * as React from 'react';

type Props = {
  children: React.ReactNode;
  label: React.ReactNode;
};

export function LabelWrapper({ children, label }: Props): JSX.Element {
  return (
    <label className="space-y-1">
      <span className="text-xs uppercase tracking-wider text-slate-700">
        {label}
      </span>
      {children}
    </label>
  );
}
