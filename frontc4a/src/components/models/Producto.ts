import { InsumoProducto } from "./InsumoProducto";

export interface IProducto {
  id: number;
  idVenta?: number;
  nombre: string;
  precio: number;
  foto: string;
  insumos: Array<InsumoProducto>;
}

export class Producto implements IProducto {
  id: number;
  idVenta?: number;
  nombre: string;
  precio: number;
  foto: string;
  insumos: Array<InsumoProducto>;

  constructor(data: IProducto) {
    this.id = data.id;
    this.idVenta = data.idVenta || 0;
    this.nombre = data.nombre;
    this.precio = data.precio;
    this.foto = data.foto;
    this.insumos = data.insumos;
  }
}
