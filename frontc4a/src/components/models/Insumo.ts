
export interface IInsumo {
    id: number;
    nombre: string;
    medicion: string;
    foto: string;
  }
  
  export class Insumo implements IInsumo {
      id: number;
      nombre: string;
      medicion: string;
      foto: string;
  
    constructor(data: IInsumo) {
      this.id = data.id;
      this.nombre = data.nombre;
      this.medicion = data.medicion;
      this.foto = data.foto;
    }
  }