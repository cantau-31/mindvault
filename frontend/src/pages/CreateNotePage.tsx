import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NoteForm from '../components/NoteForm';
import NotesLayout from '../components/NotesLayout';
import { noteService } from '../services/noteService';
import type { NotePayload } from '../types/note';

const CreateNotePage = () => {
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async (payload: NotePayload) => {
    setIsSubmitting(true);
    setError(null);

    try {
      await noteService.create(payload);
      navigate('/notes');
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : 'Unable to create note.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <NotesLayout title="Create note">
      {error && <p className="error">{error}</p>}
      <NoteForm isSubmitting={isSubmitting} onSubmit={handleCreate} submitLabel="Create note" />
    </NotesLayout>
  );
};

export default CreateNotePage;
