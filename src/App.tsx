import { Outlet } from 'react-router-dom';
import { Layout } from './components/ui/Layout';

function App(): JSX.Element {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

export default App;
