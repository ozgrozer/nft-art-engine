import fs from 'fs'
import multer from 'multer'
import nextConnect from 'next-connect'

const upload = multer({
  storage: multer.diskStorage({
    filename: (req, file, cb) => cb(null, file.originalname),
    destination: (req, file, cb) => {
      if (file.originalname !== '.DS_Store') {
        const splitFieldname = file.fieldname.split('/')
        const folderPath = `./public/uploads/${splitFieldname[1]}`

        if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath)

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
