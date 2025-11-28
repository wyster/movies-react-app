const path = require('path');
const express = require('express');

const buildDir = path.join(__dirname, '/../build')

const app = express()
app.use(express.static(buildDir))
app.use('/*splat', express.static(buildDir))

const port = process.env.PORT || 80
app.listen(port, () => console.log(`app Server is now running on http://localhost:${port}`))
