import type { PropsWithChildren } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

interface NotesLayoutProps extends PropsWithChildren {
  title: string;
}

const NotesLayout = ({ title, children }: NotesLayoutProps) => {
  const navigate = useNavigate();

  const onLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <main className="page">
      <header className="topbar">
        <Link to="/notes" className="brand">
          MindVault
        </Link>

        <nav className="topbar-nav">
          <Link to="/notes">My notes</Link>
          <Link to="/notes/create">New note</Link>
          <button type="button" className="button button-secondary" onClick={onLogout}>
            Logout
          </button>
        </nav>
      </header>

      <section className="content">
        <h1>{title}</h1>
        {children}
      </section>
    </main>
  );
};

export default NotesLayout;
