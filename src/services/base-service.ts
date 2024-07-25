import axios from "axios";
import { store } from "../store";
import { encryptStorage, encryptedUserInfo } from "@/utils/app-encrypt-storage";

const nodeMode: any = import.meta.env.MODE;
const TIME_OUT = 120000;

export default class BaseService {
  role_id: string | null;

  constructor() {
    this.role_id = nodeMode === 'production' ? encryptStorage.getItem('role_id') : localStorage.getItem('role_id') || null;
  }

  async api<T>(
    method: string,
    path: string,
    payload?: any,
    contentType?: string
  ): Promise<T> {
    const headers: any = {
      "Content-Type": contentType || "application/json",
    };

    const token = store.getState().token;
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    if (this.role_id) {
      headers['Role-ID'] = this.role_id;
  }

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
    const headers: any = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${nodeMode === 'production' ? encryptStorage.getItem('token') : localStorage.getItem("token")}`,
    };

    try {
      const response = await axios({
        method: "GET",
        url: path,
        headers,
        timeout: TIME_OUT,
        params: params,
        responseType: responseType
      });
      return response.data;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }
  async getFile<T>(path: string, params?: any, responseType?: any): Promise<T> {
    const headers: any = {
      Authorization: `Bearer ${nodeMode === 'production' ? encryptStorage.getItem('token') : localStorage.getItem("token")}`,
    };

    try {
      const response: any = await axios({
        method: "GET",
        url: path,
        headers,
        timeout: TIME_OUT,
        params: params,
        responseType: responseType
      });
      return response;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }

  async post<T>(path: string, payload?: any, isMinio?: boolean): Promise<T> {
    let headers: any;
    if(isMinio){
      headers= {
        "Content-Type": "application/json"
      };
      
    }else{
      headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${nodeMode === 'production' ? encryptStorage.getItem('token') : localStorage.getItem("token")}`,
      };
    }

    try {
      const response = await axios({
        method: "POST",
        url: path,
        data: payload,
        headers,
        timeout: TIME_OUT,
      });
      return response.data;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }

  async put<T>(path: string, payload?: any): Promise<T> {
    const headers: any = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${nodeMode === 'production' ? encryptStorage.getItem('token') : localStorage.getItem("token")}`,
    };

    try {
      const response = await axios({
        method: "PUT",
        url: path,
        data: payload,
        headers,
        timeout: TIME_OUT,
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
      Authorization: `Bearer ${nodeMode === 'production' ? encryptStorage.getItem('token') : localStorage.getItem("token")}`,
    };

    try {
      const response = await axios({
        method: "PATCH",
        url: path,
        data: payload,
        headers,
        timeout: TIME_OUT,
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
      Authorization: `Bearer ${nodeMode === 'production' ? encryptStorage.getItem('token') : localStorage.getItem("token")}`,
    };

    try {
      const response = await axios({
        method: "DELETE",
        url: path,
        headers,
        timeout: TIME_OUT,
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
      Authorization: `Bearer ${nodeMode === 'production' ? encryptStorage.getItem('token') : localStorage.getItem("token")}`,
    };

    try {
      const response = await axios({
        method: "POST",
        url: path,
        data: payload,
        headers,
        timeout: TIME_OUT,
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
      Authorization: `Bearer ${nodeMode === 'production' ? encryptStorage.getItem('token') : localStorage.getItem("token")}`,
    };

    try {
      const response = await axios({
        method: "PUT",
        url: path,
        data: payload,
        headers,
        timeout: TIME_OUT,
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
      Authorization: `Bearer ${nodeMode === 'production' ? encryptStorage.getItem('token') : localStorage.getItem("token")}`,
    };

    try {
      const response = await axios({
        method: "POST",
        url: path,
        data: payload,
        headers,
        timeout: TIME_OUT,
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
      Authorization: `Bearer ${nodeMode === 'production' ? encryptStorage.getItem('token') : localStorage.getItem("token")}`,
    };

    try {
      const response = await axios({
        method: "PUT",
        url: path,
        data: payload,
        headers,
        timeout: TIME_OUT,
      });
      return response.data;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }
}
