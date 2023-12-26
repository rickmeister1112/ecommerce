import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { DataSource } from 'typeorm';
import { UserAdmin } from '../Admin/admin.models';
import { UnauthorizedException, UseGuards, ForbiddenException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CurrentUser, GqlAuthGuard } from './auth.guard';
import * as process from 'process';
import { S3Client } from '@aws-sdk/client-s3';
import uuid = require('uuid');
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { User } from 'src/customer/Customer/customer.models';

@Resolver()
export class AuthResolver {
  constructor(private jwtService: JwtService, private dataSource: DataSource) {}

  @Query('s3Signatureadmin')
  @UseGuards(GqlAuthGuard)
  async s3Signature(
    @Args('extension') extension?: string,
    @Args('content_type') content_type?: string,
  ) {
    content_type = content_type ? content_type : 'image/png';

    return await createPresignedPost(
      new S3Client({
        region: 'ap-south-1',
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
      }),
      {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: `${uuid.v4()}.${extension ? extension : 'png'}`,
        Conditions: [
          { acl: 'public-read' },
          { success_action_status: '201' },
          { 'Content-Type': content_type },
        ],
        Fields: {
          acl: 'public-read',
          success_action_status: '201',
          'Content-Type': content_type,
        },
        Expires: 600, //Seconds before the presigned post expires. 3600 by default.
      },
    );
  }

  @Query('loginadmin')
  async loginadmin(
    @Args('username') username: string,
    @Args('password') password: string,
  ) {
    console.log(username,password);
    const userRepository = this.dataSource.getRepository(UserAdmin);

    const user = await userRepository.createQueryBuilder("user")
    .where("user.email = :username OR user.mobile = :password", { username, password })
    .andWhere("user.is_active = :is_active", { is_active: 1 })
    .getOne();


    if (!user) {
      throw new UnauthorizedException('Invalid Username or Password');
    }

    if (user.password_hash.startsWith('$2b$')) {
      if (!(await bcrypt.compare(password, user.password_hash))) {
        throw new UnauthorizedException('Invalid Username or Password');
      }
    } else if (password == user.password_hash) {
      user.password_hash = await bcrypt.hash(user.password_hash, 10);
      await userRepository.save(user);
    } else {
      throw new UnauthorizedException('Invalid Username or Password');
    }

    return {
      access_token: await this.jwtService.signAsync({
        sub: user.id,
        jti: uuid.v4(),
      }),
      user: user,
    };
  }
}

export class AuthFunctions {
  constructor(private jwtService: JwtService, private dataSource: DataSource) {}

  async isValidJWT(context: any): Promise<string> {
    const [type, token] = context.headers?.authorization?.split(' ') ?? [];
    if (type !== 'Bearer' || !token) {
      throw new ForbiddenException(
        'Bearer Token not found in header authorization',
      );
    }
    try {
      // const jwtService = new JwtService();
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      return payload.sub;
    } catch {
      throw new ForbiddenException('Bearer Token error');
    }
  }

  async getCurrentUser(context: any, userType: "admin" | "customer"): Promise<UserAdmin | User> {
    let model = {
      admin: UserAdmin,
      customer: User
    }[userType];
    const user = await this.dataSource
      .getRepository(model)
      .createQueryBuilder('user')
      .where('user.id = :id', { id: await this.isValidJWT(context) })
      .getOne();
    if (!user) {
      throw new ForbiddenException('Invalid JWT User');
    }
    return user;
  }
}