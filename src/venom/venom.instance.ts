import { Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import * as Venom from 'venom-bot'




@Injectable()
export class VenomInstance implements OnModuleInit {
constructor(private readonly prisma: PrismaService){}
async onModuleInit() {
  await Venom.create({headless: true, session: 'OpenAI Bot'}).then(client=>{
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

if(!user && message.body.startsWith('/bot')){
 this.sendText(client, 'Hello! I am a virtual assistant ready to answer your questions. How can I assist you? Before we proceed, could you please provide me with your name?',message.from, 2)
  
}
  

 }
  private sendText (client:Venom.Whatsapp, body: string, to:string, step:number){
    client.sendText(to, body).then(res=>{
      console.log(res)
    }).catch(err=>{
      console.log(err)
    })
  }
}