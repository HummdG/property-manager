import { create } from 'zustand'

export const useUIStore = create((set) => ({
  isSidebarOpen: true,
  isSidebarCollapsed: false,
  modals: {
    createProperty: false,
    editProperty: false,
    createServiceRequest: false,
    assignJob: false,
    confirmDelete: false,
  },
  modalData: null,

  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
  toggleSidebarCollapse: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
  setSidebarCollapsed: (isCollapsed) => set({ isSidebarCollapsed: isCollapsed }),

  openModal: (modalName, data = null) =>
    set((state) => ({
      modals: { ...state.modals, [modalName]: true },
      modalData: data,
    })),

  closeModal: (modalName) =>
    set((state) => ({
      modals: { ...state.modals, [modalName]: false },
      modalData: null,
    })),

  closeAllModals: () =>
    set({
      modals: {
        createProperty: false,
        editProperty: false,
        createServiceRequest: false,
        assignJob: false,
        confirmDelete: false,
      },
      modalData: null,
    }),
}))

