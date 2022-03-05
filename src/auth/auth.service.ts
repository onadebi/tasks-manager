import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import GenResponse from 'src/config/GenResponse';
import { AuthCredentialsDto } from './dto/auth-crednetials.dto';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersRepository)
    private readonly usersRepository: UsersRepository,
  ) {}

  async signUp(authCredentials: AuthCredentialsDto): Promise<GenResponse<string|void>> {
      const objResp =await this.usersRepository.createUser(authCredentials);
      if(!objResp.IsSuccess){
        if(objResp.Message.includes('duplicate')){
          throw new ForbiddenException(objResp.Data)
        }
      }
      return objResp;
  }

  async signIn(authCredentials: AuthCredentialsDto): Promise<string> {
    const {username,password}= authCredentials;
    const user =await this.usersRepository.findOne({username});
    if(user && (await bcrypt.compare(password,user.password))){
       return 'SUCCESS';
    }else{
      throw new UnauthorizedException('Invalid username/password supplied');
    }
  }
}
