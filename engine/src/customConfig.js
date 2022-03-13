
const format = {
  smoothing: false,
  width: 500,
  height: 500
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

