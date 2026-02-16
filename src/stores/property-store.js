import { create } from 'zustand'

export const usePropertyStore = create((set, get) => ({
  properties: [],
  selectedProperty: null,
  isLoading: false,
  error: null,

  setProperties: (properties) => set({ properties }),
  addProperty: (property) => set((state) => ({ properties: [property, ...state.properties] })),
  updateProperty: (id, updates) =>
    set((state) => ({
      properties: state.properties.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    })),
  removeProperty: (id) =>
    set((state) => ({ properties: state.properties.filter((p) => p.id !== id) })),
  setSelectedProperty: (property) => set({ selectedProperty: property }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  getPropertyById: (id) => get().properties.find((p) => p.id === id),
}))



