import { create } from 'zustand'

export const useAgentStore = create((set, get) => ({
  // Inquiries state
  inquiries: [],
  selectedInquiry: null,
  inquiryFilters: {
    type: 'all',
    status: 'all',
    search: ''
  },
  inquiriesLoading: false,
  inquiriesPagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  },

  // Daily logs state
  dailyLogs: [],
  logsLoading: false,
  logFilters: {
    type: 'all',
    dateFrom: null,
    dateTo: null
  },
  logsPagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  },

  // Location tracking state
  locations: [],
  locationsLoading: false,
  isTrackingLocation: false,
  lastLocation: null,

  // Subscription state
  subscription: null,
  plans: [],
  tcAccepted: false,
  subscriptionLoading: false,

  // Inquiry actions
  setInquiries: (inquiries) => set({ inquiries }),
  addInquiry: (inquiry) => set((state) => ({
    inquiries: [inquiry, ...state.inquiries]
  })),
  updateInquiry: (id, updates) => set((state) => ({
    inquiries: state.inquiries.map((i) => (i.id === id ? { ...i, ...updates } : i))
  })),
  removeInquiry: (id) => set((state) => ({
    inquiries: state.inquiries.filter((i) => i.id !== id)
  })),
  setSelectedInquiry: (inquiry) => set({ selectedInquiry: inquiry }),
  setInquiryFilters: (filters) => set((state) => ({
    inquiryFilters: { ...state.inquiryFilters, ...filters }
  })),
  setInquiriesLoading: (loading) => set({ inquiriesLoading: loading }),
  setInquiriesPagination: (pagination) => set({ inquiriesPagination: pagination }),
  getInquiryById: (id) => get().inquiries.find((i) => i.id === id),

  // Daily logs actions
  setDailyLogs: (logs) => set({ dailyLogs: logs }),
  addDailyLog: (log) => set((state) => ({
    dailyLogs: [log, ...state.dailyLogs]
  })),
  setLogsLoading: (loading) => set({ logsLoading: loading }),
  setLogFilters: (filters) => set((state) => ({
    logFilters: { ...state.logFilters, ...filters }
  })),
  setLogsPagination: (pagination) => set({ logsPagination: pagination }),

  // Location actions
  setLocations: (locations) => set({ locations }),
  addLocation: (location) => set((state) => ({
    locations: [...state.locations, location],
    lastLocation: location
  })),
  setLocationsLoading: (loading) => set({ locationsLoading: loading }),
  setIsTrackingLocation: (isTracking) => set({ isTrackingLocation: isTracking }),
  setLastLocation: (location) => set({ lastLocation: location }),

  // Subscription actions
  setSubscription: (subscription) => set({ subscription }),
  setPlans: (plans) => set({ plans }),
  setTcAccepted: (accepted) => set({ tcAccepted: accepted }),
  setSubscriptionLoading: (loading) => set({ subscriptionLoading: loading }),

  // Reset state
  resetInquiries: () => set({
    inquiries: [],
    selectedInquiry: null,
    inquiryFilters: { type: 'all', status: 'all', search: '' },
    inquiriesPagination: { page: 1, limit: 10, total: 0, totalPages: 0 }
  }),
  resetLogs: () => set({
    dailyLogs: [],
    logFilters: { type: 'all', dateFrom: null, dateTo: null },
    logsPagination: { page: 1, limit: 20, total: 0, totalPages: 0 }
  }),
  resetAll: () => set({
    inquiries: [],
    selectedInquiry: null,
    inquiryFilters: { type: 'all', status: 'all', search: '' },
    inquiriesPagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
    dailyLogs: [],
    logFilters: { type: 'all', dateFrom: null, dateTo: null },
    logsPagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
    locations: [],
    isTrackingLocation: false,
    lastLocation: null,
    subscription: null,
    plans: [],
    tcAccepted: false
  })
}))

