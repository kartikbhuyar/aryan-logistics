import type { LogisticsEntry } from '../types';

const STORAGE_KEY = 'logistics_entries';

export const saveEntries = (entries: LogisticsEntry[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
};

export const loadEntries = (): LogisticsEntry[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const addEntry = (entry: Omit<LogisticsEntry, 'id' | 'createdAt'>): LogisticsEntry => {
  const entries = loadEntries();
  const newEntry: LogisticsEntry = {
    ...entry,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  
  entries.push(newEntry);
  saveEntries(entries);
  return newEntry;
};

export const updateEntry = (id: string, updates: Partial<LogisticsEntry>): void => {
  const entries = loadEntries();
  const index = entries.findIndex(entry => entry.id === id);
  if (index !== -1) {
    entries[index] = { ...entries[index], ...updates };
    saveEntries(entries);
  }
};

export const deleteEntry = (id: string): void => {
  const entries = loadEntries();
  const filtered = entries.filter(entry => entry.id !== id);
  saveEntries(filtered);
};

const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};