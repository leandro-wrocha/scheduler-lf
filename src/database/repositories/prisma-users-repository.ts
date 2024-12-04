import { UsersRepository } from "@/domain/scheduler/application/repositories/users-repository";
import { User } from "@/domain/scheduler/enterprise/entities/user";
import { PrismaService } from ".";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

export class PrismaUsersRepository implements UsersRepository {
  constructor (private readonly prismaService: PrismaService) {}

  async findMany(): Promise<User[]> {
    const users = await this.prismaService.client.user.findMany();

    return users.map(user => User.create({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
    }, new UniqueEntityID(user.id)));
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prismaService.client.user.findUnique({
      where: {
        id
      }
    });

    if (!user) return null;

    return User.create({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password
    }, new UniqueEntityID(user.id));
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prismaService.client.user.findUnique({
      where: { email }
    });

    if (!user) return null;

    return User.create({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password
    }, new UniqueEntityID(user.id));
  }

  async create(user: User): Promise<void> {
    await this.prismaService.client.user.create({
      data: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: user.password,
        id: user.id.toString(),
      }
    });
  }

  async save(user: User): Promise<void> {
    await this.prismaService.client.user.update({
      where: { id: user.id.toString() },
      data: {
        firstName: user.firstName,
        lastName: user.lastName,
      }
    });
  }

  async delete(user: User): Promise<void> {
    await this.prismaService.client.user.delete({
      where: { id: user.id.toString() }
    })
  }
}