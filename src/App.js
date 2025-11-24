import { ApolloProvider } from '@apollo/client'

import './App.css'
import { client } from './ApolloClient'
import Layout from '../src/routes/Layout'

function App () {
  return (
    <ApolloProvider client={client}>
      <Layout/>
    </ApolloProvider>
  )
}

export default App
