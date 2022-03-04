import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TaskStatus } from '../task-status.enum';
export class GetTasksFilterDto {
  @IsOptional()
  @IsEnum(TaskStatus,{
    message:`You have not provided a valid Enum selection`
  })
  status?: TaskStatus;

  @IsOptional()
  @IsString()
  search?: string;
}
