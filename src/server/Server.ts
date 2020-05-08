import path from 'path';
// eslint-disable-next-line no-unused-vars
import { AddressInfo } from 'net';
import express from 'express';
import compression from 'compression';
import helmet from 'helmet';
import favicon from 'serve-favicon';
import bodyParser from 'body-parser';
import cors from 'cors';
import exphbs from 'express-handlebars';
import hbshelpers from 'handlebars-helpers';
import logger from '@app/logger';
import routes from '@app/route';
import { NotFoundMiddleware, ErrorMiddleware } from '@app/middleware';
import { EmailService, PhoneService, ImageService } from '@app/service';

export default class Server {
  public static readonly DEFAULT_PORT = 0;

  private static instance: Server;

  private readonly server: express.Application;

  private addressInfo!: AddressInfo;

  private constructor() {
    this.server = express();
    logger.debug('Server initialized');
    this.configure();
    logger.info('Server configured');
  }

  private configure(): void {
    this.server
      .options('*', cors())
      .use(cors())
      .enable('trust proxy')
      .engine(
        '.hbs',
        exphbs.create({
          extname: '.hbs',
          layoutsDir: path.join(__dirname, '../view/site/layout'),
          partialsDir: path.join(__dirname, '../view/site/partial'),
          helpers: hbshelpers(),
        }).engine
      )
      .set('view engine', '.hbs')
      .set('views', path.join(__dirname, '../view/site'))
      .use(compression())
      .use(helmet())
      .use(bodyParser.json())
      .use(bodyParser.urlencoded({ extended: true }))
      .use(favicon(path.join(__dirname, '../public', 'favicon.ico')))
      .use('/', express.static(path.join(__dirname, '../public')))
      .use('/', routes)
      .use(NotFoundMiddleware.handle)
      .use(ErrorMiddleware.handle);

    EmailService.configure();
    PhoneService.configure();
    ImageService.configure();
  }

  public static getInstance(): Server {
    if (!Server.instance) {
      Server.instance = new Server();
      logger.debug('Server instantiated');
    }
    return Server.instance;
  }

  public listen(port: number = Server.DEFAULT_PORT): Promise<AddressInfo> {
    return new Promise((resolve, reject) => {
      const serverListener = this.server
        .listen(port, () => {
          this.addressInfo = serverListener.address() as AddressInfo;
          resolve(this.addressInfo);
        })
        .on('error', (ex) => {
          reject(ex);
        });
    });
  }

  public getAddressInfo(): AddressInfo {
    return this.addressInfo;
  }
}
