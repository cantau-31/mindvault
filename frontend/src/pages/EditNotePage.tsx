import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import NoteForm from '../components/NoteForm';
import NotesLayout from '../components/NotesLayout';
import { noteService } from '../services/noteService';
import type { Note, NotePayload } from '../types/note';

const EditNotePage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [note, setNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadNote = async () => {
      if (!id) {
        setError('Missing note id.');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const data = await noteService.getById(id);
        setNote(data);
      } catch (requestError) {
        const message = requestError instanceof Error ? requestError.message : 'Unable to load note.';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    void loadNote();
  }, [id]);

  const handleUpdate = async (payload: NotePayload) => {
    if (!id) {
      setError('Missing note id.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await noteService.update(id, payload);
      navigate('/notes');
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : 'Unable to update note.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <NotesLayout title="Edit note">
      {error && <p className="error">{error}</p>}
      {isLoading && <p className="muted">Loading note...</p>}
      {!isLoading && note && (
        <NoteForm
          initialNote={note}
          isSubmitting={isSubmitting}
          onSubmit={handleUpdate}
          submitLabel="Save changes"
        />
      )}
    </NotesLayout>
  );
};

export default EditNotePage;
