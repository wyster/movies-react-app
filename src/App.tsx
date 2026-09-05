import { ApolloProvider } from '@apollo/client'

import './App.css'
import { client } from './ApolloClient'
import Layout from './routes/Layout'
import { BrowserRouter } from 'react-router'

function App() {
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </ApolloProvider>
  )
}

export default App
