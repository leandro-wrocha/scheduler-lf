import { UsersRepository } from '../repositories/users-repository';
import { Either, right, left } from '@/core/either';
import { User } from '../../enterprise/entities/user';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

interface CreateUserUseCaseRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export type CreateUserUseCaseResponse = Either<ResourceNotFoundError, null>;

export class CreateUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute(request: CreateUserUseCaseRequest): Promise<CreateUserUseCaseResponse> {
    const { firstName, lastName, email, password } = request;

    const user = User.create({
      firstName, lastName, email, password
    });

    // if (user) return left(new ResourceNotFoundError());

    await this.usersRepository.create(user);

    return right(null);
  }
}
