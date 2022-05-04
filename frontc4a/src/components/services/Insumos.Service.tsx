import httpClient from "./HttpClient";
import { IInsumo, Insumo } from "../models/Insumo";

const prefix = "/insumos";

export default class InsumoService {
  static async create(insumo: IInsumo) {
    return (await httpClient.post(`${prefix}/`, insumo)).data;
  }

  static async update(insumo: IInsumo) {
    return (await httpClient.put(`${prefix}/${insumo.id}`, insumo)).data;
  }

  static async remove(id: number) {
    return (await httpClient.delete(`${prefix}/${id}`)).data;
  }

  static async getAll(): Promise<{ insumos: Array<Insumo> }> {
    const result = (await httpClient.get(prefix)).data;
    const insumos: Array<IInsumo> = [];
    for (const insumo of result.rows) insumos.push(new Insumo(insumo));

    return {
      insumos
    };
  }

  static async list(
    limit: number,
    offset: number
  ): Promise<{ insumos: Array<Insumo>; total: number }> {
    let url = `${prefix}?limit=${limit}&offset=${offset}`;

    const result = (await httpClient.get(url)).data;
    const insumos: Array<Insumo> = [];

    for (const insumo of result.rows) insumos.push(new Insumo(insumo));

    return {
      insumos,
      total: result.count,
    };
  }
}
