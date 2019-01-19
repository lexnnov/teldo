import config from 'config';
import './production';
import TelegramBot from 'node-telegram-bot-api';
import Agent from 'socks5-https-client/lib/Agent';

const BotConfig = config.get('TelegramBot');

export default new TelegramBot(BotConfig.API, {
  polling: true,
  request: {
    agentClass: Agent,
    agentOptions: {
      socksHost: BotConfig.SocksHost,
      socksPort: BotConfig.SocksPort,
      // If authorization is needed:
      // socksUsername: process.env.PROXY_SOCKS5_USERNAME,
      // socksPassword: process.env.PROXY_SOCKS5_PASSWORD
    },
  },
});
