import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { noteService } from '../services/noteService'
import type { Note } from '../types/note'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const glassCard = {
  background: 'rgba(14,165,233,0.15)',
  backdropFilter: 'blur(16px)',
  border: '1px solid rgba(255,255,255,0.85)',
  borderRadius: '16px',
}

const NotesListPage = () => {
  const [notes, setNotes] = useState<Note[]>([])
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { logout } = useAuth()
  const navigate = useNavigate()

  const loadNotes = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await noteService.getAll()
      setNotes(data)
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : 'Unable to load notes.'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { void loadNotes() }, [])

  const filteredNotes = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return notes
    return notes.filter((note) => {
      const inTitle = note.title.toLowerCase().includes(query)
      const inContent = note.content.toLowerCase().includes(query)
      const inTags = note.tags.some((tag) => tag.toLowerCase().includes(query))
      return inTitle || inContent || inTags
    })
  }, [notes, search])

  const handleDelete = async (id: string) => {
    if (!window.confirm('Supprimer cette note ?')) return
    try {
      await noteService.remove(id)
      setNotes((current) => current.filter((note) => note._id !== id))
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : 'Unable to delete note.'
      setError(message)
    }
  }

  const handleLogout = () => { logout(); navigate('/') }

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
          <Link to="/dashboard" style={{
            background: 'rgba(255,255,255,0.7)',
            border: '1px solid rgba(148,163,184,0.3)',
            borderRadius: '10px', padding: '8px 16px',
            fontSize: '13px', color: '#475569',
            textDecoration: 'none', fontWeight: '500'
          }}>← Dashboard</Link>
          <Link to="/notes/create" style={{
            background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
            color: 'white', border: 'none',
            padding: '8px 18px', borderRadius: '10px',
            fontSize: '13px', fontWeight: '600', textDecoration: 'none'
          }}>+ Nouvelle note</Link>
          <button onClick={handleLogout} style={{
            background: 'none', border: 'none',
            color: '#64748b', fontSize: '13px', cursor: 'pointer'
          }}>Déconnexion</button>
        </div>
      </nav>

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '0 24px' }}>

        {/* Recherche */}
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher par titre, contenu ou tag..."
          style={{
            width: '100%', padding: '13px 18px',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.85)',
            background: 'rgba(255,255,255,0.6)',
            backdropFilter: 'blur(12px)',
            fontSize: '14px', color: '#334155',
            outline: 'none', marginBottom: '24px'
          }}
        />

        {/* Erreur */}
        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.3)',
            color: '#dc2626', padding: '12px 16px',
            borderRadius: '10px', marginBottom: '20px', fontSize: '13px'
          }}>{error}</div>
        )}

        {/* Chargement */}
        {isLoading && (
          <p style={{ textAlign: 'center', color: '#94a3b8', marginTop: '60px' }}>
            Chargement...
          </p>
        )}

        {/* Aucune note */}
        {!isLoading && filteredNotes.length === 0 && (
          <div style={{
            ...glassCard,
            padding: '60px 20px', textAlign: 'center',
            border: '1px dashed rgba(148,163,184,0.5)'
          }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>📭</div>
            <p style={{ fontSize: '16px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
              Aucune note trouvée
            </p>
            <p style={{ fontSize: '13px', color: '#94a3b8' }}>
              Crée ta première note !
            </p>
          </div>
        )}

        {/* Liste des notes */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '16px' }}>
          {filteredNotes.map((note) => (
            <div key={note._id} style={{ ...glassCard, padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <h2 style={{ fontSize: '15px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>
                    {note.title}
                  </h2>
                  <p style={{
                    fontSize: '13px', color: '#64748b', lineHeight: '1.6',
                    overflow: 'hidden', display: '-webkit-box',
                    WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' as const
                  }}>{note.content}</p>

                  {note.tags.length > 0 && (
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '12px' }}>
                      {note.tags.map((tag) => (
                        <span key={tag} style={{
                          background: 'linear-gradient(135deg, rgba(14,165,233,0.12), rgba(99,102,241,0.12))',
                          color: '#6366f1', fontSize: '11px',
                          padding: '3px 10px', borderRadius: '20px',
                          border: '1px solid rgba(99,102,241,0.25)', fontWeight: '500'
                        }}>#{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div style={{
                display: 'flex', gap: '8px', marginTop: '16px',
                paddingTop: '16px', borderTop: '1px solid rgba(148,163,184,0.2)'
              }}>
                <Link to={`/notes/${note._id}/edit`} style={{
                  background: 'rgba(255,255,255,0.7)',
                  border: '1px solid rgba(148,163,184,0.3)',
                  borderRadius: '8px', padding: '5px 12px',
                  fontSize: '12px', color: '#475569',
                  textDecoration: 'none', fontWeight: '500'
                }}>✏️ Éditer</Link>
                <button
                  onClick={() => void handleDelete(note._id)}
                  style={{
                    background: 'rgba(239,68,68,0.08)',
                    border: '1px solid rgba(239,68,68,0.2)',
                    borderRadius: '8px', padding: '5px 12px',
                    fontSize: '12px', color: '#dc2626',
                    cursor: 'pointer', fontWeight: '500'
                  }}>🗑️ Supprimer</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default NotesListPage