import { Injectable, OnModuleInit } from "@nestjs/common";
import { OpenAIService } from "src/openai/openai.service";
import { PrismaService } from "src/prisma/prisma.service";
import * as Venom from 'venom-bot'




@Injectable()
export class VenomService implements OnModuleInit {
private userName: string | null = null

constructor(private readonly prisma: PrismaService, private readonly openai: OpenAIService){}
async onModuleInit() {
  await Venom.create({headless: false, session: 'OpenAI Bot'}).then(client=>{
       this.start(client)
     }).catch(err=> console.log(err))
 }



 private start(client: Venom.Whatsapp){
  client.onAnyMessage( (message)=>{
     this.venomBot(client, message)
  })
 }

 private async venomBot(client: Venom.Whatsapp, message: Venom.Message){
const user = await this.prisma.user.findFirst({
  where:{
    number: message.author 
  }
})


if(message.body.startsWith('/bot')){
  const messageText = message.body.substring('/bot'.length).trim(); 

if(!user){
this.sendText(client, 'Hello! I am a virtual assistant ready to answer your questions. How can I assist you? Before we proceed, could you please provide me with your name?',message.from)
return await this.prisma.user.create({
  data:{
   number: message.from,
   step: 2
  }

  
 })
 
}

if(user.step === 2 ){
 this.sendText(client, `Is your name ${messageText}? Reply with 'Yes' or 'No'.`, message.from)
 this.updateStepUser(user.id, {step:3})
 this.userName = messageText
 }

 if(user.step === 3 ){
  if(messageText.toLowerCase() === 'yes'){
    this.sendText(client, '📝 Please enter your question:', message.from)
    this.updateStepUser(user.id, {step:4})
    

  }
 else if(messageText.toLowerCase() === 'no'){
    this.userName = null
    this.updateStepUser(user.id, {step:2})
    this.sendText(client, '🤔 Alright, could you please provide me with your name again?', message.from)
 
  }
 }


 if(user.step === 4){
  const openAIResponse = await this.openai.getOpenAIResponse(messageText) 
  this.sendText(client, openAIResponse, message.from)
  this.sendText(client, 'Do you have another question? (Yes/No)', message.from)
  this.updateStepUser(user.id, {step: 5})
 }

 if(user.step === 5){
  if(messageText.toLowerCase() === 'yes'){
    this.sendText(client, '📝 Please enter your question:', message.from)
    this.updateStepUser(user.id, {step:4})
  }else if(messageText.toLowerCase() === 'no'){
    this.sendText(client, `Thank you, ${user.name}, for using our virtual assistant! If you have any more questions in the future, feel free to ask. Have a great day!`, message.from)
 await this.prisma.user.delete({
    where:{
      id: user.id
    }
  })
  }

 }
 
}
 


 }

private sendText (client:Venom.Whatsapp, body: string, to:string){
 return client.sendText(to, body).then(response=>{
    
    return response
  }).catch(err=>{
    console.log(err)
  })
}

private async updateStepUser(id: string,data: {step: number, name?: string}){
  
  if(this.userName){
data.name = this.userName
  }
 return await this.prisma.user.update({
    where:{
      id
    },
    data
  })
}

}

