import axios, { AxiosResponse } from "axios";
import { encryptStoragePromise } from "@/utils/app-encrypt-storage";
import { encryptAES } from "./helper/encryption";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

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
      // Authorization: `Bearer ${nodeMode === 'production' ? encryptStorage.getItem('token') : localStorage.getItem("token")}`,
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
      return nodeMode !== 'development' ? response.data.response : response.data;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }
  async getFile<T>(path: string, params?: any, responseType?: any): Promise<T> {
    const headers: any = {
      // Authorization: `Bearer ${nodeMode === 'production' ? encryptStorage.getItem('token') : localStorage.getItem("token")}`,
    };

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
    withCredentials?: boolean,
  ): Promise<T> {
    const fingerprintID = await getFingerprint();
    const headers: any = {
      // Authorization: `Bearer ${nodeMode === 'production' ? encryptStorage.getItem('token') : localStorage.getItem("token")}`,
      "Content-Type": "application/json",
      "X-Fingerprint-ID": fingerprintID,
    };
    try {
      const response: AxiosResponse = await axios({
        method: "POST",
        url: path,
        withCredentials: true,
        data: nodeMode !== 'development' ? encryptAES(JSON.stringify(payload)) : payload,
        headers,
        timeout: TIME_OUT,
      });
      console.log("Response Method Post:", response);
      return nodeMode !== 'development' ? response.data.response : response.data;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }

  async put<T>(path: string, payload?: any): Promise<T> {
    const headers: any = {
      "Content-Type": "application/json",
      // Authorization: `Bearer ${nodeMode === 'production' ? encryptStorage.getItem('token') : localStorage.getItem("token")}`,
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
    const headers: any = {
      "Content-Type": "application/json",
      // Authorization: `Bearer ${nodeMode === 'production' ? encryptStorage.getItem('token') : localStorage.getItem("token")}`,
    };

    try {
      const response = await axios({
        method: "PATCH",
        url: path,
        data: encryptAES(JSON.stringify(payload)),
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
    const headers: any = {
      "Content-Type": "application/json",
      // Authorization: `Bearer ${nodeMode === 'production' ? encryptStorage.getItem('token') : localStorage.getItem("token")}`,
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
    const headers: any = {
      "Content-Type": "multipart/form-data",
      // Authorization: `Bearer ${nodeMode === 'production' ? encryptStorage.getItem('token') : localStorage.getItem("token")}`,
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
    const headers: any = {
      "Content-Type": "multipart/form-data",
      // Authorization: `Bearer ${nodeMode === 'production' ? encryptStorage.getItem('token') : localStorage.getItem("token")}`,
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
    const headers: any = {
      "Content-Type": "application/octet-stream",
      // Authorization: `Bearer ${nodeMode === 'production' ? encryptStorage.getItem('token') : localStorage.getItem("token")}`,
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
    const headers: any = {
      "Content-Type": "application/octet-stream",
      // Authorization: `Bearer ${nodeMode === 'production' ? encryptStorage.getItem('token') : localStorage.getItem("token")}`,
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
