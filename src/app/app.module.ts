import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '@/modules/users';
import { AuthModule } from '@/modules/auth';
import { EventModule } from '@/modules/events';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from '@/common/interceptors/response.interceptor';

@Module({
  imports: [UsersModule, AuthModule, EventModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide : APP_INTERCEPTOR,
      useClass : ResponseInterceptor
    }
  ],
})

export class AppModule {}
