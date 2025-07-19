// src/auth/auth.controller.ts
import { Controller, Post, Body, Request, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  // 1. Применяем гард 'local'. NestJS найдет нашу LocalStrategy.
  // 2. Стратегия выполнит метод validate. Если успешно, пользователь добавится в req.user.
  // 3. Только после этого выполнится тело метода login.
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req) {
    // req.user сюда подставит Passport после успешной валидации в LocalStrategy
    return this.authService.login(req.user);
  }

  // А вот и защищенный маршрут!
  // Этот гард будет использовать нашу JwtStrategy.
  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Request() req) {
    // Благодаря JwtStrategy, в req.user будет полная информация о пользователе
    return req.user;
  }
}