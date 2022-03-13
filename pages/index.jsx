import axios from 'axios'
import Head from 'next/head'
import Image from 'next/image'
import { useRef, useState } from 'react'

import clx from '@components/functions/clx'
import styles from '@components/styles/pages/home.module.scss'

const ChooseFolder = ({ setUploadedFiles }) => {
  const folderInputRef = useRef(null)
  const chooseFolder = () => folderInputRef.current.click()

  const folderInputOnChange = async event => {
    const formData = new window.FormData()
    for (const key in event.target.files) {
      const item = event.target.files[key]
      formData.append(item.webkitRelativePath, item)
    }

    const result = await axios({
      method: 'post',
      data: formData,
      url: '/api/upload',
      headers: { 'content-type': 'multipart/form-data' }
    })

    if (result.data.success) {
      setUploadedFiles(result.data.files)
    } else {
      console.log('error')
    }
  }

  return (
    <div>
      <button
        type='button'
        onClick={chooseFolder}
        className={clx(styles.button, styles.block)}
      >
        Choose Folder
      </button>

      <input
        type='file'
        name='files'
        directory='true'
        mozdirectory='true'
        ref={folderInputRef}
        webkitdirectory='true'
        style={{ display: 'none' }}
        onChange={folderInputOnChange}
      />
    </div>
  )
}

const getImageIdsFromApiResult = apiResult => {
  const splitApiResult = apiResult.split('\n')

  const imageIds = []
  for (const key in splitApiResult) {
    const item = splitApiResult[key]
    if (item.indexOf('id') !== -1) {
      const itemSplit = item.split(':')
      imageIds.push(itemSplit[1])
    }
  }

  return imageIds
}

const AdjustLayers = ({ uploadedFiles, setGeneratedImageIds }) => {
  const _folders = []
  for (const key in uploadedFiles) {
    const item = uploadedFiles[key]
    const destinationSplit = item.destination.split('/')
    if (destinationSplit.length === 4) {
      _folders.push(destinationSplit[3])
    }
  }
  const folders = [...new Set(_folders)]
  const [layers, setLayers] = useState(folders.join('\n'))

  const [uploadIsInProgress, setUploadIsInProgress] = useState(false)
  const generateImages = async () => {
    setGeneratedImageIds(null)

    setUploadIsInProgress(true)
    const result = await axios({
      method: 'post',
      data: { layers },
      url: '/api/generate-images'
    })
    setUploadIsInProgress(false)

    if (result.data.success) {
      const imageIds = getImageIdsFromApiResult(result.data.apiResult)
      setGeneratedImageIds(imageIds)
    } else {
      console.log('error')
    }
  }

  return (
    <div className={styles.form}>
      {
        uploadIsInProgress && (
          <div className={styles.spinnerWrapper}>
            <div className={styles.spinner} />
          </div>
        )
      }

      <fieldset disabled={uploadIsInProgress}>
        <div>
          <label htmlFor='layers' className={styles.label}>
            Layers
          </label>
        </div>

        <textarea
          rows={7}
          id='layers'
          name='layers'
          value={layers}
          className={styles.textarea}
          onChange={e => setLayers(e.target.value)}
        />

        <button
          onClick={generateImages}
          className={clx(styles.button, styles.block, styles.green)}
        >
          Generate Images
        </button>
      </fieldset>
    </div>
  )
}

const GeneratedImages = ({ generatedImageIds }) => {
  return (
    <div className={styles.generatedImages}>
      {
        generatedImageIds.map((imageId, key) => {
          const imageUrl = `/build/images/${imageId}.png`

          return (
            <div
              key={key}
              className={styles.generatedImage}
            >
              <a
                target='_blank'
                href={imageUrl}
                rel='noreferrer'
              >
                <Image
                  width={200}
                  height={200}
                  src={imageUrl}
                />
              </a>
            </div>
          )
        })
      }
    </div>
  )
}

export default () => {
  // const [uploadedFiles, setUploadedFiles] = useState([{ destination: './././one' }])
  // const [generatedImageIds, setGeneratedImageIds] = useState(['1', '2', '3', '4'])
  const [uploadedFiles, setUploadedFiles] = useState()
  const [generatedImageIds, setGeneratedImageIds] = useState(null)

  return (
    <>
      <Head>
        <title>NFT Art Engine</title>
      </Head>

      <div className={styles.container}>
        <div className={styles.pageTitle}>
          NFT Art Engine
        </div>

        <div className={styles.pageContent}>
          {
            uploadedFiles
              ? (
                <>
                  <AdjustLayers
                    uploadedFiles={uploadedFiles}
                    setGeneratedImageIds={setGeneratedImageIds}
                  />

                  {generatedImageIds && (
                    <GeneratedImages
                      generatedImageIds={generatedImageIds}
                    />
                  )}
                </>
                )
              : (
                <ChooseFolder
                  setUploadedFiles={setUploadedFiles}
                />
                )
          }
        </div>
      </div>
    </>
  )
}
