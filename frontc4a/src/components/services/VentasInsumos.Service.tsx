import httpClient from "./HttpClient";
import { VentasInsumo, IVentasInsumo } from "../models/VentasInsumos";

const prefix = "/ventasInsumos";

export default class ProductoService {
    static async getAll():Promise<{ ventasInsumos: Array<IVentasInsumo>}> {

        const result = (await httpClient.get(prefix)).data;
        const ventasInsumos: Array<IVentasInsumo> = [];
        for (const ventasInsumos of result) ventasInsumos.push(new VentasInsumo(ventasInsumos));
        
    
        return {
            ventasInsumos
        };
    }

    static async getWithId(id: number):Promise<{ ventasInsumos: Array<IVentasInsumo>}> {

        const result = (await httpClient.get(prefix+"/"+id)).data;
        const ventasInsumos: Array<IVentasInsumo> = [];
        for (const ventasInsumos of result) ventasInsumos.push(new VentasInsumo(ventasInsumos));
    
        return {
            ventasInsumos
        };
    }
}