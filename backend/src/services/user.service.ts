import { AppDataSource } from "../data/data-source";
import { User } from "../models/User";
import * as bcrypt from 'bcrypt';

const userRepository = AppDataSource.getRepository(User);

export class UserService {
    static async createUser(email: string, password: string, role: 'user') {
      
    }
}