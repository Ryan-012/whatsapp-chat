import { Injectable, OnModuleInit } from '@nestjs/common';
import { VenomInstance } from './venom.instance';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private readonly venomInstance: VenomInstance) {}

  async onModuleInit() {
    await this.venomInstance.createVenomInstance();
  }
}
