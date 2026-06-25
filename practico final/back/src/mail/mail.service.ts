import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {

    constructor(
        private readonly configService: ConfigService
    ) {}

    async sendVerificationEmail(
        email: string,
        token: string
    ) {

        const transporter = nodemailer.createTransport({

            host: this.configService.get('SMTP_HOST'),
            port: Number(this.configService.get('SMTP_PORT')),
            secure: false,

            auth: {
                user: this.configService.get('SMTP_USER'),
                pass: this.configService.get('SMTP_PASS')
            }

        });


        const frontend =
            this.configService.get('FRONTEND_URL');

        const url =
            `${frontend}/verify-email?token=${token}`;


        await transporter.sendMail({

            from:
                this.configService.get('SMTP_USER'),

            to: email,

            subject:
                'Verificación de cuenta',

            html: `
                <h2>Bienvenido</h2>

                <p>Haz click en el enlace para verificar tu cuenta</p>

                <a href="${url}">
                    Verificar cuenta
                </a>
            `

        });

    }

}