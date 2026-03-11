import axios, { AxiosResponse } from "axios";
import { encryptAES } from "./helper/encryption";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { useCsrfTokenStore } from "@/store/storeCsrfToken";

const fpPromise = FingerprintJS.load();
const getFingerprint = async () => {
  const fp = await fpPromise;
  const result = await fp.get();

  // List komponen yang dianggap stabil dan tidak berubah
  const stableComponents = {
    // Hardware identifiers
    hardwareConcurrency: result.components.hardwareConcurrency,
    deviceMemory: result.components.deviceMemory,
    platform: result.components.platform,
    architecture: result.components.architecture,
    screenResolution: result.components.screenResolution,

    // Browser identifiers
    vendor: result.components.vendor,
    vendorFlavors: result.components.vendorFlavors,
    colorDepth: result.components.colorDepth,

    // Feature support
    canvas: result.components.canvas,
    webGlBasics: result.components.webGlBasics,
    timezone: result.components.timezone,
    touchSupport: result.components.touchSupport,

    // Browser settings
    cookiesEnabled: result.components.cookiesEnabled,
    localStorage: result.components.localStorage,
    sessionStorage: result.components.sessionStorage,
    colorGamut: result.components.colorGamut,
    hdr: result.components.hdr,
  };

  const visitorId = FingerprintJS.hashComponents(stableComponents);
  return visitorId;
};

const nodeMode: any = import.meta.env.MODE;
const TIME_OUT = 120000; // 120 seconds timeout for API requests

export default class BaseService {
  async api<T>(
    method: string,
    path: string,
    payload?: any,
    contentType?: string,
  ): Promise<T> {
    const headers: any = {
      "Content-Type": contentType || "application/json",
    };

    const response = await axios({
      method,
      url: path,
      data: payload,
      headers,
      timeout: TIME_OUT,
    });

    return response.data;
  }

  async get<T>(path: string, params?: any, responseType?: any): Promise<T> {
    const fingerprintID = await getFingerprint();
    const headers: any = {
      "Content-Type": "application/json",
      "X-Fingerprint-ID": fingerprintID,
    };

    try {
      const response = await axios({
        method: "GET",
        url: path,
        headers,
        timeout: TIME_OUT,
        withCredentials: true,
        params: params,
        responseType: responseType,
      });
      console.log("Response Method Get:", response);
      return response.data;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }
  async getFile<T>(path: string, params?: any, responseType?: any): Promise<T> {
    const headers: any = {};

    try {
      const response: any = await axios({
        method: "GET",
        url: path,
        headers,
        timeout: TIME_OUT,
        withCredentials: true,
        params: params,
        responseType: responseType,
      });
      return response;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }

  async post<T>(
    path: string,
    payload?: any,
  ): Promise<T> {
    const fingerprintID = await getFingerprint();
    const csrfStore = useCsrfTokenStore();
    const csrfToken = csrfStore.getCsrfToken();
    const headers: any = {
      "Content-Type": "application/json",
      "X-Fingerprint-ID": fingerprintID,
      "X-CSRF-Token": csrfToken,
    };
    
    try {
      const response: AxiosResponse = await axios({
        method: "POST",
        url: path,
        withCredentials: true,
        data:
          nodeMode === "development"
            ? payload
            : encryptAES(JSON.stringify(payload)),
        headers,
        timeout: TIME_OUT,
      });
      console.log("Response Method Post:", response);
      return response.data;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }

  async put<T>(path: string, payload?: any): Promise<T> {
    const csrfStore = useCsrfTokenStore();
    const csrfToken = csrfStore.getCsrfToken();
    const headers: any = {
      "Content-Type": "application/json",
      "X-CSRF-Token": csrfToken,
    };

    try {
      const response = await axios({
        method: "PUT",
        url: path,
        data: payload,
        headers,
        timeout: TIME_OUT,
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }

  async patch<T>(path: string, payload?: any): Promise<T> {
    const csrfStore = useCsrfTokenStore();
    const csrfToken = csrfStore.getCsrfToken();
    const headers: any = {
      "Content-Type": "application/json",
      "X-CSRF-Token": csrfToken,
    };

    try {
      const response = await axios({
        method: "PATCH",
        url: path,
        data: nodeMode === "development"
          ? payload
          : encryptAES(JSON.stringify(payload)),
        headers,
        timeout: TIME_OUT,
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }

  async delete<T>(path: string): Promise<T> {
    const csrfStore = useCsrfTokenStore();
    const csrfToken = csrfStore.getCsrfToken();
    const headers: any = {
      "Content-Type": "application/json",
      "X-CSRF-Token": csrfToken,
    };

    try {
      const response = await axios({
        method: "DELETE",
        url: path,
        headers,
        timeout: TIME_OUT,
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }

  async postFormData<T>(path: string, payload: any): Promise<T> {
    const csrfStore = useCsrfTokenStore();
    const csrfToken = csrfStore.getCsrfToken();
    const headers: any = {
      "Content-Type": "multipart/form-data",
      "X-CSRF-Token": csrfToken,
    };

    try {
      const response = await axios({
        method: "POST",
        url: path,
        data: payload,
        headers,
        timeout: TIME_OUT,
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }

  async putFormData<T>(path: string, payload: any): Promise<T> {
    const csrfStore = useCsrfTokenStore();
    const csrfToken = csrfStore.getCsrfToken();
    const headers: any = {
      "Content-Type": "multipart/form-data",
      "X-CSRF-Token": csrfToken,
    };

    try {
      const response = await axios({
        method: "PUT",
        url: path,
        data: payload,
        headers,
        timeout: TIME_OUT,
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }

  async postFile<T>(path: string, payload: any): Promise<T> {
    const csrfStore = useCsrfTokenStore();
    const csrfToken = csrfStore.getCsrfToken();
    const headers: any = {
      "Content-Type": "application/octet-stream",
      "X-CSRF-Token": csrfToken,
    };

    try {
      const response = await axios({
        method: "POST",
        url: path,
        data: payload,
        headers,
        timeout: TIME_OUT,
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }

  async putFile<T>(path: string, payload: any): Promise<T> {
    const csrfStore = useCsrfTokenStore();
    const csrfToken = csrfStore.getCsrfToken();
    const headers: any = {
      "Content-Type": "application/octet-stream",
      "X-CSRF-Token": csrfToken,
    };

    try {
      const response = await axios({
        method: "PUT",
        url: path,
        data: payload,
        headers,
        timeout: TIME_OUT,
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }
}
