import httpClient from "./HttpClient";
import { IInsumoProducto, InsumoProducto } from "../models/InsumoProducto";

const prefix = "/imagenes";

export default class ImagenesService {

  static async upload(file: any) {
    let data = new FormData();
    data.append("foto", file);
    const result = (await httpClient.post(prefix, data)).data;
    return {
      result,
    };
  }

  static async get(key: string):Promise<{ result: string}> {
    const result = (await httpClient.get(prefix + "/" + key)).data;
    
    return {
      result
    };
  }

  static async delete(key: string) {
    const result = (await httpClient.delete(prefix + "/" + key)).data;
    
    return {
      result,
    };
  }
}

