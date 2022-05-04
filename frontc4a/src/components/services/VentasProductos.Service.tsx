import httpClient from "./HttpClient";
import { VentasProductos, IVentasProductos } from "../models/VentasProductos";

const prefix = "/ventasProductos";

export default class VentasProductoService {
  static async getAll(): Promise<{ ventasProductos: Array<IVentasProductos> }> {
    const result = (await httpClient.get(prefix)).data;
    const ventasProductos: Array<IVentasProductos> = [];
    for (const ventaProducto of result)
      ventasProductos.push(new VentasProductos(ventaProducto));

    return {
      ventasProductos,
    };
  }

  static async getWithId(
    id: number
  ): Promise<{ ventasProductos: Array<IVentasProductos> }> {
    const result = (await httpClient.get(prefix + "/" + id)).data;
    const ventasProductos: Array<IVentasProductos> = [];
    for (const ventaProducto of result)
      ventasProductos.push(new VentasProductos(ventaProducto));

    return {
      ventasProductos,
    };
  }
}
