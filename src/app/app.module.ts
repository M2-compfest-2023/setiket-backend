import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '@/modules/users';
import { AuthModule } from '@/modules/auth';
import { EventModule } from '@/modules/events';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from '@/common/interceptors/response.interceptor';
import { AllExceptionsFilter } from '@/common/filters/exception.filter';
import { LocationModule } from '@/modules/location/location.module';

@Module({
  imports: [UsersModule, AuthModule, EventModule, LocationModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide : APP_INTERCEPTOR,
      useClass : ResponseInterceptor
    },
    {
      provide : APP_FILTER,
      useClass : AllExceptionsFilter
    }
  ],
})

export class AppModule {}
