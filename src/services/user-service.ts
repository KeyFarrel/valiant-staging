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
    async getPembina<T>(param?: any): Promise<T> {
        return this.get(`${url}filter/combo-pembina`, param);
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
    async resetPassword<T>(emailConfirm: string, emailReset: string): Promise<T> {
        return this.post(`${url}user/reset-password`, {email_confirm: emailConfirm, email: emailReset});
    }
    async updateUser<T>(id: number, data: any): Promise<T> {
        return this.post(`${url}user/${id}`, data);
    }
    async getSentralByPengelola<T>(idPengelola: number, idPembina: number): Promise<T> {
        return this.get(`${url}filter/combo-sentral`, {id_pengelola: idPengelola, id_pembina: idPembina});
    }
    async sendEmailOtp<T>(): Promise<T> {
        return this.post(`${url}user/otp-change-password`);
    }
    async verifyOtp<T>(otp: string): Promise<T> {
        return this.post(`${url}user/verify-otp-change-password`, {otp: otp});
    }
}
