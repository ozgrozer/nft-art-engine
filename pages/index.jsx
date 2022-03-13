import axios from 'axios'
import Head from 'next/head'
import { useRef, useState } from 'react'

import styles from '@components/styles/home.module.scss'

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
        className='text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-gray-600 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-700 dark:focus:ring-gray-800'
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

const AdjustLayers = ({ uploadedFiles }) => {
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

  const generateImages = async () => {
    const result = await axios({
      method: 'post',
      data: { layers },
      url: '/api/generate-images'
    })

    if (result.data.success) {
      console.log(result.data)
    } else {
      console.log('error')
    }
  }

  return (
    <div className='container mx-auto'>
      <label htmlFor='layers' className='block text-sm font-medium text-gray-700'>
        Layers
      </label>

      <textarea
        rows={7}
        id='layers'
        name='layers'
        value={layers}
        onChange={e => setLayers(e.target.value)}
        className='mt-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md'
      />

      <p className='mt-2 text-sm text-gray-500'>
        Move layers from back to front
      </p>

      <button
        onClick={generateImages}
        className='mt-5 text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
      >
        Generate Images
      </button>
    </div>
  )
}

export default () => {
  const [uploadedFiles, setUploadedFiles] = useState()

  return (
    <>
      <Head>
        <title>NFT Art Engine</title>
      </Head>

      <div className={styles.container}>
        {
          uploadedFiles
            ? (
              <AdjustLayers
                uploadedFiles={uploadedFiles}
              />
              )
            : (
              <ChooseFolder
                setUploadedFiles={setUploadedFiles}
              />
              )
        }
      </div>
    </>
  )
}
