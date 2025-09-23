import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from "nodemailer";

@Injectable()
export class MailService {
    private transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'islomaka2323@gmail.com',
            pass: 'tkvs txhh khcs fujx'
        }
    });

    async sendSmsToMail( email: string, subject: string, text: string, html?: string ) {
        try {
            await this.transport.sendMail({
                to: email,
                subject,
                text,
                html
            }) 
            return { message: `successfully, sent sms to ${email}`}
        } catch (error) {
            throw new InternalServerErrorException(error.message || 'MailService internal server error')
        }
    }
}