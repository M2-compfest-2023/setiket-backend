import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '@/modules/users';
import { AuthModule } from '@/modules/auth';

@Module({
  imports: [UsersModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
