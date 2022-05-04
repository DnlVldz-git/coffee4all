export interface IInsumoProducto {
  insumoId: number;
  productoId?: number;
  productoVentaId?: number;
  cantidad: number;
}

export class InsumoProducto implements IInsumoProducto {  
  insumoId: number;
  productoId: number;
  productoVentaId?: number;
  cantidad: number;

  constructor(data: IInsumoProducto) {
    this.insumoId = data.insumoId;
    this.productoVentaId = data.productoVentaId || 0;
    this.productoId = data.productoId || 0;
    this.cantidad = data.cantidad;
  }
}
