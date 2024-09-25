import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsStrongPassword,
  Matches,
  IsOptional,
  IsEnum,
  IsPostalCode,
  IsArray,
} from 'class-validator';

export enum UserRole {
  user = 'user',
  admin = 'admin',
}

export class SignUpDTO {
  @IsNotEmpty()
  @IsString()
  username!: string;

  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).*$/, {
    message:
      'Password must contain at least one digit, one lowercase, one uppercase letter, and one special character',
  })
  password!: string;
}

export class CreateAdminDTO {
  @IsNotEmpty()
  @IsString()
  username!: string;

  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).*$/, {
    message:
      'Password must contain at least one digit, one lowercase, one uppercase letter, and one special character',
  })
  password!: string;

  @IsNotEmpty()
  @IsEnum(UserRole)
  @IsString()
  role!: UserRole;
}

export class SignInDTO {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsStrongPassword()
  @IsNotEmpty()
  password!: string;
}

export class ResetPasswordDTO {
  @IsString()
  token!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).*$/, {
    message:
      'Password must contain at least one digit, one lowercase, one uppercase letter, and one special character',
  })
  password!: string;
}

export class UpdateDTO {
  @IsOptional()
  @IsString()
  username?: string;
}
