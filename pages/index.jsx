import axios from 'axios'
import Head from 'next/head'
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

const AdjustLayers = ({ uploadedFiles, setGeneratedImages }) => {
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
    setUploadIsInProgress(true)
    const result = await axios({
      method: 'post',
      data: { layers },
      url: '/api/generate-images'
    })
    setUploadIsInProgress(false)

    if (result.data.success) {
      setGeneratedImages(true)
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

export default () => {
  const [uploadedFiles, setUploadedFiles] = useState()
  const [generatedImages, setGeneratedImages] = useState()

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
                    setGeneratedImages={setGeneratedImages}
                  />

                  {generatedImages && (
                    <div>generatedImages</div>
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
