import { IsString, IsNotEmpty, IsOptional, IsArray, IsNumber, IsEnum } from 'class-validator';

// DTOs are used to validate and sanitize data before it is sent to the database
export enum category {
  clothing = 'clothing',
  shoes = 'shoes',
  electronics = 'electronics',
  computers = 'computers',
  smartphones = 'smartphones',
  sports = 'sports',
  accessories = 'accessories',
}

export class CreateProductDTO {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsString()
  description!: string;

  @IsNotEmpty()
  @IsNumber()
  price!: number;

  @IsNotEmpty()
  @IsNumber()
  quantity!: number;

  @IsNotEmpty()
  @IsEnum(category, { each: true })
  category!: category[];

  @IsNotEmpty()
  @IsNumber()
  storeId!: number;

  @IsOptional()
  @IsNumber()
  createdBy?: number;
}

export class UpdateProductDTO {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  quantity?: number;

  @IsOptional()
  @IsEnum(category, { each: true })
  category?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  storeId?: number;
}
