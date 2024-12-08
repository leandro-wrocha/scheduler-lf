import { UsersRepository } from '../repositories/users-repository';
import { Either, right, left } from '@/core/either';
import { User } from '../../enterprise/entities/user';
import { AlreadyExistsError } from './errors/already-exists-error';
import { Password } from '../../enterprise/entities/value-objects/password';

interface CreateUserUseCaseRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export type CreateUserUseCaseResponse = Either<AlreadyExistsError, null>;

export class CreateUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute(request: CreateUserUseCaseRequest): Promise<CreateUserUseCaseResponse> {
    const { firstName, lastName, email, password } = request;

    const userAlreadyExists = await this.usersRepository.findByEmail(email);

    if (userAlreadyExists) return left(new AlreadyExistsError('User'));

    const hashedPassword = await Password.create(password);

    const user = User.create({ firstName, lastName, email, password: hashedPassword });
  
    await this.usersRepository.create(user);

    return right(null);
  }
}
