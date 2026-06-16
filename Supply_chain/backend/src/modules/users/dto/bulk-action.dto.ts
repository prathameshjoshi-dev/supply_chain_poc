import { IsArray, IsNotEmpty, IsString, IsEnum } from 'class-validator';

export class BulkActionDto {
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  userIds: string[];

  @IsEnum(['delete', 'suspend'])
  @IsNotEmpty()
  action: string;
}
