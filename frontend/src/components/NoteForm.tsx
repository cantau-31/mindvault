import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import type { Note, NotePayload } from '../types/note';

interface NoteFormProps {
  initialNote?: Note;
  isSubmitting: boolean;
  onSubmit: (payload: NotePayload) => Promise<void>;
  submitLabel: string;
}

interface FormErrors {
  title?: string;
  content?: string;
}

const toTagArray = (raw: string): string[] =>
  raw
    .split(',')
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);

const NoteForm = ({ initialNote, isSubmitting, onSubmit, submitLabel }: NoteFormProps) => {
  const [title, setTitle] = useState(initialNote?.title ?? '');
  const [content, setContent] = useState(initialNote?.content ?? '');
  const [tagsInput, setTagsInput] = useState(initialNote?.tags.join(', ') ?? '');
  const [errors, setErrors] = useState<FormErrors>({});

  const hasErrors = useMemo(() => Object.keys(errors).length > 0, [errors]);

  const validate = (): FormErrors => {
    const nextErrors: FormErrors = {};

    if (!title.trim()) {
      nextErrors.title = 'Title is required.';
    }

    if (!content.trim()) {
      nextErrors.content = 'Content is required.';
    }

    return nextErrors;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    await onSubmit({
      title: title.trim(),
      content: content.trim(),
      tags: toTagArray(tagsInput),
    });
  };

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <label htmlFor="title">Title</label>
      <input
        id="title"
        name="title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Example: Weekly review"
      />
      {errors.title && <p className="error">{errors.title}</p>}

      <label htmlFor="content">Content</label>
      <textarea
        id="content"
        name="content"
        rows={10}
        value={content}
        onChange={(event) => setContent(event.target.value)}
        placeholder="Write your note here..."
      />
      {errors.content && <p className="error">{errors.content}</p>}

      <label htmlFor="tags">Tags (comma-separated)</label>
      <input
        id="tags"
        name="tags"
        value={tagsInput}
        onChange={(event) => setTagsInput(event.target.value)}
        placeholder="study, backend, ideas"
      />

      <button type="submit" className="button" disabled={isSubmitting || hasErrors}>
        {isSubmitting ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
};

export default NoteForm;
