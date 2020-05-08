import { Twilio } from 'twilio';
import {
  // eslint-disable-next-line no-unused-vars
  MessageInstance,
  // eslint-disable-next-line no-unused-vars
  MessageListInstanceCreateOptions,
} from 'twilio/lib/rest/api/v2010/account/message';
import config from '@app/config';
import logger from '@app/logger';
import { ConfigurationError } from '@app/common/error';

export default class PhoneService {
  private static transport: Twilio;

  private static configured: boolean = false;

  public static configure(): void {
    if (this.configured) return;

    this.transport = new Twilio(config.SERVICE.PHONE.SID, config.SERVICE.PHONE.TOKEN);

    this.configured = true;

    logger.info('Phone service configured');
  }

  public static send(phoneOptions: MessageListInstanceCreateOptions): Promise<MessageInstance> {
    if (!this.configured) throw new ConfigurationError('Phone Service is not configured');

    return new Promise((resolve, reject) => {
      this.transport.messages
        .create(phoneOptions)
        .then((message) => {
          logger.info(`Sended phone message ${JSON.stringify(message)}`);
          resolve(message);
        })
        .catch((ex) => {
          logger.error(`Error sending phone message due to ${ex.message}`);
          reject(ex);
        });
    });
  }
}
