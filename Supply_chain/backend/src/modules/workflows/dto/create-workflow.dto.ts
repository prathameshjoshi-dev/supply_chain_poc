import { IsString, IsNotEmpty, IsArray, IsOptional, IsDateString } from 'class-validator';

export class CreateWorkflowDto {
  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsNotEmpty()
  priority: string;

  @IsString()
  @IsOptional()
  assignee?: string;

  @IsString()
  @IsOptional()
  relatedEntityId?: string;

  @IsDateString()
  @IsNotEmpty()
  dueAt: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
