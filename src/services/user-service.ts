import BaseService from "./base-service";

const url = import.meta.env.VITE_API_URL;

export default class UserService extends BaseService {
    async getUserData<T>(page?:any, limit?:any, search?:any): Promise<T> {
        return this.get(`${url}user`, {page: page, limit: limit, search: search});
    }
    async getUserById<T>(id:number): Promise<T> {
        return this.get(`${url}user/${id}`);
    }
    async getSentral<T>(): Promise<T> {
        return this.get(`${url}filter/combo-sentral`);
    }
    async getRole<T>(): Promise<T> {
        return this.get(`${url}role/combo-role`);
    }
    async getInduk<T>(): Promise<T> {
        return this.get(`${url}filter/combo-pengelola`);
    }
    async getPembina<T>(idPengelola: any): Promise<T> {
        return this.get(`${url}filter/combo-pembina`, {id_pengelola: idPengelola});
    }
    async getMesin<T>(): Promise<T> {
        return this.get(`${url}filter/combo-mesin`);
    }
    async getLevel<T>(): Promise<T> {
        return this.get(`${url}level`);
    }
    async createUser<T>(dataToPost: any): Promise<T> {
        return this.post(`${url}user`, dataToPost);
    }
    async updateUser<T>(id: number, data: any): Promise<T> {
        return this.put(`${url}user/${id}`, data);
    }
    async getSentralByPengelola<T>(idPengelola: number, idPembina: number): Promise<T> {
        return this.get(`${url}filter/combo-sentral`, {id_pengelola: idPengelola, id_pembina: idPembina});
    }
}
