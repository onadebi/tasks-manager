import { IsNotEmpty } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty({
    message: 'The title field is a required field',
  })
  public title: string;

  @IsNotEmpty({
    message: 'The description entry is a required field',
  })
  public description: string;
}
