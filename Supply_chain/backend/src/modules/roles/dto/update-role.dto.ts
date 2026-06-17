import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateRoleDto {
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  permissions?: string[];
}
