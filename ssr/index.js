import React from 'react';
import ReactDOM from 'react-dom';
import fetch from 'cross-fetch'
import ReactDOMServer from 'react-dom/server'
import {
  ApolloProvider,
  ApolloClient,
  createHttpLink,
  InMemoryCache
} from '@apollo/client'
import Express from 'express'
import { StaticRouter } from 'react-router'
import { renderToStringWithData } from '@apollo/client/react/ssr'

import Layout from '../src/routes/Layout'

function Html ({ content, state }) {
  return (
    <html>
    <body>
    <div id="root" dangerouslySetInnerHTML={{ __html: content }}/>
    <script dangerouslySetInnerHTML={{
      __html: `window.__APOLLO_STATE__=${JSON.stringify(state).replace(/</g, '\\u003c')};`,
    }}/>
    </body>
    </html>
  )
}

const app = new Express()
app.use((req, res) => {

  const client = new ApolloClient({
    ssrMode: true,
    link: createHttpLink({
      uri: `${process.env.REACT_APP_API_URL}`,
      credentials: 'same-origin',
      headers: {
        cookie: req.header('Cookie'),
      },
      fetch
    }),
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

  renderToStringWithData(App).then((content) => {
    const initialState = client.extract()
    const html = <Html content={content} state={initialState}/>

    res.status(200)
    res.send(`<!doctype html>\n${ReactDOMServer.renderToStaticMarkup(html)}`)
    res.end()
  })
})

app.listen(process.env.PORT || 80, () => console.log( // eslint-disable-line no-console
  `app Server is now running on http://localhost:80`
))