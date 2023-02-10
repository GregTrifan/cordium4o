import { CacheModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  controllers: [AppController],
  providers: [AppService],
  exports: [AppService],
  imports:[CacheModule.register()]
})
export class AppModule {}
