import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import path from 'path';

import { AllExceptionsFilter } from '@/common/filters/exception.filter';
import { ResponseInterceptor } from '@/common/interceptors/response.interceptor';
import { AuthModule } from '@/modules/auth';
import { CategoriesModule } from '@/modules/categories';
import { EventModule } from '@/modules/events';
import { LocationModule } from '@/modules/location/location.module';
import { NotifyModule } from '@/modules/notify/notify.module';
import { TicketsModule } from '@/modules/tickets/tickets.module';
import { UsersModule } from '@/modules/users';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
    imports: [
        MailerModule.forRoot({
            transport: {
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                pool: true,
                auth: {
                    user: process.env.MAIL_USER,
                    pass: process.env.MAIL_PASS,
                },
            },
            template: {
                dir: path.resolve(__dirname + '../../templates'),
                adapter: new HandlebarsAdapter(),
                options: {
                    strict: true,
                },
            },
        }),

        UsersModule,
        AuthModule,
        EventModule,
        LocationModule,
        CategoriesModule,
        NotifyModule,
        TicketsModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_INTERCEPTOR,
            useClass: ResponseInterceptor,
        },
        {
            provide: APP_FILTER,
            useClass: AllExceptionsFilter,
        },
    ],
})
export class AppModule {}
