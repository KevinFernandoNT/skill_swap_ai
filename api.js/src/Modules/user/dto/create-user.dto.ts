export class CreateUserDto {
  readonly email: string;
  readonly password: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly name?: string;
  readonly bio?: string;
  readonly location?: string;
  readonly avatar?: string;
  readonly role?: string;
} 