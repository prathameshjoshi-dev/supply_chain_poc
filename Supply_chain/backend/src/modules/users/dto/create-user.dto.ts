import { IsEmail, IsNotEmpty, IsString, MinLength, IsEnum, IsOptional, IsArray } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(['admin', 'manager', 'supervisor', 'viewer'])
  @IsNotEmpty()
  role: string;

  @IsArray()
  @IsOptional()
  warehouseIds?: string[];
}
