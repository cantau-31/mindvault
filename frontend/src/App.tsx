import { Navigate, Route, Routes } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotesListPage from './pages/NotesListPage';
import CreateNotePage from './pages/CreateNotePage';
import EditNotePage from './pages/EditNotePage';
import { authService } from './services/authService';

const App = () => {
  const isAuthenticated = authService.isAuthenticated();

  return (
    <Routes>
      <Route path="/" element={<Navigate to={isAuthenticated ? '/notes' : '/login'} replace />} />
      <Route path="/login" element={isAuthenticated ? <Navigate to="/notes" replace /> : <LoginPage />} />
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to="/notes" replace /> : <RegisterPage />}
      />

      <Route element={<PrivateRoute />}>
        <Route path="/notes" element={<NotesListPage />} />
        <Route path="/notes/create" element={<CreateNotePage />} />
        <Route path="/notes/:id/edit" element={<EditNotePage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
