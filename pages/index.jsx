import axios from 'axios'
import Head from 'next/head'
import Image from 'next/image'
import { useRef, useState } from 'react'
import { Form, Input, Textarea } from 'rfv'

import clx from '@components/functions/clx'
import notification from '@components/functions/notification'
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
      notification({
        type: 'error',
        message: result.data.error
      })
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

const AdjustSettings = ({ uploadedFiles, setGeneratedImageIds }) => {
  const _folders = []
  for (const key in uploadedFiles) {
    const item = uploadedFiles[key]
    const destinationSplit = item.destination.split('/')
    if (destinationSplit.length === 4) {
      _folders.push(destinationSplit[3])
    }
  }
  const folders = [...new Set(_folders)]
  const layers = folders.join('\n')

  const [uploadIsInProgress, setUploadIsInProgress] = useState(false)
  const generateImages = async res => {
    setGeneratedImageIds(null)

    setUploadIsInProgress(true)
    const result = await axios({
      method: 'post',
      data: res.items,
      url: '/api/generate-images'
    })
    setUploadIsInProgress(false)

    if (result.data.success) {
      const imageIds = getImageIdsFromApiResult(result.data.apiResult)
      setGeneratedImageIds(imageIds)
    } else {
      notification({
        type: 'error',
        message: result.data.error
      })
    }
  }

  return (
    <Form
      className={styles.form}
      onSubmit={generateImages}
    >
      {
        uploadIsInProgress && (
          <div className={styles.spinnerWrapper}>
            <div className={styles.spinner} />
          </div>
        )
      }

      <fieldset disabled={uploadIsInProgress}>
        <div className={styles.row}>
          <div className={styles.col}>
            <div className={styles.formGroup}>
              <div className={styles.row}>
                <div className={styles.col}>
                  <div className={styles.label}>
                    <label htmlFor='imageWidth'>
                      Image Width
                    </label>
                  </div>

                  <Input
                    value='200'
                    id='imageWidth'
                    name='imageWidth'
                    className={styles.input}
                  />
                </div>

                <div className={styles.col}>
                  <div className={styles.label}>
                    <label htmlFor='imageHeight'>
                      Image Height
                    </label>
                  </div>

                  <Input
                    value='200'
                    id='imageHeight'
                    name='imageHeight'
                    className={styles.input}
                  />
                </div>
              </div>
            </div>

            <div className={styles.formGroup}>
              <div className={styles.label}>
                <label htmlFor='generateCount'>
                  Generate Count
                </label>
              </div>

              <Input
                value='20'
                id='generateCount'
                name='generateCount'
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <div className={styles.label}>
                <label htmlFor='raritySeparator'>
                  Rarity Separator
                </label>
              </div>

              <Input
                value='#'
                id='raritySeparator'
                name='raritySeparator'
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.col}>
            <div className={styles.formGroup}>
              <div className={styles.label}>
                <label htmlFor='layers'>
                  Layers
                </label>
              </div>

              <Textarea
                id='layers'
                name='layers'
                value={layers}
                className={styles.textarea}
              />
            </div>

            <button className={clx(styles.button, styles.block, styles.green)}>
              Generate Images
            </button>
          </div>
        </div>
      </fieldset>
    </Form>
  )
}

const GeneratedImages = ({ generatedImageIds }) => {
  const unixtime = Math.round(+new Date() / 1000)

  return (
    <div className={styles.generatedImages}>
      {
        generatedImageIds.map((imageId, key) => {
          const imageUrl = `/build/images/${imageId}.png?v=${unixtime}`

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
                  <AdjustSettings
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
