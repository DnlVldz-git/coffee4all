import httpClient from "./HttpClient";
import { IProducto, Producto } from "../models/Producto";

const prefix = "/productos";

export default class ProductoService {
  static async create(producto: IProducto) {
    return (await httpClient.post(`${prefix}/`, producto)).data;
  }

  static async update(producto: IProducto) {
    return (await httpClient.put(`${prefix}/${producto.id}`, producto)).data;
  }

  static async remove(id: number) {
    return (await httpClient.delete(`${prefix}/${id}`)).data;
  }

  static async getAll(
  ): Promise<{ productos: Array<IProducto>; total: number }> {
    let url = prefix;
    const result = (await httpClient.get(url)).data;
    const productos: Array<IProducto> = [];
    for (const producto of result.rows) productos.push(new Producto(producto));
    return {
      productos,
      total: result.count,
    };
  }

  static async list(
    limit: number,
    offset: number,
  ): Promise<{ productos: Array<IProducto>; total: number }> {
    let url = `${prefix}?limit=${limit}&offset=${offset}`;

    const result = (await httpClient.get(url)).data;
    const productos: Array<IProducto> = [];
    for (const producto of result.rows) productos.push(new Producto(producto));
    return {
      productos,
      total: result.count,
    };
  }

}
