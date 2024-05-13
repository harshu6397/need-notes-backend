import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UserTokenDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Refresh token is required' })
  refreshToken: string;
}

export class VerificationTokenDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Verification token is required' })
  verificationToken: string;
}

export class ResetTokenDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Reset token is required' })
  resetToken: string;
}
