import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import api from '../api/axios'


interface Note {
  _id: string
  title: string
  content: string
  tags: string[]
  createdAt: string
}

const glassCard = {
  background: 'rgba(255,255,255,0.55)',
  backdropFilter: 'blur(16px)',
  border: '1px solid rgba(255,255,255,0.85)',
  borderRadius: '16px',
}

export default function DashboardPage() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newContent, setNewContent] = useState('')
  const [aiResult, setAiResult] = useState<{ noteId: string; text: string } | null>(null)
  const [aiLoading, setAiLoading] = useState<string | null>(null)

  const fetchNotes = async () => {
    try {
      const url = search ? `/notes/search?q=${search}` : '/notes'
      const res = await api.get(url)
      setNotes(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchNotes() }, [search])

  const handleLogout = () => { logout(); navigate('/') }

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.post('/notes', { title: newTitle, content: newContent, tags: [] })
      setNewTitle(''); setNewContent(''); setShowForm(false)
      fetchNotes()
    } catch (err) { console.error(err) }
  }

  const handleDelete = async (id: string) => {
    try { await api.delete(`/notes/${id}`); fetchNotes() }
    catch (err) { console.error(err) }
  }

  const handleSummarize = async (noteId: string) => {
    setAiLoading(noteId); setAiResult(null)
    try {
      const res = await api.post(`/notes/${noteId}/summarize`)
      setAiResult({ noteId, text: res.data.summary })
    } catch { setAiResult({ noteId, text: 'Erreur lors du résumé.' }) }
    finally { setAiLoading(null) }
  }

  const handleSuggestTags = async (noteId: string) => {
    setAiLoading(noteId); setAiResult(null)
    try {
      const res = await api.post(`/notes/${noteId}/suggest-tags`)
      setAiResult({ noteId, text: '🏷️ Tags suggérés : ' + res.data.tags.join(', ') })
    } catch { setAiResult({ noteId, text: 'Erreur lors de la suggestion.' }) }
    finally { setAiLoading(null) }
  }

  return (
    <div style={{ minHeight: '100vh', padding: '0 0 40px' }}>

      {/* Navbar */}
      <nav style={{
        ...glassCard,
        borderRadius: '0',
        borderLeft: 'none', borderRight: 'none', borderTop: 'none',
        padding: '14px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '32px',
        position: 'sticky',
        top: 0,
        zIndex: 100
        }}>
        <span style={{
            fontSize: '20px', fontWeight: '700',
            background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
        }}>MindVault</span>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <Link to="/ask" style={{
            background: 'rgba(255,255,255,0.7)',
            border: '1px solid rgba(148,163,184,0.3)',
            borderRadius: '10px',
            padding: '8px 16px',
            fontSize: '13px',
            color: '#475569',
            textDecoration: 'none',
            fontWeight: '500'
            }}>✨ Demander à l'IA</Link>
            <button
            onClick={() => setShowForm(!showForm)}
            style={{
                background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
                color: 'white', border: 'none',
                padding: '8px 18px', borderRadius: '10px',
                fontSize: '13px', fontWeight: '600', cursor: 'pointer'
            }}
            >+ Nouvelle note</button>
            <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '13px', cursor: 'pointer' }}>
            Déconnexion
            </button>
        </div>
        </nav>

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '0 24px' }}>

        {/* Recherche */}
        <input
          type="text"
          placeholder="Rechercher une note..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
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

        {/* Formulaire création */}
        {showForm && (
          <form onSubmit={handleCreateNote} style={{
            ...glassCard,
            padding: '24px',
            marginBottom: '24px',
            display: 'flex', flexDirection: 'column', gap: '14px'
          }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b' }}>Nouvelle note</h2>
            <input
              type="text" placeholder="Titre" value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)} required
              style={{
                padding: '11px 16px', borderRadius: '10px',
                border: '1px solid rgba(148,163,184,0.4)',
                background: 'rgba(255,255,255,0.7)',
                fontSize: '14px', color: '#1e293b', outline: 'none'
              }}
            />
            <textarea
              placeholder="Contenu (Markdown supporté)" value={newContent}
              onChange={(e) => setNewContent(e.target.value)} rows={4} required
              style={{
                padding: '11px 16px', borderRadius: '10px',
                border: '1px solid rgba(148,163,184,0.4)',
                background: 'rgba(255,255,255,0.7)',
                fontSize: '14px', color: '#1e293b',
                outline: 'none', resize: 'none'
              }}
            />
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" style={{
                background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
                color: 'white', border: 'none',
                padding: '9px 22px', borderRadius: '10px',
                fontSize: '13px', fontWeight: '600', cursor: 'pointer'
              }}>Créer</button>
              <button type="button" onClick={() => setShowForm(false)} style={{
                background: 'rgba(255,255,255,0.7)',
                border: '1px solid rgba(148,163,184,0.3)',
                color: '#64748b', padding: '9px 22px',
                borderRadius: '10px', fontSize: '13px', cursor: 'pointer'
              }}>Annuler</button>
            </div>
          </form>
        )}

        {/* États */}
        {loading ? (
          <p style={{ textAlign: 'center', color: '#94a3b8', marginTop: '60px' }}>Chargement...</p>
        ) : notes.length === 0 ? (
          <div style={{
            ...glassCard,
            padding: '60px 20px',
            textAlign: 'center',
            border: '1px dashed rgba(148,163,184,0.5)'
          }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>📭</div>
            <p style={{ fontSize: '16px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
              Aucune note pour l'instant
            </p>
            <p style={{ fontSize: '13px', color: '#94a3b8' }}>
              Clique sur "+ Nouvelle note" pour commencer
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '16px' }}>
            {notes.map((note) => (
              <div key={note._id} style={{ ...glassCard, padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <h2 style={{ fontSize: '15px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>
                      {note.title}
                    </h2>
                    <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.6',
                      overflow: 'hidden', display: '-webkit-box',
                      WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' as const
                    }}>
                      {note.content}
                    </p>
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
                  <button onClick={() => handleDelete(note._id)} style={{
                    background: 'none', border: 'none',
                    color: '#cbd5e1', cursor: 'pointer', fontSize: '14px'
                  }}>🗑️</button>
                </div>

                {/* Boutons IA */}
                <div style={{
                  display: 'flex', gap: '8px', marginTop: '16px',
                  paddingTop: '16px', borderTop: '1px solid rgba(148,163,184,0.2)'
                }}>
                  <button onClick={() => handleSummarize(note._id)} disabled={aiLoading === note._id}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '5px',
                      background: 'rgba(255,255,255,0.7)',
                      border: '1px solid rgba(148,163,184,0.3)',
                      borderRadius: '8px', padding: '5px 12px',
                      fontSize: '12px', color: '#475569',
                      cursor: 'pointer', fontWeight: '500'
                    }}>
                    {aiLoading === note._id ? '⏳' : '✨'} Résumer
                  </button>
                  <button onClick={() => handleSuggestTags(note._id)} disabled={aiLoading === note._id}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '5px',
                      background: 'rgba(255,255,255,0.7)',
                      border: '1px solid rgba(148,163,184,0.3)',
                      borderRadius: '8px', padding: '5px 12px',
                      fontSize: '12px', color: '#475569',
                      cursor: 'pointer', fontWeight: '500'
                    }}>
                    {aiLoading === note._id ? '⏳' : '🏷️'} Suggest tags
                  </button>
                </div>

                {/* Résultat IA */}
                {aiResult?.noteId === note._id && (
                  <div style={{
                    marginTop: '12px',
                    background: 'linear-gradient(135deg, rgba(14,165,233,0.08), rgba(99,102,241,0.08))',
                    border: '1px solid rgba(99,102,241,0.25)',
                    borderRadius: '10px', padding: '12px',
                    fontSize: '12px', color: '#4f46e5', lineHeight: '1.6'
                  }}>
                    {aiResult.text}
                    <button onClick={() => setAiResult(null)} style={{
                      display: 'block', marginTop: '8px',
                      background: 'none', border: 'none',
                      color: '#94a3b8', fontSize: '11px', cursor: 'pointer'
                    }}>Fermer</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}