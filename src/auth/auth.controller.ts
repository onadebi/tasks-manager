import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import GenResponseDto from 'src/config/GenResponse.dto';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-crednetials.dto';
import { User } from './user.entity';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  signUp(
    @Body() authCredentials: AuthCredentialsDto,
  ): Promise<GenResponseDto<string | void>> {
    return this.authService.signUp(authCredentials);
  }

  @Post('/signin')
  async signIn(@Body() authCredentials: AuthCredentialsDto): Promise<{accessToken: string}> {
    return await this.authService.signIn(authCredentials);
  }
}
