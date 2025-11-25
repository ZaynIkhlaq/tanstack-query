import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import { Toaster } from './components/ui/sonner' // toaster deprecated, sonner is the new thingy 
import App from './App.tsx'


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {

      staleTime: 1000 * 60 * 5, // 5 minutes

    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
   
    
    <QueryClientProvider client={queryClient}>
      <App />
      <Toaster />
    </QueryClientProvider>
  </StrictMode>,
)