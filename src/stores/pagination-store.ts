import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Define the store interface for pagination state
interface PaginationStore {
  // State: the current page number
  currentPage: number
  // Action: function to update the current page
  setCurrentPage: (page: number) => void
  // Action: function to reset to page 1 (optional, useful if needed)
  resetPage: () => void
}

// Create the Zustand store with persistence
// persist middleware saves the state to localStorage automatically
export const usePaginationStore = create<PaginationStore>()(
  persist(
    (set) => ({
      // Initial state - start at page 1
      currentPage: 1,
      
      // Action: Update the current page number
      // This will be called whenever the user navigates to a different page
      setCurrentPage: (page: number) =>
        set({ currentPage: page }),
      
      // Action: Reset to page 1 (useful if you need to reset pagination)
      resetPage: () =>
        set({ currentPage: 1 }),
    }),
    {
      // Configuration for persistence
      name: 'posts-pagination-storage', // Key used in localStorage
      // This ensures the page number persists across page refreshes
    }
  )
)

