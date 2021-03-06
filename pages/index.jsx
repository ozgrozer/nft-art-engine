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

  const [uploadProgress, setUploadProgress] = useState('')
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
      headers: { 'content-type': 'multipart/form-data' },
      onUploadProgress: event => {
        setUploadProgress(`${Math.round((event.loaded * 100) / event.total)}%`)
      }
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
    <div className={styles.chooseFolderWrapper}>
      <button
        type='button'
        onClick={chooseFolder}
        disabled={uploadProgress !== ''}
        className={clx(styles.button, styles.block)}
      >
        {
          uploadProgress !== ''
            ? `Upload progress: ${uploadProgress}`
            : 'Choose Folder'
        }
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

const AdjustSettings = ({ uploadedFiles, setGeneratedImageUrls }) => {
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
    setGeneratedImageUrls(null)

    setUploadIsInProgress(true)
    const result = await axios({
      method: 'post',
      data: res.items,
      url: '/api/generate-images'
    })
    setUploadIsInProgress(false)

    if (result.data.success) {
      setGeneratedImageUrls(result.data.images)
    } else {
      notification({
        type: 'error',
        message: result.data.error
      })
    }
  }

  const possibleCombinations = ''

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
                    value='500'
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
                    value='500'
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
                  {
                    possibleCombinations && (
                      <span className={styles.labelContent}>
                        ({possibleCombinations} possible combinations)
                      </span>
                    )
                  }
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
                value='%'
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

const GeneratedImages = ({ generatedImageUrls }) => {
  return (
    <div className={styles.generatedImages}>
      {
        generatedImageUrls.map((imageUrl, key) => {
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
  // const [uploadedFiles, setUploadedFiles] = useState([{ fieldname: 'layers/eyes/red.png' }])
  // const [generatedImageUrls, setGeneratedImageUrls] = useState(['1', '2', '3', '4'])
  const [uploadedFiles, setUploadedFiles] = useState()
  const [generatedImageUrls, setGeneratedImageUrls] = useState(null)

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
                    setGeneratedImageUrls={setGeneratedImageUrls}
                  />

                  {generatedImageUrls && (
                    <GeneratedImages
                      generatedImageUrls={generatedImageUrls}
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
