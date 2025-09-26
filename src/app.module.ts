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
import { PlansModule } from './plans/plans.module';
import { LessonModule } from './lesson/lesson.module';
import { GoogleMeetingModule } from './google-meeting/google-meeting.module';
import { LessonEnrollmentsModule } from './lesson-enrollments/lesson-enrollments.module';
import { LessonRatingsModule } from './lesson-ratings/lesson-ratings.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

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
    PlansModule,
    LessonModule,
    GoogleMeetingModule,
    LessonEnrollmentsModule,
    LessonRatingsModule,
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000, // 1minute 20 requests
          limit: 20
        }
      ]
    })
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: 'APP_GUARD',
      useClass: ThrottlerGuard // global rate limiter
    }
  ],
})
export class AppModule {}