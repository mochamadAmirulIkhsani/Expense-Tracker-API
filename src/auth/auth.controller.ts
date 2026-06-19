import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';

import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtGuard } from './jwt/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
  console.log('DTO:', dto);
    return this.authService.register(dto.email, dto.password, dto.name);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
  console.log('DTO:', dto);
    return this.authService.login(dto.email, dto.password);
  }

  @UseGuards(JwtGuard)
  @Get('me')
  profile(@Req() req) {
    return req.user;
  }

  
}
