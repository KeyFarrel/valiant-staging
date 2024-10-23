import { toast } from 'vue3-toastify';
import { notifySuccess, notifyError } from '@/services/helper/toast-notification';

jest.mock('vue3-toastify');

describe('Toast Notification', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call toast with correct parameters for notifyError', () => {
    const message = 'Error occurred';
    const autoClose = 5000;

    notifyError(message, autoClose);

    expect(toast).toHaveBeenCalledWith(message, {
      theme: 'auto',
      type: 'error',
      closeOnClick: false,
      autoClose: autoClose,
      hideProgressBar: true,
      dangerouslyHTMLString: true,
    });
  });

  it('should call toast with correct parameters for notifySuccess', () => {
    const message = 'Operation successful';
    const autoClose = 3000;

    notifySuccess(message, autoClose);

    expect(toast).toHaveBeenCalledWith(message, {
      theme: 'auto',
      type: 'success',
      closeOnClick: false,
      autoClose: autoClose,
      hideProgressBar: true,
      dangerouslyHTMLString: true,
    });
  });

  it('should handle boolean autoClose value for notifyError', () => {
    const message = 'Boolean autoClose';
    const autoClose = true;

    notifyError(message, autoClose);

    expect(toast).toHaveBeenCalledWith(message, {
      theme: 'auto',
      type: 'error',
      closeOnClick: false,
      autoClose: autoClose,
      hideProgressBar: true,
      dangerouslyHTMLString: true,
    });
  });

  it('should handle boolean autoClose value for notifySuccess', () => {
    const message = 'Boolean autoClose';
    const autoClose = false;

    notifySuccess(message, autoClose);

    expect(toast).toHaveBeenCalledWith(message, {
      theme: 'auto',
      type: 'success',
      closeOnClick: false,
      autoClose: autoClose,
      hideProgressBar: true,
      dangerouslyHTMLString: true,
    });
  });
});
