import { Module } from '@nestjs/common';
import { GoogleMeetingService } from './google-meeting.service';
import { GoogleMeetingController } from './google-meeting.controller';

@Module({
  controllers: [GoogleMeetingController],
  providers: [GoogleMeetingService],
})
export class GoogleMeetingModule {}
