import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';

@Injectable()
export class GoogleMeetingService {
  private oauth2Client;

  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI,
    );
  }

  // 1. Login URL olish
  getAuthUrl() {
    const scopes = ['https://www.googleapis.com/auth/calendar'];
    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: scopes,
    });
  }

  // 2. Callback code ni token ga almashtirish
  async getTokens(code: string) {
    const { tokens } = await this.oauth2Client.getToken(code);
    this.oauth2Client.setCredentials(tokens);
    return tokens; // { access_token, refresh_token }
  }

  // 3. Google Calendar da event yaratish va Meet link olish
  async createMeeting(accessToken: string) {
    this.oauth2Client.setCredentials({ access_token: accessToken });

    const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });

    const event = {
      summary: 'Team Meeting',
      description: 'Google Meet orqali uchrashuv',
      start: {
        dateTime: '2025-09-30T10:00:00+05:00',
        timeZone: 'Asia/Tashkent',
      },
      end: {
        dateTime: '2025-09-30T11:00:00+05:00',
        timeZone: 'Asia/Tashkent',
      },
      conferenceData: {
        createRequest: {
          requestId: 'random-string-id',
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      },
    };

    const res = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
      conferenceDataVersion: 1,
    });

    return {
      meetingUrl: res.data.conferenceData?.entryPoints?.[0]?.uri,
      eventLink: res.data.htmlLink,
    };
  }
}
