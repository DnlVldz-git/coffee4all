export interface IVentasProductos {
  productoId: number;
  ventaId?: number;
}

export class VentasProductos implements IVentasProductos {
  productoId: number;
  ventaId: number;

  constructor(data: IVentasProductos) {
    this.productoId = data.productoId;
    this.ventaId = data.ventaId || 0;
  }
}
