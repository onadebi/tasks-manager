import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty()
  @IsNotEmpty({
    message: 'The title field is a required field',
  })
  public title: string;

  @ApiProperty()
  @IsNotEmpty({
    message: 'The description entry is a required field',
  })
  public description: string;
}
