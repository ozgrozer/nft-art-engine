import axios from 'axios'
import Head from 'next/head'
import { useRef } from 'react'

export default () => {
  const folderInputRef = useRef(null)
  const chooseFolder = () => folderInputRef.current.click()

  const folderInputOnChange = async event => {
    const formData = new window.FormData()
    for (const key in event.target.files) {
      const item = event.target.files[key]
      formData.append(item.webkitRelativePath, item)
    }

    const response = await axios({
      method: 'post',
      data: formData,
      url: '/api/upload',
      headers: { 'content-type': 'multipart/form-data' },
      onUploadProgress: event => {
        console.log('progress:', Math.round((event.loaded * 100) / event.total))
      }
    })
    console.log('response:', response.data)
  }

  return (
    <>
      <Head>
        <title>NFT Art Engine</title>
      </Head>

      <div>
        <button type='button' onClick={chooseFolder}>
          Choose folder
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
    </>
  )
}
