import './index.css';
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import { LoginView } from './components/LoginView/index';
import { DashboardBuilderView } from './components/DashboardBuilderView';
import { DashboardViewer } from './components/DashboardViewer';

const QUERY_CLIENT = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        // render empty page
        element: <div />,
      },
      {
        path: '/dashboard-builder',
        element: <DashboardBuilderView />,
      },
      {
        path: '/dashboard/:slug',
        element: <DashboardViewer />,
      },
    ],
  },
  {
    path: '/login',
    element: <LoginView />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={QUERY_CLIENT}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>,
);
