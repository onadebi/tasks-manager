import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class AuthCredentialsDto {
  @ApiProperty({
    description: 'Required username field',
    example: 'john_doe',
  })
  @IsNotEmpty({
    message: 'Username field is required',
  })
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(32)
  @ApiProperty({
    description: 'USer password - required',
    example: '********',
  })
  password: string;
}
