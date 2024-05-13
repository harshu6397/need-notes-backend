import Mailgen = require('mailgen');
import { createTransport } from 'nodemailer';
import {
  EmailOptions,
  EmailVerificationMailgenContent,
  ForgotPasswordMailgenContent,
} from 'src/interfaces';
import { MAILGEN_CONFIG } from '../constants/appConstants.json';

/**
 * @param {{email: string; subject: string; mailgenContent: Mailgen.Content; }} options
 * @returns {Promise<boolean>}
 * @description It sends an email to the provided email address with the subject and mailgen content provided
 */
const sendVerificationEmail = async (
  options: EmailOptions,
): Promise<boolean> => {
  if (process.env.NODE_ENV === 'development') {
    console.log(
      'Sending email in development mode (mock or alternative service)',
    );
    return true;
  }
  const mailGenerator = new Mailgen({
    theme: MAILGEN_CONFIG.THEME,
    product: {
      name: MAILGEN_CONFIG.PRODUCT.NAME,
      link: MAILGEN_CONFIG.PRODUCT.LINK,
    },
  });

  const emailTextual = mailGenerator.generatePlaintext(options.mailgenContent);
  const emailHtml = mailGenerator.generate(options.mailgenContent);
  console.log(
    'process.env.EMAIL_USER',
    process.env.EMAIL_USER,
    process.env.EMAIL_PASSWORD,
  );
  const transporter = createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: options.email,
    subject: options.subject,
    text: emailTextual,
    html: emailHtml,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true; // Email sent successfully
  } catch (error) {
    console.error('Error sending email:', error);
    return false; // Failed to send email
  }
};

/**
 *
 * @param {string} username
 * @param {string} verificationUrl
 * @returns {Mailgen.Content}
 * @description It designs the email verification mail
 */
const emailVerificationMailgenContent = (
  options: EmailVerificationMailgenContent,
): Mailgen.Content => {
  console.log('options', options);
  return {
    body: {
      name: options.username,
      intro: "Welcome to our app! We're very excited to have you on board.",
      action: {
        instructions:
          'To verify your email please click on the following button:',
        button: {
          color: '#22BC66', // Optional action button color
          text: 'Verify your email',
          link: options.verificationUrl,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
};

/**
 *
 * @param {string} username
 * @param {string} resetPasswordUrl
 * @returns {Mailgen.Content}
 * @description It designs the forgot password mail
 */
const forgotPasswordMailgenContent = (
  options: ForgotPasswordMailgenContent,
): Mailgen.Content => {
  console.log('options', options);
  return {
    body: {
      name: options.username,
      intro: 'We got a request to reset the password of our account',
      action: {
        instructions:
          'To reset your password click on the following button or link:',
        button: {
          color: '#22BC66', // Optional action button color
          text: 'Reset password',
          link: options.resetPasswordUrl,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
};

export {
  sendVerificationEmail,
  emailVerificationMailgenContent,
  forgotPasswordMailgenContent,
};
