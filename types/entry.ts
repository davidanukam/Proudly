export interface Entry {
  id: string;
  date: string; // ISO string
  text: string;
  media?: string[]; // URLs or base64 strings
  tags?: string[];
  isPrivate: boolean;
  createdAt: string; // ISO string
}

export interface EntryFormData {
  text: string;
  media?: string[];
  tags?: string[];
  isPrivate: boolean;
}
