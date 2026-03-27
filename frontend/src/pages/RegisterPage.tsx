import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import { authService } from '../services/authService';

const RegisterPage = () => {
  const navigate = useNavigate();

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

    if (password.length < 8) {
      setError('Password must contain at least 8 characters.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await authService.register({ email: email.trim(), password });
      navigate('/notes', { replace: true });
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : 'Unable to register.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create account"
      subtitle="Start writing and organizing your notes"
      alternateText="Already registered?"
      alternateTo="/login"
      alternateLabel="Sign in"
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
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="At least 8 characters"
        />

        {error && <p className="error">{error}</p>}

        <button type="submit" className="button" disabled={isLoading}>
          {isLoading ? 'Creating account...' : 'Create account'}
        </button>
      </form>
    </AuthLayout>
  );
};

export default RegisterPage;
