import { useState } from 'react';
import type { FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import { authService } from '../services/authService';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTarget = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname || '/notes';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError('Email and password are required.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await authService.login({ email: email.trim(), password });
      navigate(redirectTarget, { replace: true });
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : 'Unable to log in.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Sign in"
      subtitle="Access your MindVault notes"
      alternateText="No account yet?"
      alternateTo="/register"
      alternateLabel="Create one"
    >
      <form className="form" onSubmit={handleSubmit} noValidate>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="At least 8 characters"
        />

        {error && <p className="error">{error}</p>}

        <button type="submit" className="button" disabled={isLoading}>
          {isLoading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
