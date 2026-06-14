/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiConsumes, ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body(ValidationPipe) loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  // B. The new endpoint dedicated ONLY to the global Swagger lock icon
  @ApiExcludeEndpoint() // 👈 Hides this helper route from cluttering your Swagger UI list
  @ApiConsumes('application/x-www-form-urlencoded')
  @Post('swagger-login')
  async swaggerLogin(@Body() body: any) {
    // 👈 Using 'any' bypasses the strict ValidationPipe

    // Map Swagger's OAuth2 fields to what your AuthService requires
    const cleanDto: LoginDto = {
      email: body.username, // Swagger sends email here
      password: body.password,
    };

    return this.authService.login(cleanDto);
  }
}
