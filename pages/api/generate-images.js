import exec from '@components/functions/exec'

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
    const result = await exec(`layerConfigurations='${layerConfigurations}' node ./engine/index.js`)
    console.log(result)

    res.json({ success: true })
  } catch (err) {
    res.json({ success: false, error: err.message })
  }
}
