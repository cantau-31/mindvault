import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const response = await api.post('/auth/login', { email, password })
      login(response.data.access_token)
      navigate('/dashboard')
    } catch (err) {
      setError('Email ou mot de passe incorrect')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.55)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.85)',
        borderRadius: '20px',
        padding: '40px',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 8px 32px rgba(14,165,233,0.1)'
      }}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: '700',
          color: 'white',
          marginBottom: '6px'
        }}>MindVault</h1>
        <p style={{ color: '#64748b', marginBottom: '32px', fontSize: '14px' }}>
          Connecte-toi à ta base de connaissances
        </p>

        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.3)',
            color: '#dc2626',
            padding: '12px 16px',
            borderRadius: '10px',
            marginBottom: '20px',
            fontSize: '13px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '13px', color: '#475569', marginBottom: '6px', display: 'block' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ton@email.com"
              required
              style={{
                width: '100%', padding: '12px 16px',
                borderRadius: '10px',
                border: '1px solid rgba(148,163,184,0.4)',
                background: 'rgba(255,255,255,0.7)',
                fontSize: '14px', color: '#1e293b', outline: 'none'
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '13px', color: '#475569', marginBottom: '6px', display: 'block' }}>
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: '100%', padding: '12px 16px',
                borderRadius: '10px',
                border: '1px solid rgba(148,163,184,0.4)',
                background: 'rgba(255,255,255,0.7)',
                fontSize: '14px', color: '#1e293b', outline: 'none'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
              color: 'white', border: 'none',
              padding: '13px', borderRadius: '10px',
              fontSize: '14px', fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1, marginTop: '4px'
            }}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: '#f3f8ff' }}>
          Pas encore de compte ?{' '}
          <Link to="/register" style={{ color: '#6366f1', textDecoration: 'none', fontWeight: '500' }}>
            S'inscrire
          </Link>
        </p>
      </div>
    </div>
  )
}