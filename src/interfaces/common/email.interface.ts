import Mailgen from 'mailgen';

export interface EmailOptions {
  email: string;
  subject: string;
  mailgenContent: Mailgen.Content;
}

export interface EmailVerificationMailgenContent {
  username: string;
  verificationUrl: string;
}

export interface ForgotPasswordMailgenContent {
  username: string;
  resetPasswordUrl: string;
}
