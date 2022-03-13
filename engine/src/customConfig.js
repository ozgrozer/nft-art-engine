
const format = {
  smoothing: false,
  width: 200,
  height: 200
}

const layerConfigurations = [
  {
    layersOrder: [
{ name: 'Background' },
{ name: 'Shapes' },
{ name: 'Body' },
{ name: 'Clothing' },
{ name: 'Eyes' },
{ name: 'Ears' },
{ name: 'Hand' },
    ],
    growEditionSizeTo: 20
  }
]

const rarityDelimiter = '%'

module.exports = {
  format,
  rarityDelimiter,
  layerConfigurations
}

