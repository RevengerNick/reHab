import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsString, MinLength, Matches } from 'class-validator';

@InputType()
export class RegisterDto {
  @Field(() => String)
  @IsEmail({}, { message: 'Неверный формат email' })
  email: string;

  @Field(() => String)
  @IsString({ message: 'Имя должно быть строкой' })
  name: string;

  @Field(() => String)
  @IsString({ message: 'Пароль должен быть строкой' })
  @MinLength(6, { message: 'Пароль должен содержать не менее 6 символов' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/, {
    message:
      'Пароль должен содержать хотя бы одну заглавную букву, одну строчную букву и одну цифру',
  })
  password: string;
}
