import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export const notifyError = (message: string, autoClose: boolean | number) => {
  toast(message, {
    "theme": "auto",
    "type": "error",
    "closeOnClick": false,
    "autoClose": autoClose,
    "hideProgressBar": true,
    "dangerouslyHTMLString": true
  })
}
export const notifySuccess = (message: string, autoClose: boolean | number) => {
  toast(message, {
    "theme": "auto",
    "type": "success",
    "closeOnClick": false,
    "autoClose": autoClose,
    "hideProgressBar": true,
    "dangerouslyHTMLString": true
  })
}