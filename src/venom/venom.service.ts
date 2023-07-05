import { Injectable, OnModuleInit } from "@nestjs/common";
import { OpenAIService } from "src/openai/openai.service";
import { PrismaService } from "src/prisma/prisma.service";
import * as Venom from 'venom-bot'




@Injectable()
export class VenomService implements OnModuleInit {
  private client: Venom.Whatsapp


constructor(private readonly prisma: PrismaService, private readonly openai: OpenAIService){}
async onModuleInit() {
   await Venom.create({ session: 'OpenAI_Bot'}).then(client=>{
    this.client = client
    this.start()
  }).catch(err=>{
    console.log(err) 
  })
 }



 private async start(){
 this.client.onAnyMessage( (message)=>{
    
    this.venomBot(this.client, message) 
  })
 }

 private async venomBot(client: Venom.Whatsapp, message: Venom.Message){
const user = await this.prisma.user.findFirst({
  where:{
    number: message.from 
  }
})


if(message.body && message.body.startsWith('/bot')){

  const messageText = message.body.substring('/bot'.length).trim(); 

if(!user){
this.sendText(client, '👋 Hello! I am an AI-powered virtual assistant here to help you with your queries. How may I assist you today? Before we proceed, may I kindly ask for your name?',message.from)
return await this.prisma.user.create({
  data:{
   number: message.from,
   step: 2
  }

  
 })
 
}

if(user.step === 2 ){
 this.sendText(client, `Is your name ${messageText}? Reply with 'Yes' or 'No'. ✍️`, message.from)
 this.updateStepUser(user.id, {step:3, name: messageText})
 
 }

 if(user.step === 3 ){
  if(messageText.toLowerCase() === 'yes'){
    this.sendText(client, '📝 Please enter your question:', message.from)
    this.updateStepUser(user.id, {step:4})
    

  }
 else if(messageText.toLowerCase() === 'no'){
    this.updateStepUser(user.id, {step:2})
    this.sendText(client, '🤔 Alright, could you please provide me with your name again?', message.from)
 
  }
 }


 if(user.step === 4){
  const openAIResponse = await this.openai.getOpenAIResponse(messageText) 
 await this.sendText(client, `Here's the answer to your question: ${openAIResponse} 🤖`, message.from)
  this.sendText(client, 'Do you have another question? (Yes/No) ❓', message.from)
  this.updateStepUser(user.id, {step: 5})
 }

 if(user.step === 5){
  if(messageText.toLowerCase() === 'yes'){
    this.sendText(client, '📝 Please enter your question:', message.from)
    this.updateStepUser(user.id, {step:4})
  }else if(messageText.toLowerCase() === 'no'){
    this.sendText(client, `Thank you, ${user.name}, for using our virtual assistant! If you have any more questions in the future, feel free to ask. Have a great day! 🌟`, message.from)
 await this.prisma.user.delete({
    where:{
      id: user.id
    }
  })
  this.openai.cleanChatHistory()
  }

 }
 
}
 


 }

private async sendText (client:Venom.Whatsapp, body: string, to:string){
 await client.startTyping(to, true)
 return await client.sendText(to, body).then(response=>{
    
    return response
  }).catch(err=>{
    console.log(err)
  })
}

private async updateStepUser(id: string,data: {step: number, name?: string}){
  
 
 return await this.prisma.user.update({
    where:{
      id
    },
    data
  })
}

}

