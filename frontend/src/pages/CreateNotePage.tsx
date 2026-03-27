import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { noteService } from '../services/noteService'
import type { NotePayload } from '../types/note'
import { useAuth } from '../context/AuthContext'

const glassCard = {
  background: 'rgba(14,165,233,0.15)',
  backdropFilter: 'blur(16px)',
  border: '1px solid rgba(255,255,255,0.85)',
  borderRadius: '16px',
}

const CreateNotePage = () => {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    try {
      const payload: NotePayload = {
        title,
        content,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean)
      }
      await noteService.create(payload)
      navigate('/notes')
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : 'Unable to create note.'
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', padding: '0 0 40px' }}>

      {/* Navbar */}
      <nav style={{
        ...glassCard,
        borderRadius: '0',
        borderLeft: 'none', borderRight: 'none', borderTop: 'none',
        padding: '14px 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: '32px', position: 'sticky', top: 0, zIndex: 100
      }}>
        <span style={{
          fontSize: '20px', fontWeight: '700',
          background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
        }}>MindVault</span>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Link to="/notes" style={{
            background: 'rgba(255,255,255,0.7)',
            border: '1px solid rgba(148,163,184,0.3)',
            borderRadius: '10px', padding: '8px 16px',
            fontSize: '13px', color: '#475569',
            textDecoration: 'none', fontWeight: '500'
          }}>← Mes notes</Link>
          <button onClick={() => { logout(); navigate('/') }} style={{
            background: 'none', border: 'none',
            color: '#64748b', fontSize: '13px', cursor: 'pointer'
          }}>Déconnexion</button>
        </div>
      </nav>

      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '0 24px' }}>
        <h1 style={{
          fontSize: '22px', fontWeight: '700',
          background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          marginBottom: '24px'
        }}>Nouvelle note</h1>

        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.3)',
            color: '#dc2626', padding: '12px 16px',
            borderRadius: '10px', marginBottom: '20px', fontSize: '13px'
          }}>{error}</div>
        )}

        <form onSubmit={handleSubmit} style={{
          ...glassCard, padding: '28px',
          display: 'flex', flexDirection: 'column', gap: '16px'
        }}>
          <div>
            <label style={{ fontSize: '13px', color: '#475569', marginBottom: '6px', display: 'block' }}>
              Titre
            </label>
            <input
              type="text" value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titre de la note" required
              style={{
                width: '100%', padding: '11px 16px', borderRadius: '10px',
                border: '1px solid rgba(148,163,184,0.4)',
                background: 'rgba(255,255,255,0.7)',
                fontSize: '14px', color: '#1e293b', outline: 'none'
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '13px', color: '#475569', marginBottom: '6px', display: 'block' }}>
              Contenu
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Écris ta note ici..." rows={8} required
              style={{
                width: '100%', padding: '11px 16px', borderRadius: '10px',
                border: '1px solid rgba(148,163,184,0.4)',
                background: 'rgba(255,255,255,0.7)',
                fontSize: '14px', color: '#1e293b',
                outline: 'none', resize: 'none'
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '13px', color: '#475569', marginBottom: '6px', display: 'block' }}>
              Tags (séparés par des virgules)
            </label>
            <input
              type="text" value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="react, nestjs, api"
              style={{
                width: '100%', padding: '11px 16px', borderRadius: '10px',
                border: '1px solid rgba(148,163,184,0.4)',
                background: 'rgba(255,255,255,0.7)',
                fontSize: '14px', color: '#1e293b', outline: 'none'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
            <button type="submit" disabled={isSubmitting} style={{
              background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
              color: 'white', border: 'none',
              padding: '11px 24px', borderRadius: '10px',
              fontSize: '13px', fontWeight: '600',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              opacity: isSubmitting ? 0.7 : 1
            }}>
              {isSubmitting ? 'Création...' : 'Créer la note'}
            </button>
            <button type="button" onClick={() => navigate('/notes')} style={{
              background: 'rgba(255,255,255,0.7)',
              border: '1px solid rgba(148,163,184,0.3)',
              color: '#64748b', padding: '11px 24px',
              borderRadius: '10px', fontSize: '13px', cursor: 'pointer'
            }}>Annuler</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateNotePage