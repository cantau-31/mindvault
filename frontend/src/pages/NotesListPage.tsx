import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import NotesLayout from '../components/NotesLayout';
import { noteService } from '../services/noteService';
import type { Note } from '../types/note';

const NotesListPage = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadNotes = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await noteService.getAll();
      setNotes(data);
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : 'Unable to load notes.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadNotes();
  }, []);

  const filteredNotes = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return notes;
    }

    return notes.filter((note) => {
      const inTitle = note.title.toLowerCase().includes(query);
      const inContent = note.content.toLowerCase().includes(query);
      const inTags = note.tags.some((tag) => tag.toLowerCase().includes(query));
      return inTitle || inContent || inTags;
    });
  }, [notes, search]);

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('Delete this note?');
    if (!confirmed) {
      return;
    }

    try {
      await noteService.remove(id);
      setNotes((current) => current.filter((note) => note._id !== id));
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : 'Unable to delete note.';
      setError(message);
    }
  };

  return (
    <NotesLayout title="My notes">
      <div className="toolbar">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by title, content, or tag"
          aria-label="Search notes"
        />
        <Link className="button" to="/notes/create">
          Create note
        </Link>
      </div>

      {error && <p className="error">{error}</p>}
      {isLoading && <p className="muted">Loading notes...</p>}

      {!isLoading && filteredNotes.length === 0 && (
        <p className="muted">No notes found. Create your first note.</p>
      )}

      <section className="note-grid">
        {filteredNotes.map((note) => (
          <article key={note._id} className="note-card">
            <h2>{note.title}</h2>
            <p className="note-content">{note.content}</p>

            {note.tags.length > 0 && (
              <p className="tags">
                {note.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </p>
            )}

            <div className="actions">
              <Link className="button button-secondary" to={`/notes/${note._id}/edit`}>
                Edit
              </Link>
              <button
                type="button"
                className="button button-danger"
                onClick={() => void handleDelete(note._id)}
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </section>
    </NotesLayout>
  );
};

export default NotesListPage;
