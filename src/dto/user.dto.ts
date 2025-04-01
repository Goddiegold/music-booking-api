import { user_role } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class CreateUserDTO {
  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(50)
  password: string;
}

export class UpdateUserDTO {
  @IsPhoneNumber()
  @IsOptional()
  phone: string;

  @IsString()
  @IsOptional()
  name: string;

  @IsOptional()
  @MinLength(8)
  @MaxLength(50)
  @IsString()
  password: string;
}

export class UpdatePasswordDTO {
  @IsString()
  @IsNotEmpty()
  newPassword: string;

  @IsString()
  @IsNotEmpty()
  currentPassword: string;
}

export class CompleteOnboardingDTO {
  @IsEnum([user_role.event_organizer, user_role.artist], {
    message: 'accountType must be either event_organizer or artist',
  })
  @IsNotEmpty()
  accountType: keyof typeof user_role;
}
