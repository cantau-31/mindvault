import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import AskAiPage from './pages/AskAiPage'
import NotesListPage from './pages/NotesListPage'
import CreateNotePage from './pages/CreateNotePage'
import EditNotePage from './pages/EditNotePage'
import PrivateRoute from './components/PrivateRoute'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/ask" element={<PrivateRoute><AskAiPage /></PrivateRoute>} />
        <Route path="/notes" element={<NotesListPage />} />
        <Route path="/notes/create" element={<CreateNotePage />} />
        <Route path="/notes/:id/edit" element={<EditNotePage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App