import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ChallengesModule } from './challenges/challenges.module';
import { DirectionModule } from './direction/direction.module';
import { FriendMessageModule } from './friend-message/friend-message.module';
import { FriendsModule } from './friends/friends.module';
import { GroupMembersModule } from './group-members/group-members.module';
import { GroupsModule } from './groups/groups.module';
import { MailModule } from './mail/mail.module';
import { PrismaModule } from './prisma/prisma.module';
import { GroupMessageModule } from './group-message/group-message.module';

@Module({
  imports: [
    AuthModule,
    ChallengesModule,
    DirectionModule,
    FriendMessageModule,
    FriendsModule,
    GroupMembersModule,
    GroupsModule,
    MailModule,
    PrismaModule,
    GroupMessageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}