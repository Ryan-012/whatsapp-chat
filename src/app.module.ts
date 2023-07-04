import { Module } from '@nestjs/common';
import { VenomService } from './venom/venom.service';
import {ConfigModule} from '@nestjs/config'
import { PrismaService } from './prisma/prisma.service';
import { OpenAIService } from './openai/openai.service';



@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [],
  providers: [ VenomService, PrismaService, OpenAIService],
})
export class AppModule {}
