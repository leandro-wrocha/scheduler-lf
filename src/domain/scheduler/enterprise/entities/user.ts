import { AggregateRoot } from '@/core/entities/aggregate-root';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export interface UserProps {
  id?: UniqueEntityID;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class User extends AggregateRoot<UserProps> {
  private constructor(props: UserProps, id?: UniqueEntityID) {
    super(props, id);
  }

  get firstName(): string {
    return this.props.firstName;
  }

  get lastName(): string {
    return this.props.lastName;
  }

  get email(): string{
    return this.props.email;
  }

  get password(): string {
    return this.props.password;
  }

  get createdAt(): Date | undefined {
    return this.props.createdAt;
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  static create(
    props: Omit<UserProps, 'createdAt' | 'updatedAt'>,
    id?: UniqueEntityID,
  ): User {
    return new User({ ...props, createdAt: new Date(), updatedAt: new Date() }, id);
  }
}
