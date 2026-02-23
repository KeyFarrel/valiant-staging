import BaseService from "./base-service";

const url = import.meta.env.VITE_API_URL;

export default class RoleService extends BaseService {
  async getLevel<T>(): Promise<T> {
    return this.get(`${url}level`);
  }
}
