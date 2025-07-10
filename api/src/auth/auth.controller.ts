// src/auth/auth.controller.ts
import { Controller, Post, Body, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';

// Пока что используем any, потом заменим на DTO
class CreateUserDto {
    email: string;
    password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }
  
  // Этот эндпоинт мы пока не можем использовать, т.к. не создали Guard
  // @UseGuards(LocalAuthGuard) // Добавим позже
  @Post('login')
  async login(@Body() body: CreateUserDto) { // Временно для проверки
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    return this.authService.login(user);
  }
}