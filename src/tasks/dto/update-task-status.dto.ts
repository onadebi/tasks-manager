import { IsEnum } from 'class-validator';
import { TaskStatus } from '../task-status.enum';

export class UpdateStackStatus {
  @IsEnum(TaskStatus, {
    message: 'Use only allowable options of enum',
  })
  status: TaskStatus;
}
