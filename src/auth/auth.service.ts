import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import GenResponseDto from 'src/config/GenResponse.dto';
import { AuthCredentialsDto } from './dto/auth-crednetials.dto';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { IJwtPayload } from './jwt-payload.interface';
import { access } from 'fs';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersRepository)
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(authCredentials: AuthCredentialsDto): Promise<GenResponseDto<string|void>> {
      const objResp =await this.usersRepository.createUser(authCredentials);
      if(!objResp.IsSuccess){
        if(objResp.Message.includes('duplicate')){
          throw new ForbiddenException(objResp.Data)
        }
      }
      return objResp;
  }

  async signIn(authCredentials: AuthCredentialsDto): Promise<{accessToken: string}> {
    const {username,password}= authCredentials;
    const user =await this.usersRepository.findOne({username});
    if(user && (await bcrypt.compare(password,user.password))){
      const payload: IJwtPayload = {username};
      const accessToken = this.jwtService.sign(payload);
       return {accessToken};
    }else{
      throw new UnauthorizedException('Invalid username/password supplied');
    }
  }
}
