import { InsumoProveedor } from "./InsumoProveedor";

export interface IProveedor {
  id: number;
  nombre: string;
  telefono: string;
  email: string;
  insumos: Array<InsumoProveedor>;
}

export class Proveedor implements IProveedor {
    id: number;
    nombre: string;
    telefono: string;
    email: string;
    insumos: Array<InsumoProveedor>;

  constructor(data: IProveedor) {
    this.id = data.id;
    this.nombre = data.nombre;
    this.telefono = data.telefono;
    this.email = data.email;
    this.insumos = data.insumos;
  }
}