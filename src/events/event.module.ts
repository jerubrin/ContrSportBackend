import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { Event } from './entities/event.entity';
import { ExpenditureItem } from './entities/expenditure-item.entity';
import { Teammate } from './entities/teammate.entity';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { User } from './user.entity';
import { MailService } from './mail.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Event]),
    TypeOrmModule.forFeature([ExpenditureItem]),
    TypeOrmModule.forFeature([Teammate]),
    JwtModule.register({
      secret: process.env.JWT_PRIVATE_KEY || 'SECRET',
      signOptions: {
        expiresIn: '24h',
      },
    }),
  ],
  controllers: [EventController],
  providers: [EventService, MailService, JwtAuthGuard],
  exports: [TypeOrmModule, JwtModule],
})
export class EventModule {}
