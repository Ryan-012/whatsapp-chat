import { Injectable } from '@nestjs/common';
import { start } from 'repl';
import * as venom from 'venom-bot';

import { OpenAIApi, Configuration } from 'openai';
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

@Injectable()
export class VenomInstance {
  async createVenomInstance() {
    venom
      .create({
        session: 'test', //name of session
      })
      .then((client) => this.start(client))
      .catch((erro) => {
        console.log(erro);
      });
  }
  private async start(client: venom.Whatsapp) {
    await client.onMessage(async (message) => {
      const chatCompletion = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: message.body }],
      });

      await client
        .sendText(
          message.from,
          chatCompletion.data.choices[0].message?.content || '',
        )
        .then((result) => {
          console.log('Result: ', result); //return object success
        })
        .catch((erro) => {
          console.error('Error when sending: ', erro); //return object error
        });
    });
  }
}
