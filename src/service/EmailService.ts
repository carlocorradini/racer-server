import path from 'path';
import nodemailer from 'nodemailer';
// eslint-disable-next-line no-unused-vars
import Mail from 'nodemailer/lib/mailer';
import hbs from 'nodemailer-express-handlebars';
import config from '@app/config';
import logger from '@app/logger';
import { ConfigurationError } from '@app/common/error';
//

export default class EmailService {
  private static transport: Mail;

  private static configured: boolean = false;

  public static configure(): void {
    if (this.configured) return;

    this.transport = nodemailer.createTransport({
      host: config.SERVICE.EMAIL.HOST,
      port: config.SERVICE.EMAIL.PORT,
      secure: config.SERVICE.EMAIL.SECURE,
      auth: {
        user: config.SERVICE.EMAIL.USERNAME,
        pass: config.SERVICE.EMAIL.PASSWORD,
      },
    });

    this.transport.use(
      'compile',
      hbs({
        viewEngine: {
          extName: '.hbs',
          layoutsDir: path.join(__dirname, '../view/email'),
          partialsDir: path.join(__dirname, '../view/email'),
          defaultLayout: false,
        },
        viewPath: path.join(__dirname, '../view/email'),
        extName: '.hbs',
      })
    );

    this.configured = true;

    logger.info('Email service configured');
  }

  public static send(mailOptions: Mail.Options): Promise<any> {
    if (!this.configured) throw new ConfigurationError('Email Service is not configured');

    return new Promise((resolve, reject) => {
      this.transport.sendMail(mailOptions, (err, info) => {
        if (err) {
          logger.error(`Error sending email due to ${err.message}`);
          reject(err);
        } else {
          logger.info(`Sended email ${JSON.stringify(info)}`);
          resolve(info);
        }
      });
    });
  }
}
