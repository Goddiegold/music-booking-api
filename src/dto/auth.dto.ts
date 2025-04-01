import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class ResetPaswordStep1DTO {
  @IsString()
  @IsEmail()
  email: string;
}

export class ResetPaswordStep2DTO {
  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  @MaxLength(50)
  newPassword: string;
}

export class LoginInputDTO {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  @MaxLength(50)
  password: string;
}
