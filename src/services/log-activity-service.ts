import BaseService from "./base-service";

const nodeMode: any = import.meta.env.MODE;
const url: any = import.meta.env.VITE_API_URL;

export default class LogActivityService extends BaseService {
  async getLogActivity<T>(param: any): Promise<T> {
    return this.post(`${url}log/all-log`, param);
  }
}

