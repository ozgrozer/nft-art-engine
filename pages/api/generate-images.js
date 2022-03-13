import exec from '@components/functions/exec'

export default async (req, res) => {
  try {
    const { imageWidth, imageHeight, generateCount, raritySeparator, layers } = req.body

    const layersSplit = layers.split('\n')
    const layersOrderArray = []
    for (const key in layersSplit) {
      const item = layersSplit[key]
      layersOrderArray.push(`{ name: '${item}' },`)
    }
    const layersOrderString = layersOrderArray.join('\n')

    const customConfig = `
const format = {
  smoothing: false,
  width: ${imageWidth},
  height: ${imageHeight}
}

const layerConfigurations = [
  {
    layersOrder: [
${layersOrderString}
    ],
    growEditionSizeTo: ${generateCount}
  }
]

const rarityDelimiter = '${raritySeparator}'

module.exports = {
  format,
  rarityDelimiter,
  layerConfigurations
}
`

    await exec(`echo "${customConfig}" > ./engine/src/customConfig.js`)

    const apiResult = await exec('node ./engine/index.js')

    res.json({ success: true, apiResult })
  } catch (err) {
    res.json({ success: false, error: err.message })
  }
}
