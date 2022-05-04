import httpClient from "./HttpClient";
import { IProveedor, Proveedor } from "../models/Proveedor";

const prefix = "/proveedores";

export default class ProveedorService {
  static async create(proveedor: IProveedor) {
    return (await httpClient.post(`${prefix}/`, proveedor)).data;
  }

  static async update(proveedor: IProveedor) {
    return (await httpClient.put(`${prefix}/${proveedor.id}`, proveedor)).data;
  }

  static async remove(id: number) {
    return (await httpClient.delete(`${prefix}/${id}`)).data;
  }

  static async list(
    limit: number,
    offset: number,
  ): Promise<{ proveedores: Array<IProveedor>; total: number }> {
    let url = `${prefix}?limit=${limit}&offset=${offset}`;

    const result = (await httpClient.get(url)).data;
    const proveedores: Array<IProveedor> = [];
    for (const proveedor of result.rows) proveedores.push(new Proveedor(proveedor));
    return {
      proveedores,
      total: result.count,
    };
  }

}
