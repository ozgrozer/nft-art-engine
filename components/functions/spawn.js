const { spawn } = require('child_process')

module.exports = ({ command, args, options }) => {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, options)
    let scriptOutput = ''

    child.stdout.setEncoding('utf8')
    child.stderr.setEncoding('utf8')

    child.stdout.on('data', data => {
      data = data.toString()
      scriptOutput += data
    })

    child.stderr.on('data', data => {
      data = data.toString()
      scriptOutput += data
    })

    child.on('exit', code => {
      resolve(scriptOutput)
    })
  })
}
