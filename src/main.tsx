import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import App from './App.tsx'


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // How long data stays fresh before refetching
      staleTime: 1000 * 60 * 5, // 5 minutes
      // How long unused data stays in cache
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Wrap your app with QueryClientProvider */}
    {/* This makes the QueryClient available to all components */}
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)