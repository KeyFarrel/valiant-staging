import BaseService from "./base-service";

const url = import.meta.env.VITE_API_URL;

export default class ParameterService extends BaseService {

    async getParameterData<T>(page?:any, limit?:any, search?:any): Promise<T> {
        return this.get(`${url}parameter`, {page: page, limit: limit,search:search});
      }

      async getParameterByID<T>(id:any): Promise<T> {
        return this.get(`${url}parameter/${id}`);
      }

      async editParameter<T>(id:any,data:any): Promise<T> {
        return this.put(`${url}parameter/${id}`,data);
      }

      async addParameter<T>(data:any): Promise<T> {
        return this.post(`${url}parameter`,data);
      }



}
