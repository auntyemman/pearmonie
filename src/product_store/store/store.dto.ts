import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

// DTOs are used to validate and sanitize data before it is sent to the database
export class CreateStoreDTO {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsString()
  phone!: string;

  @IsNotEmpty()
  @IsString()
  location!: string;
}
export class UpdateStoreDTO {
  @IsString()
  @IsOptional()
  name?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  location?: string;
}
