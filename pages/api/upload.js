import fs from 'fs'
import multer from 'multer'
import nextConnect from 'next-connect'

import exec from '@components/functions/exec'

const removeUploadsFolder = async (req, res, next) => {
  await exec('rm -rdf ./public/uploads/*')
  next()
}

const upload = multer({
  storage: multer.diskStorage({
    filename: (req, file, cb) => {
      const newFilename = file.originalname === '.DS_Store'
        ? 'dsstore'
        : file.originalname
      cb(null, newFilename)
    },
    destination: (req, file, cb) => {
      if (file.originalname !== '.DS_Store') {
        const splitFieldname = file.fieldname.split('/')
        const folderPath = `./public/uploads/${splitFieldname[1]}`

        if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true })

        cb(null, folderPath)
      } else {
        cb(null, './public/uploads')
      }
    },
    fileFilter: (req, file, cb) => {
      if (file.originalname === '.DS_Store') {
        cb(null, false)
      }
    }
  })
})

const apiRoute = nextConnect({
  onError (error, req, res) {
    res.status(501).json({ error: `Sorry something Happened! ${error.message}` })
  },
  onNoMatch (req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` })
  }
})

apiRoute.use(removeUploadsFolder)

apiRoute.use(upload.any())

apiRoute.post((req, res) => {
  res
    .status(200)
    .json({
      success: true,
      files: req.files
    })
})

export default apiRoute

export const config = {
  api: {
    bodyParser: false
  }
}
