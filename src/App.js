import { ApolloProvider } from '@apollo/client'
import { BrowserRouter as Router, } from 'react-router-dom'

import './App.css'
import { client } from './ApolloClient'
import Layout from '../src/routes/Layout'

function App () {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Layout/>
      </Router>
    </ApolloProvider>
  )
}

export default App
