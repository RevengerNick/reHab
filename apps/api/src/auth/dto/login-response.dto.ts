import { ObjectType, Field } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';

/**
 * Response object for login mutation
 */
@ObjectType('AuthPayload')
export class LoginResponseDto {
  @Field(() => String, { 
    description: 'JWT access token for authenticated requests' 
  })
  accessToken: string;

  @Field(() => User, { 
    description: 'Authenticated user details' 
  })
  user: User;
}