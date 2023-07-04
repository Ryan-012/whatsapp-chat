import { Injectable } from "@nestjs/common";
import { ChatCompletionRequestMessageRoleEnum, Configuration, OpenAIApi } from "openai";

@Injectable()
export class OpenAIService {
  private openai: OpenAIApi
  private chatHistory: { role: ChatCompletionRequestMessageRoleEnum; content: string }[] = [];


  constructor() {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    
    this.openai = new OpenAIApi(configuration)
  }

 async getOpenAIResponse(question: string): Promise<string>{

  const response = await  this.openai.createChatCompletion({

         model: 'gpt-3.5-turbo',
         messages: [{role: 'user', content: question},...this.chatHistory],
  })
  

   const answer = response.data.choices[0].message.content;
   
  this.chatHistory.push({ role: 'assistant', content: answer });

  return answer;

  }

 }
