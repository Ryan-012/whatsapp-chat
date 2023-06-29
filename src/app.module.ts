import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VenomInstance } from './venom.instance';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, VenomInstance],
})
export class AppModule {}
