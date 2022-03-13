const path = require('path')

const { startCreating, buildSetup } = require(path.join(__dirname, 'src', 'main.js'))

buildSetup()
startCreating()
