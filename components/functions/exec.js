const { exec } = require('child_process')

module.exports = command => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) reject(error)
      if (stderr) reject(stderr)
      resolve(stdout)
    })
  })
}
