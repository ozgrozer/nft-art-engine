
const format = {
  smoothing: false,
  width: 50,
  height: 50
}

const layerConfigurations = [
  {
    layersOrder: [{ name: 'Background' },{ name: 'Eyes' },{ name: 'Ears' },{ name: 'Shapes' },{ name: 'Body' },{ name: 'Clothing' },{ name: 'Hand' }],
    growEditionSizeTo: 8
  }
]

const rarityDelimiter = '%'

module.exports = {
  format,
  rarityDelimiter,
  layerConfigurations
}

