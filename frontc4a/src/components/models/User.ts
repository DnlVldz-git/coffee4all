
export interface IUser {
  id?: number;
  nombre: string;
  apellido_pat?: string;
  apellido_mat?: string;
  foto?: string;
  telefono?: string;
  email?: string;
  rol?: string;
  pwd?: string;
}

export class User implements IUser {
    id?: number;
    nombre: string;
    apellido_pat?: string;
    apellido_mat?: string;
    foto?: string;
    telefono?: string;
    email?: string;
    rol?: string;
    pwd?: string;

  constructor(data: IUser) {
    this.id = data.id;
    this.nombre = data.nombre;
    this.apellido_pat = data.apellido_pat || "";
    this.apellido_mat = data.apellido_mat || "";
    this.pwd = data.pwd || "";
    this.foto = data.foto || "";
    this.telefono = data.telefono || "";    
    this.rol = data.rol || "";
    this.email = data.email || "";
  }

  isAdmin() {
    return this.rol === "Admin";
  }

  isUser() {
    return this.rol === "user";
  }

}
