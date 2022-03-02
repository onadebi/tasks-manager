import { IsEnum } from 'class-validator';
import { TaskStatus } from '../task.model';

export class UpdateStackStatus {
  @IsEnum(TaskStatus, {
    message: 'Use only allowable options of enum',
  })
  status: TaskStatus;
}
