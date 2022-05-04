import httpClient from "./HttpClient";
import { IVenta, Venta } from "../models/Ventas";

const prefix = "/ventas";

export default class VentaService {
  
  static async create(venta: IVenta) {
    return (await httpClient.post(`${prefix}/`, venta)).data;
  }

  static async update(venta: IVenta) {
    return (await httpClient.put(`${prefix}/${venta.id}`, venta)).data;
  }

  static async remove(id: number) {
    return (await httpClient.delete(`${prefix}/${id}`)).data;
  }

  static async getAll(
  ): Promise<{ ventas: Array<IVenta>; total: number }> {
    let url = prefix;
    const result = (await httpClient.get(url)).data;
    const ventas: Array<IVenta> = [];
    for (const venta of result.rows) ventas.push(new Venta(venta));
    return {
      ventas,
      total: result.count,
    };
  }

  static async list(
    limit: number,
    offset: number,
  ): Promise<{ ventas: Array<IVenta>; total: number }> {
    let url = `${prefix}?limit=${limit}&offset=${offset}`;

    const result = (await httpClient.get(url)).data;
    const ventas: Array<IVenta> = [];
    for (const venta of result.rows) ventas.push(new Venta(venta));

    return {
      ventas,
      total: result.count,
    };
  }

}
