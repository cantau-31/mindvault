import { Link } from 'react-router-dom';
import type { PropsWithChildren } from 'react';

interface AuthLayoutProps extends PropsWithChildren {
  title: string;
  subtitle: string;
  alternateText: string;
  alternateTo: string;
  alternateLabel: string;
}

const AuthLayout = ({
  title,
  subtitle,
  alternateText,
  alternateTo,
  alternateLabel,
  children,
}: AuthLayoutProps) => {
  return (
    <main className="page auth-page">
      <section className="card auth-card">
        <h1>{title}</h1>
        <p className="muted">{subtitle}</p>
        {children}
        <p className="auth-switch">
          {alternateText} <Link to={alternateTo}>{alternateLabel}</Link>
        </p>
      </section>
    </main>
  );
};

export default AuthLayout;
