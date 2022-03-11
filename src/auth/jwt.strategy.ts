import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { appsettings } from "src/config/appsettings.config";
import { IJwtPayload } from "./jwt-payload.interface";
import { User } from "./user.entity";
import { UsersRepository } from "./users.repository";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(
        @InjectRepository(UsersRepository)
        private readonly userReposiory: UsersRepository,
    ){
        super({
            secretOrKey: appsettings.AuthKey,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        });
    }

    async validate(payload: IJwtPayload): Promise<User>{
        const {username} = payload;
        const user: User =await this.userReposiory.findOne({username});
        if(!user){
            throw new UnauthorizedException('Unauthorized');
        }
        return user;
    }

}