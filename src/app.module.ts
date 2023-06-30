import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VenomInstance } from './venom.instance';
import {ConfigModule} from '@nestjs/config'



@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService, VenomInstance],
})
export class AppModule {}
