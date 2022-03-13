const { exec } = require('child_process')

const _exec = command => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) reject(error)
      if (stderr) reject(stderr)
      resolve(stdout)
    })
  })
}

export default async (req, res) => {
  try {
    const { layers } = req.body

    const layersSplit = layers.split('\n')
    const layersOrder = layersSplit.map(item => { return { name: item } })

    const _layerConfigurations = [
      {
        layersOrder,
        growEditionSizeTo: 15
      }
    ]
    const layerConfigurations = JSON.stringify(_layerConfigurations)
    const result = await _exec(`layerConfigurations='${layerConfigurations}' node ./engine/index.js`)
    console.log(result)

    res.json({ success: true })
  } catch (err) {
    res.json({ success: false, error: err.message })
  }
}
