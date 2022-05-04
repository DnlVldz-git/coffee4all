import httpClient from "./HttpClient";
import { IInsumoProducto, InsumoProducto } from "../models/InsumoProducto";

const prefix = "/insumosProductos";

export default class ProductoService {
    static async getAll():Promise<{ insumoProductos: Array<IInsumoProducto>}> {

        const result = (await httpClient.get(prefix)).data;
        const insumoProductos: Array<IInsumoProducto> = [];
        for (const insumoProducto of result) insumoProductos.push(new InsumoProducto(insumoProducto));
        
    
        return {
            insumoProductos
        };
    }

    static async getWithId(id: number):Promise<{ insumoProductos: Array<IInsumoProducto>}> {

        const result = (await httpClient.get(prefix+"/"+id)).data;
        const insumoProductos: Array<IInsumoProducto> = [];
        for (const insumoProducto of result) insumoProductos.push(new InsumoProducto(insumoProducto));
    
        return {
            insumoProductos
        };
    }
}