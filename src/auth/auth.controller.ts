import { Body, Controller, Post } from '@nestjs/common';
import GenResponse from 'src/config/GenResponse';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-crednetials.dto';
import { User } from './user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  signUp(
    @Body() authCredentials: AuthCredentialsDto,
  ): Promise<GenResponse<string | void>> {
    return this.authService.signUp(authCredentials);
  }

  @Post('/signin')
  async signIn(@Body() authCredentials: AuthCredentialsDto): Promise<string> {
    return await this.authService.signIn(authCredentials);
  }
}
