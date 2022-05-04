export interface IInsumoProveedor {
  insumoId: number;
  proveedorId?: number;
  cantidad: number;
  precio: number;
}

export class InsumoProveedor implements IInsumoProveedor {
  constructor(data: IInsumoProveedor) {
    this.insumoId = data.insumoId;
    this.proveedorId = data.proveedorId || 0;
    this.cantidad = data.cantidad;
    this.precio = data.precio;
  }

  insumoId: number;
  proveedorId: number;
  cantidad: number;
  precio: number;
}
