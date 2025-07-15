import BaseService from "./base-service";

const url = import.meta.env.VITE_API_URL;

export default class ParameterService extends BaseService {
  async getParameterData<T>(page?: any, limit?: any, search?: any): Promise<T> {
    return this.get(`${url}parameter`, {
      page: page,
      limit: limit,
      search: search,
    });
  }

  async getParameterByID<T>(uuid: any): Promise<T> {
    return this.get(`${url}parameter/${uuid}`);
  }

  async editParameter<T>(uuid: any, data: any): Promise<T> {
    return this.post(`${url}parameter/${uuid}`, data);
  }

  async addParameter<T>(data: any): Promise<T> {
    return this.post(`${url}parameter`, data);
  }
}
