import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

interface Message {
  role: 'user' | 'ai'
  text: string
}

const glassCard = {
  background: 'rgba(255,255,255,0.55)',
  backdropFilter: 'blur(16px)',
  border: '1px solid rgba(255,255,255,0.85)',
  borderRadius: '16px',
}

export default function AskAiPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: 'Bonjour ! Pose-moi une question sur tes notes, je vais chercher dans ta base de connaissances.' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const question = input.trim()
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', text: question }])
    setLoading(true)

    try {
      const res = await api.post('/ai/ask', { question })
      setMessages((prev) => [...prev, { role: 'ai', text: res.data.answer }])
    } catch {
      setMessages((prev) => [...prev, { role: 'ai', text: "Erreur lors de la réponse. Réessaie." }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* Navbar */}
      <nav style={{
        background: 'rgba(255,255,255,0.6)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.85)',
        padding: '14px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <span style={{
          fontSize: '20px', fontWeight: '700',
          background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
        }}>MindVault</span>
        <Link to="/dashboard" style={{
          background: 'rgba(255,255,255,0.7)',
          border: '1px solid rgba(148,163,184,0.3)',
          borderRadius: '10px',
          padding: '8px 16px',
          fontSize: '13px',
          color: '#475569',
          textDecoration: 'none',
          fontWeight: '500'
        }}>← Mes notes</Link>
      </nav>

      {/* Zone chat */}
      <div style={{ flex: 1, maxWidth: '720px', width: '100%', margin: '0 auto', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

        <div style={{ textAlign: 'center', marginBottom: '8px' }}>
          <h1 style={{
            fontSize: '22px', fontWeight: '700',
            background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            marginBottom: '4px'
          }}>Assistant IA</h1>
          <p style={{ fontSize: '13px', color: '#94a3b8' }}>Je réponds à tes questions en me basant sur toutes tes notes</p>
        </div>

        {/* Messages */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
          {messages.map((msg, i) => (
            <div key={i} style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
            }}>
              <div style={{
                maxWidth: '80%',
                padding: '12px 16px',
                borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                background: msg.role === 'user'
                  ? 'linear-gradient(135deg, #0ea5e9, #6366f1)'
                  : 'rgba(255,255,255,0.7)',
                backdropFilter: 'blur(12px)',
                border: msg.role === 'user'
                  ? 'none'
                  : '1px solid rgba(255,255,255,0.85)',
                color: msg.role === 'user' ? 'white' : '#1e293b',
                fontSize: '14px',
                lineHeight: '1.6',
                boxShadow: msg.role === 'user'
                  ? '0 4px 16px rgba(99,102,241,0.25)'
                  : '0 2px 8px rgba(0,0,0,0.05)'
              }}>
                {msg.role === 'ai' && (
                  <span style={{
                    display: 'block',
                    fontSize: '11px',
                    fontWeight: '600',
                    background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: '6px',
                    letterSpacing: '0.05em'
                  }}>✨ IA</span>
                )}
                {msg.text}
              </div>
            </div>
          ))}

          {/* Indicateur de chargement */}
          {loading && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{
                padding: '12px 20px',
                borderRadius: '16px 16px 16px 4px',
                background: 'rgba(255,255,255,0.7)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.85)',
                fontSize: '20px',
                letterSpacing: '4px'
              }}>
                <span style={{ animation: 'pulse 1s infinite' }}>···</span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSend} style={{
          ...glassCard,
          padding: '12px',
          display: 'flex',
          gap: '10px',
          alignItems: 'center',
          position: 'sticky',
          bottom: '24px'
        }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Pose une question sur tes notes..."
            disabled={loading}
            style={{
              flex: 1,
              padding: '10px 16px',
              borderRadius: '10px',
              border: '1px solid rgba(148,163,184,0.3)',
              background: 'rgba(255,255,255,0.8)',
              fontSize: '14px',
              color: '#1e293b',
              outline: 'none'
            }}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            style={{
              background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
              opacity: loading || !input.trim() ? 0.6 : 1,
              whiteSpace: 'nowrap'
            }}
          >
            Envoyer →
          </button>
        </form>
      </div>
    </div>
  )
}