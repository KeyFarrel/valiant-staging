import BaseService from "./base-service";

const url = import.meta.env.VITE_API_URL;

export default class RoleService extends BaseService {

    async getRoleData<T>(page?:any, limit?:any, role?:any): Promise<T> {
        return this.get(`${url}role`, {page: page, limit: limit, role: role });
    }

    async getLevel<T>(): Promise<T> {
        return this.get(`${url}level`);
    }

    async getRoleById<T>(id:number): Promise<T> {
        return this.get(`${url}role/${id}`);
    }

    async createRole<T>(formData: any): Promise<T> {
        return this.post(`${url}role`, formData);
    }
 
    async updateRole<T>(id: number, data: any): Promise<T> {
      return this.put(`${url}role/${id}`, data);
    }

    async getPermission<T>(): Promise<T> {
        return this.get(`${url}permission`);
    }

    async getPermissionByRoleId<T>(id: number): Promise<T> {
        return this.get(`${url}rolepermission?role_id=${id}`);
    }

    async updateRolePermission<T>(id: number, data: any): Promise<T> {
        console.log("Sending data:", data);
        return this.put(`${url}rolepermission/${id}`, data);
    }
}
