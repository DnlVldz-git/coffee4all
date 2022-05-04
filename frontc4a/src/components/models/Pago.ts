export interface IPago {
  id: number;
  dinero: number;
}

export class Pago implements IPago {
  id: number;
  dinero: number;

  constructor(data: IPago) {
    this.id = data.id;
    this.dinero = data.dinero;
  }
}
