import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    this.logger.warn('User login attempt');
    const user = await this.usersService.findByEmail(loginDto.email);

    if (!user) {
      throw new NotFoundException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new NotFoundException('Invalid email or password');
    }

    const tokenPayload = { sub: user.id, email: user.email };
    const token = await this.jwtService.signAsync(tokenPayload);

    this.logger.log('User login successful');

    return {
      access_token: token,
      token_type: 'bearer',
      message: `Logged in with ${user.email}`,
    };
  }
}
