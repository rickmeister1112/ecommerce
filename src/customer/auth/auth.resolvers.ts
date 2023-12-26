import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { DataSource, Equal, Not, Repository } from 'typeorm';
import { User, UserOtp } from '../Customer/customer.models';
import { Injectable, UnauthorizedException, UseGuards, BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CurrentUser, GqlAuthGuard } from './auth.guard';
import * as process from 'process';
import { S3Client } from '@aws-sdk/client-s3';
import uuid = require('uuid');
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import axios from 'axios';
import { InjectRepository } from '@nestjs/typeorm';

interface SendSMSParams {
  number: string;
  DLT_TE_ID: string;
  authkey: string;
  otp: number;
}

@Resolver()
export class AuthResolver {
  constructor(
    private jwtService: JwtService,
    private dataSource: DataSource,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

  @Query('s3Signature')
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

  @Query('login')
  async login(
    @Args('username') username: string,
    @Args('password') password: string,
  ) {
    const userRepository = this.dataSource.getRepository(User);

    const user = await userRepository.createQueryBuilder("user")
      .where("user.mobile = :username", { username, password })
      // .andWhere("user.is_active = :is_active", { is_active: 1 })
      .getOne();

    console.log(user);
    if (!user) {
      throw new UnauthorizedException('Invalid Username or Password');
    }

    if (!(await bcrypt.compare(password, user.password_hash))) {
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

  @Query('otplogin')
  async otpLogin(@Args('mobile') mobileNumber: string) {
    const mobile = mobileNumber;
    const userOtpRepository = this.dataSource.getRepository(UserOtp);
    const randomFourDigitNumber = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000);
    let userOtp = await userOtpRepository.findOne({
      where: { mobile: Equal(mobile), is_Active: false },
    });
    if (userOtp) {
      // Update the OTP if the mobile number already exists
      userOtp.otp = randomFourDigitNumber;
      userOtp.is_Active = false;

    } else {
      userOtp = userOtpRepository.create({
        mobile,
        otp: randomFourDigitNumber,
        is_Active: false
      });
    }
    const savedUser = await userOtpRepository.save(userOtp);


    const smsParams: SendSMSParams = {
      number: `${mobile}`,
      DLT_TE_ID: '1307163392378570875',
      authkey: '160265AXGGxn47pY1C594a554d',
      otp: randomFourDigitNumber
    };
    console.log(smsParams);
    const response = await this.sendSMS(smsParams);

    // Do something with the response or return it
    return response;
  }

  sendSMS = async ({ otp, number, DLT_TE_ID, authkey }: SendSMSParams) => {
    const url = 'https://api.msg91.com/api/v2/sendsms';
    const headers = {
      'Content-Type': 'application/json',
      'authkey': authkey,
      'Cookie': 'PHPSESSID=4kgudnphlcd4jghqnjavcjo1f2'
    };
    const body = {
      sender: "UNMUDL",
      route: 4,
      DLT_TE_ID: DLT_TE_ID,
      sms: [
        {
          message: `YourOTP  is ${otp} is your account verification code to login into YourDomain\nUNMUDL`,
          to: [number]
        }
      ]
    };

    try {
      const response = await axios.post(url, body, { headers: headers });
      return response.data;
    } catch (error) {
      throw new Error(`Error sending SMS: ${error}`);
    }
  }

  @Query('verifyOtp')
  async verifyOtp(@Args('mobile') mobileNumber: string, @Args('otp') otpInput: number) {

    const userOtpRepository = this.dataSource.getRepository(UserOtp);

    // Find a record with the given mobile number and is_active = 0
    const userOtp = await userOtpRepository.findOne({
      where: {
        is_Active: false,
        mobile: Equal(mobileNumber)
      }
    });

    // If no such record is found
    if (!userOtp) {
      throw new Error('No pending OTP found for the given mobile number.');
    }

    // Verify the OTP
    if (userOtp.otp !== otpInput) {
      throw new Error('Invalid OTP provided.');
    } else {
      userOtp.is_Active = true;
      await userOtpRepository.save(userOtp);
      let modifiedNumber;
      if (mobileNumber.startsWith('91')) {
        modifiedNumber = mobileNumber.slice(2);
      } else {
        modifiedNumber = mobileNumber;
      }

      const userRepository = this.dataSource.getRepository(User);
      const userData = await userRepository.findOne({
        where: {
          mobile: modifiedNumber
        }
      });

      if (!userData) {
        return {
          msg: "Mobile number verified",
        };
      } else {
        return {
          access_token: await this.jwtService.signAsync({
            sub: userData.id,
            jti: uuid.v4(),
          }),
          user: userData
        };
      }
    }
  }

  @Query('checkNumberValidity')
  async checkNumber(@Args('mobile') mobile: string) {
    const userRepository = this.dataSource.getRepository(User);
    const findNumber = await userRepository.findOne({
      where: {
        mobile: mobile // Not putting is_active check deliberately
      }
    });
    if (!findNumber) {
      throw new Error('No User Exists');
    }
    else {
      return findNumber
    }
  }

  @Mutation('signup')
  async signup(@Args('row') userInput: User) {
    const { email, first_name, last_name, mobile, password_hash } = userInput;

    console.log(userInput);

    if (!password_hash || password_hash.length < 8) {
      throw new BadRequestException('Password is required and should be at least 8 characters');
    }

    const hashedPassword = await bcrypt.hash(password_hash, 10);

    const existingUser = await this.userRepository.findOne({
      where: [{ email }, { mobile }],
    });

    if (existingUser) {
      throw new BadRequestException('A user with this email or mobile already exists');
    }

    const newUser = this.userRepository.create({
      email,
      first_name,
      last_name,
      mobile,
      password_hash: hashedPassword,
    });

    const savedUser = await this.userRepository.save(newUser);

    const { password_hash: _, ...userWithoutPassword } = savedUser;
    return {
      access_token: await this.jwtService.signAsync({
        sub: userWithoutPassword.id,
        jti: uuid.v4(),
      }),
      user: userWithoutPassword
    };
  }

}
