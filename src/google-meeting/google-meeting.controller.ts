import { Controller, Get, Query } from '@nestjs/common';
import { GoogleMeetingService } from './google-meeting.service';


@Controller('google-meeting')
export class GoogleMeetingController {
  constructor(private readonly googleMeetingService: GoogleMeetingService) {}

  @Get('google')
  getGoogleAuthUrl() {
    return { url: this.googleMeetingService.getAuthUrl() };
  }

  @Get('google/callback')
  async googleCallback(@Query('code') code: string) {
    const tokens = await this.googleMeetingService.getTokens(code);

    // access token orqali meeting yaratish
    const meeting = await this.googleMeetingService.createMeeting(tokens.access_token);

    return { meeting, tokens };
  }
}
