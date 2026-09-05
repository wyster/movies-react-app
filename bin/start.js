const fs = require('fs');
const path = require('path');
const express = require('express');

const buildDir = path.resolve(process.cwd(), 'build')
const indexFile = path.join(buildDir, 'index.html')

if (!fs.existsSync(indexFile)) {
  throw new Error(`Frontend build not found: ${indexFile}. Run \'yarn build\' first.`)
}

const app = express()
app.get('/env-config.js', (req, res) => {
  res.sendFile(path.join(buildDir, 'env-config.js'))
})
app.use(express.static(buildDir))
app.get('/*splat', (req, res) => res.sendFile(indexFile))

const port = process.env.PORT || 80
app.listen(port, () => console.log(`app Server is now running on http://localhost:${port}`))
