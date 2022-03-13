import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import '@components/styles/globals.scss'

export default ({ Component, pageProps }) => {
  return (
    <>
      <ToastContainer closeButton={null} />
      <Component {...pageProps} />
    </>
  )
}
