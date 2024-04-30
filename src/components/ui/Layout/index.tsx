import * as React from 'react';
import { Link } from 'react-router-dom';
import { useDashboards } from '../../../hooks/useDashboards';

function NavButton({
  children,
  to,
}: {
  children: React.ReactNode;
  to: string;
}) {
  return (
    <Link
      to={to}
      className="px-8 py-2 text-white transition-all hover:bg-violet-500"
    >
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
      <div className="flex flex-col bg-violet-800 py-4 text-white">
        <NavButton to="/dashboard-builder">Dashboard Builder</NavButton>
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
