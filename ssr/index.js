import path from 'path'
import fs from 'fs'
import ReactDOMServer from 'react-dom/server'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import express from 'express'
import { StaticRouter } from 'react-router'

import Layout from '../src/routes/Layout'

if (!process.env.REACT_APP_API_URL) {
  throw new Error('process.env.REACT_APP_API_URL not defined!');
}

function Html ({ content }) {
  return (
    <>
      <div id="root" dangerouslySetInnerHTML={{ __html: content }}/>
      <script dangerouslySetInnerHTML={{
      }}/>
    </>
  )
}

const buildDir = path.join(__dirname, '/../build')
const indexFile = path.join(buildDir, '/index.html')
const indexFileContent = fs.readFileSync(indexFile, { encoding: 'utf8', flag: 'r' })

const app = express();
app.use(express.static('build', {index: false}))
app.get('/{*splat}', async (req, res) => {
  const queryClient = new QueryClient()

  const context = {}

  const App = (
    <QueryClientProvider client={queryClient}>
      <StaticRouter location={req.url} context={context}>
        <Layout/>
      </StaticRouter>
    </QueryClientProvider>
  )

  const content = ReactDOMServer.renderToString(App)
  const html = <Html content={content}/>
  const app = ReactDOMServer.renderToStaticMarkup(html)

  res.status(200)
  res.send(indexFileContent.replace('<div id="root"></div>', app))
  res.end()
})

const port = process.env.PORT || 80
app.listen(port, () => console.log(`app Server is now running on http://localhost:${port}`))
