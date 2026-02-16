import { create } from 'zustand'

export const useServiceRequestStore = create((set, get) => ({
  serviceRequests: [],
  selectedRequest: null,
  categories: [],
  isLoading: false,
  error: null,

  setServiceRequests: (serviceRequests) => set({ serviceRequests }),
  addServiceRequest: (request) =>
    set((state) => ({ serviceRequests: [request, ...state.serviceRequests] })),
  updateServiceRequest: (id, updates) =>
    set((state) => ({
      serviceRequests: state.serviceRequests.map((r) => (r.id === id ? { ...r, ...updates } : r)),
    })),
  setSelectedRequest: (request) => set({ selectedRequest: request }),
  setCategories: (categories) => set({ categories }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  getRequestById: (id) => get().serviceRequests.find((r) => r.id === id),
}))



