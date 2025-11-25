import { create } from 'zustand'
import { persist } from 'zustand/middleware'


interface FormData {
  title: string
  body: string
  userId: number
}

// form interface
interface FormStore {

  formData: FormData // assigning the schema
  setTitle: (title: string) => void
  setBody: (body: string) => void
  setUserId: (userId: number) => void
  setFormData: (data: FormData) => void
  
  clearForm: () => void
}


// persist middleware saves the state to localStorage (browser) automatically - we can check this manually using the react devtools extension.
export const useFormStore = create<FormStore>()(
  persist(
    (set) => ({
      formData: {
        title: '',
        body: '',
        userId: 1,
      },
      
    
      setTitle: (title: string) =>
        set((state) => ({
          formData: { ...state.formData, title },
        })),
      
   
      setBody: (body: string) =>
        set((state) => ({
          formData: { ...state.formData, body },
        })),
      

      setUserId: (userId: number) =>
        set((state) => ({
          formData: { ...state.formData, userId },
        })),
      

      setFormData: (data: FormData) =>
        set({ formData: data }),

      clearForm: () =>
        set({
          formData: {
            title: '',
            body: '',
            userId: 1,
          },
        }),
    }),
    {
      name: 'post-form-storage', // key used to identify the store inside local storage
    }
  )
)

