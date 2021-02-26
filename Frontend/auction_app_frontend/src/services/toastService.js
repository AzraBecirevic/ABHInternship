import { ToastContainer, toast, Zoom } from "react-toastify";

class ToastService {
  showErrorToast(errorMessage) {
    toast.error(errorMessage);
  }
  showSuccessToast(successMessage) {
    toast.success(successMessage);
  }
  showInfoToast(infoMessage) {
    toast.info(infoMessage);
  }
}

export default ToastService;
