import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsEnum(['TO_DO', 'IN_PROGRESS', 'DONE'], { message: 'Not a valid status' })
  status: 'TO_DO' | 'IN_PROGRESS' | 'DONE' = 'TO_DO';
}
