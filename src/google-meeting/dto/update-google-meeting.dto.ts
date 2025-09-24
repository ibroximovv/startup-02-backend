import { PartialType } from '@nestjs/swagger';
import { CreateGoogleMeetingDto } from './create-google-meeting.dto';

export class UpdateGoogleMeetingDto extends PartialType(CreateGoogleMeetingDto) {}
