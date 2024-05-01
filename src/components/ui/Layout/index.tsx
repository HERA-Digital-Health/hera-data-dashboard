import * as React from 'react';
import { clsx } from 'clsx';
import { Link, useMatch } from 'react-router-dom';
import { useDashboards } from '../../../hooks/useDashboards';
import { Divider } from '@tremor/react';

function NavButton({
  children,
  to,
}: {
  children: React.ReactNode;
  to: string;
}) {
  const match = useMatch(to);
  const navClassName = clsx(
    'rounded px-6 py-2 text-white transition-all hover:bg-violet-500',
    {
      'bg-violet-600': !!match,
    },
  );

  return (
    <Link to={to} className={navClassName}>
      {children}
    </Link>
  );
}

type Props = {
  children: React.ReactNode;
};

export function Layout({ children }: Props): JSX.Element {
  const { data: dashboards } = useDashboards();

  return (
    <div className="flex">
      <div className="flex flex-col space-y-2 bg-violet-800 px-3 py-4 text-white">
        <NavButton to="/dashboard-builder">Dashboard Builder</NavButton>
        <Divider className="text-violet-100">Dashboards</Divider>
        {dashboards
          ? dashboards.map((dashboard) => {
              return (
                <NavButton
                  key={dashboard.slug}
                  to={`/dashboard/${dashboard.slug}`}
                >
                  {dashboard.title}
                </NavButton>
              );
            })
          : null}
      </div>
      <div className="flex min-h-screen w-full flex-1 space-y-4 bg-slate-100 px-8 py-6">
        {children}
      </div>
    </div>
  );
}
