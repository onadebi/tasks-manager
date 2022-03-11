import { BadRequestException } from '@nestjs/common';
import GenResponseDto, { StatusCode } from 'src/config/GenResponse.dto';
import { EntityRepository, Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-crednetials.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  async createUser(authCredentials: AuthCredentialsDto): Promise<GenResponseDto<string|void>> {
    const { username, password } = authCredentials;
    let objResp: GenResponseDto<string|void>;
    const user = new User();
    try {
        const salt = await bcrypt.genSalt();
        const hashedPwd = await bcrypt.hash(password,salt);
        user.username = username;
        user.password = hashedPwd;

        this.create(user);
        await this.save(user);
        objResp = GenResponseDto.Result<string>(user.username,true, StatusCode.OK, `User [${user.username}] created successfully.`);
    } catch (error) {
      console.log(`[][] >> ${error.detail}`);
      if(error.message.includes('duplicate')){
        objResp = GenResponseDto.Result<string>(error.detail,false, StatusCode.Forbidden,error.message);
      }
    }
    return objResp;
  }
}
