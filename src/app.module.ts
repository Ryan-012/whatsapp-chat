import { Module } from '@nestjs/common';
import { VenomInstance } from './venom/venom.instance';
import {ConfigModule} from '@nestjs/config'
import { PrismaService } from './prisma/prisma.service';


@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [],
  providers: [ VenomInstance, PrismaService],
})
export class AppModule {}
