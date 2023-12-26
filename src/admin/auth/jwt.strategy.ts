import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { UserAdmin } from '../Admin/admin.models';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private dataSource: DataSource, 
    private configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    const user = await this.dataSource
      .getRepository(UserAdmin)
      .createQueryBuilder('user')
      .where('user.id = :id', { id: payload['sub'] })
      .getOne();
    if (!user) {
      throw new ForbiddenException('Invalid JWT User');
    }
    return user;
  }
}
