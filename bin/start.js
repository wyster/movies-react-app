const path = require('path');
const Express = require('express');
const Router = require('express-promise-router');

const router = Router()

const buildDir = path.join(__dirname, '/../build')

const app = new Express()
app.use(router)
router.use('/', Express.static(buildDir))

const port = process.env.PORT || 80
app.listen(port, () => console.log(`app Server is now running on http://localhost:${port}`))
