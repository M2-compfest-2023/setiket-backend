import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '@/modules/users';
import { AuthModule } from '@/modules/auth';
import { EventModule } from '@/modules/events';
@Module({
  imports: [UsersModule, AuthModule, EventModule],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
