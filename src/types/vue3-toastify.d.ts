declare module 'vue3-toastify' {
  export interface ToastContainerOptions {
    autoClose?: boolean | number;
    limit?: number;
    position?: string;
    closeButton?: boolean;
    hideProgressBar?: boolean;
    pauseOnHover?: boolean;
    pauseOnFocusLoss?: boolean;
    closeOnClick?: boolean;
    newestOnTop?: boolean;
    draggable?: boolean;
    draggablePercent?: number;
    showCloseButtonOnHover?: boolean;
    containerId?: string;
    rtl?: boolean;
    theme?: string;
    transition?: string;
    [key: string]: any;
  }

  export function toast(content: string | HTMLElement, options?: ToastContainerOptions): any;
  export function success(content: string | HTMLElement, options?: ToastContainerOptions): any;
  export function error(content: string | HTMLElement, options?: ToastContainerOptions): any;
  export function info(content: string | HTMLElement, options?: ToastContainerOptions): any;
  export function warning(content: string | HTMLElement, options?: ToastContainerOptions): any;
  export function clearAll(): void;
  export function isActive(id: any): boolean;
  export function dismiss(id?: any): void;
  export function update(id: any, options?: ToastContainerOptions): void;

  const _default: {
    install: (app: any, options?: ToastContainerOptions) => void;
  };
  export default _default;
}

// Add Vue3Toasity namespace for compatibility with the code in main.ts
declare namespace Vue3Toasity {
  export interface ToastContainerOptions {
    autoClose?: boolean | number;
    limit?: number;
    position?: string;
    closeButton?: boolean;
    hideProgressBar?: boolean;
    pauseOnHover?: boolean;
    pauseOnFocusLoss?: boolean;
    closeOnClick?: boolean;
    newestOnTop?: boolean;
    draggable?: boolean;
    draggablePercent?: number;
    showCloseButtonOnHover?: boolean;
    containerId?: string;
    rtl?: boolean;
    theme?: string;
    transition?: string;
    [key: string]: any;
  }
}
