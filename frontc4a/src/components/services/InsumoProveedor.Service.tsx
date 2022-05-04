import httpClient from "./HttpClient";
import {  IInsumoProveedor } from "../models/InsumoProveedor";
import { InsumoProveedor } from "../models/InsumoProveedor";

const prefix = "/insumosProveedores";

export default class ProductoService {
    static async getAll():Promise<{ InsumoProveedores: Array<IInsumoProveedor>}> {

        const result = (await httpClient.get(prefix)).data;
        const InsumoProveedores: Array<IInsumoProveedor> = [];        
        for (const insumoProveedor of result) InsumoProveedores.push(new InsumoProveedor(insumoProveedor));
        
    
        return {
            InsumoProveedores
        };
    }

    static async getWithId(id: number):Promise<{ InsumoProveedores: Array<IInsumoProveedor>}> {

        const result = (await httpClient.get(prefix+"/"+id)).data;
        const InsumoProveedores: Array<IInsumoProveedor> = [];
        for (const insumoProveedor of result) InsumoProveedores.push(new InsumoProveedor(insumoProveedor));
    
        return {
            InsumoProveedores
        };
    }
}