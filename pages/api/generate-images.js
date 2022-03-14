import 'dotenv/config'
import cloudinary from 'cloudinary'

import exec from '@components/functions/exec'

cloudinary.config({
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME
})

const cloudinaryUpload = imageId => {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload(`./public/build/images/${imageId}.png`, (error, result) => {
      if (error) reject(error)
      resolve(result.secure_url)
    })
  })
}

const asyncForEach = async (array, callback) => {
  for (let i = 0; i < array.length; i++) {
    await callback(array[i], i, array)
  }
}

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

    await exec('node ./engine/index.js')

    const array = Array.from({ length: parseInt(generateCount) }, (_, i) => i + 1)
    const images = []
    await asyncForEach(array, async num => {
      const image = await cloudinaryUpload(num)
      images.push(image)
    })

    res.json({ success: true, images })
  } catch (err) {
    res.json({ success: false, error: err.message })
  }
}
