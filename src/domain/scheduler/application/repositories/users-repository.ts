import { User } from "../../enterprise/entities/user";

export interface UsersRepository {
  findMany(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(user: User): Promise<void>;
  save(user: User): Promise<void>;
  delete(user: User): Promise<void>; 
}
