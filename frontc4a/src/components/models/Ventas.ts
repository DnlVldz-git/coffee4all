import { IVentasInsumo } from "./VentasInsumos";
import { Producto } from "./Producto";

/* Defining the interface for the class. */
export interface IVenta {
  id?: number;
  nombre: string;
  fecha: string;
  total: number;
  usuarioId: number;
  insumos: Array<IVentasInsumo>;
  productos: Array<Producto>;
}

/* Venta is a class that implements IVenta and has a constructor that takes an object of type IVenta
and assigns the properties of the object to the properties of the class. */
export class Venta implements IVenta {
  id?: number;
  nombre: string;
  fecha: string;
  total: number;
  usuarioId: number;
  insumos: Array<IVentasInsumo>;
  productos: Array<Producto>; 

  constructor(data: IVenta) {
    this.id = data.id || 0;
    this.nombre = data.nombre;
    this.fecha = data.fecha;
    this.total = data.total;
    this.usuarioId = data.usuarioId;    
    this.insumos = data.insumos;
    this.productos = data.productos;
  }
}
