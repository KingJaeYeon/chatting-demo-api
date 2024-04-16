import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { EventModule } from './event/event.module';
import { AppGateway } from './app.gateway';
import {JwtService} from "./auth/jwt.service";

@Module({
  imports: [AuthModule, UserModule, PrismaModule, EventModule],
  controllers: [AppController],
  providers: [
    AppService,
    AppGateway,
    JwtService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
