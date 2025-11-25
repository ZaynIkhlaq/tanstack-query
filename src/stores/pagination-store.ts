import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface PaginationStore {

  currentPage: number

  setCurrentPage: (page: number) => void
  resetPage: () => void
}


// persist middleware saves the state to localStorage automatically
export const usePaginationStore = create<PaginationStore>()(
  persist(
    (set) => ({
      // start at page 1
      currentPage: 1,

      setCurrentPage: (page: number) =>
        set({ currentPage: page }),
      
      resetPage: () =>
        set({ currentPage: 1 }),
    }),
    {
      
      name: 'posts-pagination-storage', // key used in localStorage
      
    }
  )
)

