import { IUser, User } from "../models/User";
import httpClient from "./HttpClient";

const prefix = "/usuarios";

export default class UserService {
  static async register(user: IUser) {
    return (await httpClient.post(`${prefix}/`, user)).data;
  }

  static async create(user: User) {
    return (await httpClient.post(`${prefix}`, user)).data;
  }

  static async update(user: IUser) {
    return (await httpClient.put(`${prefix}/${user.id}`, user)).data;
  }

  static async remove(id: number) {
    return (await httpClient.delete(`${prefix}/${id}`)).data;
  }

  static async login(user: any) {
    return (await httpClient.post(`${prefix}/login`, user)).data;
  }

  static async list(
    limit: number,
    offset: number,
  ): Promise<{ users: Array<User>; total: number }> {
    let url = `${prefix}?limit=${limit}&offset=${offset}`;

    const result = (await httpClient.get(url)).data;
    const users: Array<User> = [];
    for (const user of result.rows) users.push(new User(user));

    return {
      users,
      total: result.count,
    };
  }
}
