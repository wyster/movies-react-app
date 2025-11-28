import path from 'path'
import fs from 'fs'
import fetch from 'isomorphic-fetch'
import ReactDOMServer from 'react-dom/server'
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client'
import express from 'express'
import { StaticRouter } from 'react-router'
import { renderToStringWithData } from '@apollo/client/react/ssr'
import { RestLink } from 'apollo-link-rest'

import Layout from '../src/routes/Layout'

if (!process.env.REACT_APP_API_URL) {
  throw new Error('process.env.REACT_APP_API_URL not defined!');
}

function Html ({ content, state }) {
  return (
    <>
      <div id="root" dangerouslySetInnerHTML={{ __html: content }}/>
      <script dangerouslySetInnerHTML={{
        __html: `window.__APOLLO_STATE__=${JSON.stringify(state).replace(/</g, '\\u003c')};`,
      }}/>
    </>
  )
}

const buildDir = path.join(__dirname, '/../build')
const indexFile = path.join(buildDir, '/index.html')
const indexFileContent = fs.readFileSync(indexFile, { encoding: 'utf8', flag: 'r' })

const app = express();
app.use(express.static('build'))
app.get('/*splat', async (req, res) => {
  const restLink = new RestLink({
    uri: `${process.env.REACT_APP_API_URL}/`,
    customFetch: fetch
  })
  const client = new ApolloClient({
    ssrMode: true,
    link: restLink,
    cache: new InMemoryCache(),
  })

  const context = {}

  const App = (
    <ApolloProvider client={client}>
      <StaticRouter location={req.url} context={context}>
        <Layout/>
      </StaticRouter>
    </ApolloProvider>
  )

  const content = await renderToStringWithData(App)

  const initialState = client.extract()
  const html = <Html content={content} state={initialState}/>
  const app = ReactDOMServer.renderToStaticMarkup(html)

  res.status(200)
  res.send(indexFileContent.replace('<div id="root"></div>', app))
  res.end()
})

const port = process.env.PORT || 80
app.listen(port, () => console.log(`app Server is now running on http://localhost:${port}`))
