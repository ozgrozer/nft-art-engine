import exec from '@components/functions/exec'

export default async (req, res) => {
  try {
    const { generateCount, layers } = req.body

    const layersSplit = layers.split('\n')
    const layersOrder = layersSplit.map(item => { return { name: item } })

    const _layerConfigurations = [
      {
        layersOrder,
        growEditionSizeTo: generateCount
      }
    ]
    const layerConfigurations = JSON.stringify(_layerConfigurations)
    const apiResult = await exec(`layerConfigurations='${layerConfigurations}' node ./engine/index.js`)

    res.json({ success: true, apiResult })
  } catch (err) {
    res.json({ success: false, error: err.message })
  }
}
