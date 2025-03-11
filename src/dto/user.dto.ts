import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class CreateUserDTO {
  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsString()
  password: string;
}

export class UpdateUserDTO {
  @IsPhoneNumber()
  phone: string;
}

export class UpdatePasswordDTO {
  @IsString()
  @IsNotEmpty()
  newPassword: string;

  @IsString()
  @IsNotEmpty()
  currentPassword: string;
}
