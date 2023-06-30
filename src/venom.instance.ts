
import { Injectable } from '@nestjs/common';
import * as venom from 'venom-bot';
import { OpenAIApi, Configuration } from 'openai';

 



@Injectable()
export class VenomInstance {
  async createVenomInstance() {
  
  
    venom
      .create({
        headless: false,
        session: 'test', //name of session
      })
      .then((client) => this.start(client))
      .catch((erro) => {
        console.log(erro);
      });
  }
  private async start(client: venom.Whatsapp) {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    
    const openai =  new OpenAIApi(configuration);
    
    
    client.onAnyMessage(message => {
      console.log(message.body)
     
      if(message.body === 'test' && message.isGroupMsg === false){
        client
     .sendText(
       message.from,
       'my name is Ryan',
     )
     .then((result) => {
       console.log('Result: ', result); //return object success
     })
     .catch((erro) => {
       console.error('Error when sending: ', erro); //return object error
      });
    }
    });
 


      await client
        .sendText(
          '5521999408467@c.us',
          'Olá! Bem-vindo(a) ao VenomAssistant, nosso serviço de atendimento automatizado. Envie suas perguntas e teremos o prazer de responder com a ajuda da OpenAI. Estamos aqui para ajudar!',
        )
        .then(async(result) => {
       
    


    //  await client.sendText('5521999408467@c.us', chatCompletion.data.choices[0].message.content)
    // const Messages = await client.getAllMessagesInChat('5521999408467@c.us', true, true);
    // console.log(Messages)      
    // console.log('Result: ', result); //return object success
        })
        .catch((erro) => {
          console.error('Error when sending: ', erro); //return object error
        });

      //   client.onMessage( async message=>{
      //            const chatCompletion = await openai.createChatCompletion({
      //       model: 'gpt-3.5-turbo',
      //       messages: [{ role: 'user', content: message.body }],
            
      // });

      //     client
      //   .sendText(
      //     message.from,
      //     chatCompletion.data.choices[0].message.content,
      //   )
      //   .then((result) => {
      //     console.log('Result: ', result); //return object success
      //   })
      //   .catch((erro) => {
      //     console.error('Error when sending: ', erro); //return object error
      //   });
      //   })

        // client.onMessage(message=>{
        //   if(message.body === 'yes' ){
        //     client
        //     .sendText(
        //       '5521999408467@c.us',
        //       'Hi! Could you ask a question to ChatGPT ?',
        //     )
        //     .then((result) => {
        //       console.log('Result: ', result); //return object success
        //     })
        //     .catch((erro) => {
        //       console.error('Error when sending: ', erro); //return object error
        //     });
        //   }
        // })

      //   const list = [
      //     {
      //       title: "OpenAI",
      //       rows: [
      //         {
      //           title: "Ravioli Lasagna",
      //           description: "Made with layers of frozen cheese",
      //         }
      //       ]
      //     },
      //     {
      //       title: "Dessert",
      //       rows: [
      //         {
      //           title: "Baked Ricotta Cake",
      //           description: "Sweets pecan baklava rolls",
      //         },
      //         {
      //           title: "Lemon Meringue Pie",
      //           description: "Pastry filled with lemonand meringue.",
      //         }
      //       ]
      //     }
      //   ];
      
      // await client.sendListMenu('5521999408467@c.us', 'Title', 'subTitle', 'Description', 'menu', list)
      //   .then((result) => {
      //     console.log('Result: ', result); //return object success
      //   })
      //   .catch((erro) => {
      //     console.error('Error when sending: ', erro); //return object error
      //   });
      
        
    
  //     const buttons = [
  //       {
  //         "buttonText": {
  //           "displayText": "Text of Button 1"
  //           }
  //         },
  //       {
  //         "buttonText": {
  //           "displayText": "Text of Button 2"
  //           }
  //         }
  //       ]
  //     await client.sendButtons('5521999408467@c.us', 'Title', 'subtitle',  buttons)
  // .then((result) => {
  //   console.log('Result: ', result); //return object success
  // })
  // .catch((erro) => {
  //   console.error('Error when sending: ', erro); //return object error
  // });
  }
}
