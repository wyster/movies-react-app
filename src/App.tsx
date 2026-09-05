import { QueryClientProvider } from '@tanstack/react-query'

import './App.css'
import { queryClient } from './queryClient'
import Layout from './routes/Layout'
import { BrowserRouter } from 'react-router'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
