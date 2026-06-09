import { create } from 'zustand';

export const useAppStore = create((set) => ({
  searchResults: [],
  setSearchResults: (results) => set({ searchResults: results }),
  
  selectedRepo: null,
  setSelectedRepo: (repo) => set({ selectedRepo: repo }),
  
  analysisData: null,
  setAnalysisData: (data) => set({ analysisData: data }),
  
  chatHistory: [],
  addChatMessage: (message) =>
    set((state) => ({
      chatHistory: [...state.chatHistory, message],
    })),
  clearChatHistory: () => set({ chatHistory: [] }),
  
  favorites: [],
  addFavorite: (repo) =>
    set((state) => ({
      favorites: [...state.favorites, repo],
    })),
  removeFavorite: (repoId) =>
    set((state) => ({
      favorites: state.favorites.filter((r) => r.id !== repoId),
    })),
}));
