import {
  Controller,
  Post,
  Get,
  Body,
  HttpStatus,
  HttpCode,
  Request,
  Res,
  Param,
  Response,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ResponseHandlers } from '../../handlers/responseHandler.service';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from 'src/handlers/loggerHandler.service';
import {
  ApiTags,
  ApiResponse,
  ApiOperation,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  RegisterUserDto,
  LoginUserDto,
  UserTokenDto,
  VerificationTokenDto,
  ForgotPasswordDto,
  ResetTokenDto,
  ResetPasswordDto,
} from '../../dto';

@ApiTags('User')
@Controller({
  version: '1',
  path: 'users',
})
export class V1UserController {
  constructor(
    private readonly userService: UserService,
    private readonly responses: ResponseHandlers,
    private configService: ConfigService,
    private logger: LoggerService,
  ) {}

  // Unsecured route
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiBadRequestResponse({ description: 'Email or username already exists' })
  @ApiUnauthorizedResponse({ description: 'Failed to send verification email' })
  async registerUser(
    @Body() body: RegisterUserDto,
    @Request() req: any,
  ): Promise<any> {
    try {
      const user = await this.userService.registerUser(req, body);
      return this.responses.success(user);
    } catch (error) {
      console.log(error);
      return this.responses.error(error.message);
    }
  }

  @Post('login')
  @ApiResponse({ status: 200, description: 'User logged in successfully' })
  @ApiBadRequestResponse({ description: 'Username or email is required' })
  @ApiNotFoundResponse({ description: 'User does not exist' })
  @ApiUnauthorizedResponse({
    description: 'Invalid user credentials or incorrect login type',
  })
  @HttpCode(HttpStatus.OK)
  async loginUser(
    @Body() body: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    try {
      const user = await this.userService.loginUser(body, res);
      return this.responses.success(user);
    } catch (error) {
      return this.responses.error(error.message);
    }
  }

  @Get('verifyVerificationEmail/:verificationToken')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'Email verified successfully' })
  @ApiBadRequestResponse({ description: 'Invalid verification token' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiUnauthorizedResponse({ description: 'Failed to verify email' })
  async verifyEmail(
    @Param() { verificationToken }: VerificationTokenDto,
  ): Promise<any> {
    try {
      const response = await this.userService.verifyEmail(verificationToken);
      return this.responses.success(response, 'Email verified successfully');
    } catch (error) {
      return this.responses.error(error.message);
    }
  }

  @Post('refreshAccessToken')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: 'Access token refreshed successfully',
  })
  @ApiBadRequestResponse({ description: 'Invalid refresh token' })
  @ApiUnauthorizedResponse({ description: 'Failed to refresh access token' })
  async refreshAccessToken(@Body() body: UserTokenDto): Promise<any> {
    try {
      const response = await this.userService.refreshAccessToken(
        body.refreshToken,
      );
      return this.responses.success(
        response,
        'Access token refreshed successfully',
      );
    } catch (error) {
      return this.responses.error(error.message);
    }
  }

  @Post('forgotPassword')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'Password reset email sent' })
  @ApiBadRequestResponse({ description: 'Invalid email' })
  @ApiUnauthorizedResponse({
    description: 'Failed to send password reset email',
  })
  async forgotPassword(@Body() body: ForgotPasswordDto): Promise<any> {
    try {
      const response = await this.userService.forgotPassword(body.email);
      return this.responses.success(response, 'Password reset email sent');
    } catch (error) {
      return this.responses.error(error.message);
    }
  }

  @Post('resetPassword/:resetToken')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'Password reset successfully' })
  @ApiBadRequestResponse({ description: 'Invalid reset token' })
  @ApiUnauthorizedResponse({ description: 'Failed to reset password' })
  async resetPassword(
    @Param() { resetToken }: ResetTokenDto,
    @Body() body: ResetPasswordDto,
  ): Promise<any> {
    try {
      const response = await this.userService.resetPassword(
        resetToken,
        body.newPassword,
      );
      return this.responses.success(response, 'Password reset successfully');
    } catch (error) {
      return this.responses.error(error.message);
    }
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'User logged out successfully' })
  @ApiUnauthorizedResponse({ description: 'Failed to logout user' })
  async logoutUser(@Request() req: any, @Response() res: any): Promise<any> {
    try {
      const response = await this.userService.logoutUser(req.user._id, res);
      return this.responses.success(response);
    } catch (error) {
      return this.responses.error(error.message);
    }
  }
}
