import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { GqlLocalAuthGuard } from './gql-local.guard';
import { User } from 'src/users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => LoginResponseDto)
  @UseGuards(GqlLocalAuthGuard)
  async login(
    @Args('loginDto') loginDto: LoginDto,
    @Context() context: any,
  ): Promise<LoginResponseDto> {
    console.log(loginDto);
    const user = context.req.user as User;
    const token = await this.authService.login(user); // authService уже есть метод login
    return { accessToken: token.access_token, user };
  }

  @Mutation(() => User) // При успехе возвращаем созданного пользователя
  async register(@Args('registerDto') registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }
}