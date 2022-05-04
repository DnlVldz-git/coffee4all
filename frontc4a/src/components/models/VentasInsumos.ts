export interface IVentasInsumo {
    insumoId: number;
    ventaId?: number;
  }
  
  export class VentasInsumo implements IVentasInsumo {  
    insumoId: number;
    ventaId: number;
  
    constructor(data: IVentasInsumo) {
      this.insumoId = data.insumoId;
      this.ventaId = data.ventaId || 0;
    }
  }
  