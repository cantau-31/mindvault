import api from './api';
import type { Note, NotePayload } from '../types/note';

const normalizeTags = (tags: string[]) =>
  tags.map((tag) => tag.trim()).filter((tag) => tag.length > 0);

export const noteService = {
  async getAll(search?: string): Promise<Note[]> {
    const params = search ? { search } : undefined;
    const response = await api.get<Note[]>('/notes', { params });
    return response.data;
  },

  async getById(id: string): Promise<Note> {
    const response = await api.get<Note>(`/notes/${id}`);
    return response.data;
  },

  async create(payload: NotePayload): Promise<Note> {
    const response = await api.post<Note>('/notes', {
      ...payload,
      tags: normalizeTags(payload.tags),
    });
    return response.data;
  },

  async update(id: string, payload: NotePayload): Promise<Note> {
    const response = await api.patch<Note>(`/notes/${id}`, {
      ...payload,
      tags: normalizeTags(payload.tags),
    });
    return response.data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/notes/${id}`);
  },
};
