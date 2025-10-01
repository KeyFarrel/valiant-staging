import { toast } from 'vue3-toastify';
import { notifySuccess, notifyError } from '@/services/helper/toast-notification';

jest.mock('vue3-toastify', () => ({
  toast: jest.fn(),
}));

const mockToast = toast as jest.MockedFunction<typeof toast>;

describe('Toast Notification', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test notifyError function
  it('should call toast with correct parameters for notifyError with number autoClose', () => {
    const message = 'Error occurred';
    const autoClose = 5000;

    notifyError(message, autoClose);

    expect(mockToast).toHaveBeenCalledWith(message, {
      theme: 'light',
      type: 'error',
      closeOnClick: false,
      autoClose: autoClose,
      hideProgressBar: true,
      dangerouslyHTMLString: true,
    });
    expect(mockToast).toHaveBeenCalledTimes(1);
  });

  it('should call toast with correct parameters for notifyError with boolean true autoClose', () => {
    const message = 'Boolean autoClose true';
    const autoClose = true;

    notifyError(message, autoClose);

    expect(mockToast).toHaveBeenCalledWith(message, {
      theme: 'light',
      type: 'error',
      closeOnClick: false,
      autoClose: autoClose,
      hideProgressBar: true,
      dangerouslyHTMLString: true,
    });
    expect(mockToast).toHaveBeenCalledTimes(1);
  });

  it('should call toast with correct parameters for notifyError with boolean false autoClose', () => {
    const message = 'Boolean autoClose false';
    const autoClose = false;

    notifyError(message, autoClose);

    expect(mockToast).toHaveBeenCalledWith(message, {
      theme: 'light',
      type: 'error',
      closeOnClick: false,
      autoClose: autoClose,
      hideProgressBar: true,
      dangerouslyHTMLString: true,
    });
    expect(mockToast).toHaveBeenCalledTimes(1);
  });

  it('should handle empty error message', () => {
    const message = '';
    const autoClose = 3000;

    notifyError(message, autoClose);

    expect(mockToast).toHaveBeenCalledWith(message, {
      theme: 'light',
      type: 'error',
      closeOnClick: false,
      autoClose: autoClose,
      hideProgressBar: true,
      dangerouslyHTMLString: true,
    });
  });

  it('should handle long error message', () => {
    const message = 'This is a very long error message that might be used to describe complex error scenarios in the application. It should be handled properly by the toast notification system.';
    const autoClose = 8000;

    notifyError(message, autoClose);

    expect(mockToast).toHaveBeenCalledWith(message, {
      theme: 'light',
      type: 'error',
      closeOnClick: false,
      autoClose: autoClose,
      hideProgressBar: true,
      dangerouslyHTMLString: true,
    });
  });

  it('should handle HTML content in error message', () => {
    const message = '<strong>Critical Error:</strong> <em>Something went wrong</em>';
    const autoClose = 0; // Never auto close

    notifyError(message, autoClose);

    expect(mockToast).toHaveBeenCalledWith(message, {
      theme: 'light',
      type: 'error',
      closeOnClick: false,
      autoClose: autoClose,
      hideProgressBar: true,
      dangerouslyHTMLString: true,
    });
  });

  // Test notifySuccess function
  it('should call toast with correct parameters for notifySuccess with number autoClose', () => {
    const message = 'Operation successful';
    const autoClose = 3000;

    notifySuccess(message, autoClose);

    expect(mockToast).toHaveBeenCalledWith(message, {
      theme: 'light',
      type: 'success',
      closeOnClick: false,
      autoClose: autoClose,
      hideProgressBar: true,
      dangerouslyHTMLString: true,
    });
    expect(mockToast).toHaveBeenCalledTimes(1);
  });

  it('should call toast with correct parameters for notifySuccess with boolean true autoClose', () => {
    const message = 'Boolean autoClose true';
    const autoClose = true;

    notifySuccess(message, autoClose);

    expect(mockToast).toHaveBeenCalledWith(message, {
      theme: 'light',
      type: 'success',
      closeOnClick: false,
      autoClose: autoClose,
      hideProgressBar: true,
      dangerouslyHTMLString: true,
    });
    expect(mockToast).toHaveBeenCalledTimes(1);
  });

  it('should call toast with correct parameters for notifySuccess with boolean false autoClose', () => {
    const message = 'Boolean autoClose false';
    const autoClose = false;

    notifySuccess(message, autoClose);

    expect(mockToast).toHaveBeenCalledWith(message, {
      theme: 'light',
      type: 'success',
      closeOnClick: false,
      autoClose: autoClose,
      hideProgressBar: true,
      dangerouslyHTMLString: true,
    });
    expect(mockToast).toHaveBeenCalledTimes(1);
  });

  it('should handle empty success message', () => {
    const message = '';
    const autoClose = 2000;

    notifySuccess(message, autoClose);

    expect(mockToast).toHaveBeenCalledWith(message, {
      theme: 'light',
      type: 'success',
      closeOnClick: false,
      autoClose: autoClose,
      hideProgressBar: true,
      dangerouslyHTMLString: true,
    });
  });

  it('should handle long success message', () => {
    const message = 'This is a very long success message that might be used to describe complex successful operations in the application. It should be handled properly by the toast notification system and display correctly.';
    const autoClose = 5000;

    notifySuccess(message, autoClose);

    expect(mockToast).toHaveBeenCalledWith(message, {
      theme: 'light',
      type: 'success',
      closeOnClick: false,
      autoClose: autoClose,
      hideProgressBar: true,
      dangerouslyHTMLString: true,
    });
  });

  it('should handle HTML content in success message', () => {
    const message = '<strong>Success:</strong> <em>Operation completed successfully</em>';
    const autoClose = 4000;

    notifySuccess(message, autoClose);

    expect(mockToast).toHaveBeenCalledWith(message, {
      theme: 'light',
      type: 'success',
      closeOnClick: false,
      autoClose: autoClose,
      hideProgressBar: true,
      dangerouslyHTMLString: true,
    });
  });

  // Test edge cases and various autoClose values
  it('should handle zero autoClose value for error', () => {
    const message = 'Persistent error message';
    const autoClose = 0;

    notifyError(message, autoClose);

    expect(mockToast).toHaveBeenCalledWith(message, {
      theme: 'light',
      type: 'error',
      closeOnClick: false,
      autoClose: autoClose,
      hideProgressBar: true,
      dangerouslyHTMLString: true,
    });
  });

  it('should handle zero autoClose value for success', () => {
    const message = 'Persistent success message';
    const autoClose = 0;

    notifySuccess(message, autoClose);

    expect(mockToast).toHaveBeenCalledWith(message, {
      theme: 'light',
      type: 'success',
      closeOnClick: false,
      autoClose: autoClose,
      hideProgressBar: true,
      dangerouslyHTMLString: true,
    });
  });

  it('should handle very large autoClose value', () => {
    const message = 'Very slow closing message';
    const autoClose = 999999;

    notifyError(message, autoClose);

    expect(mockToast).toHaveBeenCalledWith(message, {
      theme: 'light',
      type: 'error',
      closeOnClick: false,
      autoClose: autoClose,
      hideProgressBar: true,
      dangerouslyHTMLString: true,
    });
  });

  // Test configuration consistency
  it('should have consistent configuration between error and success notifications', () => {
    const message = 'Test message';
    const autoClose = 3000;

    notifyError(message, autoClose);
    notifySuccess(message, autoClose);

    const errorCall = mockToast.mock.calls[0][1];
    const successCall = mockToast.mock.calls[1][1];

    // Check that all properties except type are the same
    expect(errorCall.theme).toBe(successCall.theme);
    expect(errorCall.closeOnClick).toBe(successCall.closeOnClick);
    expect(errorCall.hideProgressBar).toBe(successCall.hideProgressBar);
    expect(errorCall.dangerouslyHTMLString).toBe(successCall.dangerouslyHTMLString);
    expect(errorCall.autoClose).toBe(successCall.autoClose);

    // Check that types are different
    expect(errorCall.type).toBe('error');
    expect(successCall.type).toBe('success');
  });

  // Test multiple calls
  it('should handle multiple successive error notifications', () => {
    notifyError('First error', 1000);
    notifyError('Second error', 2000);
    notifyError('Third error', 3000);

    expect(mockToast).toHaveBeenCalledTimes(3);
    expect(mockToast).toHaveBeenNthCalledWith(1, 'First error', expect.objectContaining({ type: 'error', autoClose: 1000 }));
    expect(mockToast).toHaveBeenNthCalledWith(2, 'Second error', expect.objectContaining({ type: 'error', autoClose: 2000 }));
    expect(mockToast).toHaveBeenNthCalledWith(3, 'Third error', expect.objectContaining({ type: 'error', autoClose: 3000 }));
  });

  it('should handle multiple successive success notifications', () => {
    notifySuccess('First success', true);
    notifySuccess('Second success', false);
    notifySuccess('Third success', 1500);

    expect(mockToast).toHaveBeenCalledTimes(3);
    expect(mockToast).toHaveBeenNthCalledWith(1, 'First success', expect.objectContaining({ type: 'success', autoClose: true }));
    expect(mockToast).toHaveBeenNthCalledWith(2, 'Second success', expect.objectContaining({ type: 'success', autoClose: false }));
    expect(mockToast).toHaveBeenNthCalledWith(3, 'Third success', expect.objectContaining({ type: 'success', autoClose: 1500 }));
  });

  it('should handle mixed error and success notifications', () => {
    notifyError('Error message', 2000);
    notifySuccess('Success message', 3000);
    notifyError('Another error', true);
    notifySuccess('Another success', false);

    expect(mockToast).toHaveBeenCalledTimes(4);
    expect(mockToast).toHaveBeenNthCalledWith(1, 'Error message', expect.objectContaining({ type: 'error' }));
    expect(mockToast).toHaveBeenNthCalledWith(2, 'Success message', expect.objectContaining({ type: 'success' }));
    expect(mockToast).toHaveBeenNthCalledWith(3, 'Another error', expect.objectContaining({ type: 'error' }));
    expect(mockToast).toHaveBeenNthCalledWith(4, 'Another success', expect.objectContaining({ type: 'success' }));
  });

  // Test special characters and internationalization
  it('should handle special characters in messages', () => {
    const specialMessage = 'Error: 特殊字符 & símbolos especiales @ 特別な文字 #$%^&*()';
    notifyError(specialMessage, 3000);

    expect(mockToast).toHaveBeenCalledWith(specialMessage, expect.objectContaining({ type: 'error' }));
  });

  it('should handle multiline messages', () => {
    const multilineMessage = 'Line 1\nLine 2\nLine 3';
    notifySuccess(multilineMessage, 4000);

    expect(mockToast).toHaveBeenCalledWith(multilineMessage, expect.objectContaining({ type: 'success' }));
  });
});
