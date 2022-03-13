import { toast } from 'react-toastify'

const notification = ({ type, message }) => {
  let _toast
  if (type === 'success') {
    _toast = toast.success
  } else if (type === 'danger' || type === 'error') {
    _toast = toast.error
  } else {
    _toast = toast
  }

  _toast(message, {
    theme: 'colored',
    autoClose: 3000,
    draggable: true,
    closeOnClick: true,
    pauseOnHover: true,
    progress: undefined,
    hideProgressBar: false,
    position: 'bottom-left'
  })
}

export default notification
