export interface Note {
  _id: string;
  userId: string;
  title: string;
  content: string;
  tags: string[];
  collectionId?: string | null;
  shareToken?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface NotePayload {
  title: string;
  content: string;
  tags: string[];
}
