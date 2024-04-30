import * as React from 'react';
import { Button, TextInput } from '@tremor/react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../config/Constants';

export function LoginView(): JSX.Element {
  const navigate = useNavigate();
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  const onFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // prevent page refresh on form submission

    try {
      // fetch the CSRF token
      const csrfResponse = await fetch(`${API_BASE_URL}/csrf_generator/`, {
        method: 'GET',
        credentials: 'include',
      });

      if (csrfResponse.ok) {
        // now do the login
        const loginResponse = await fetch(`${API_BASE_URL}/login/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({ username, password }).toString(),
        });

        if (loginResponse.ok) {
          console.log('Login successful');
          navigate('/viz-builder');
        } else {
          // TODO: handle failure
          console.error('Login failed', await loginResponse.text());
        }
      }
    } catch (error) {
      console.error('Error fetching CSRF token', error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100">
      <div className="space-y-4 rounded-lg bg-white p-8 shadow-lg">
        <h1 className="text-2xl">Welcome to the HERA Data Dashboard</h1>
        <form className="space-y-4" onSubmit={onFormSubmit}>
          <TextInput
            value={username}
            onValueChange={setUsername}
            placeholder="Username"
          />
          <TextInput
            value={password}
            onValueChange={setPassword}
            placeholder="Password"
            type="password"
          />
          <Button type="submit" variant="primary">
            Login
          </Button>
        </form>
      </div>
    </div>
  );
}
