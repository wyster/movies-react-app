const nodeStatic = require('node-static')
const http = require('http')

const file = new (nodeStatic.Server)(__dirname + '/../build')

http.createServer(function (req, res) {
  file.serve(req, res)
}).listen(80)