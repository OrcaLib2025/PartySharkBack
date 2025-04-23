import nodemailer from 'nodemailer';
import config from '../config';
import dotenv from 'dotenv';
dotenv.config();

class MailService {
    private transporter: nodemailer.Transporter;
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: 'smtp.yandex.ru', // Хост SMTP-сервера
            port: 465, // Порт SMTP-сервера
            secure: true, // Используйте true для порта 465, false для других портов
            auth: {
                user: process.env.SMTP_USER, // Пользователь SMTP
                pass: process.env.SMTP_PASSWORD, // Пароль SMTP (используйте 'pass' вместо 'password')
            },
        } as nodemailer.TransportOptions); // Явное указание типа
    }
    async sendActivationLink(to: string, link: string, retries = 3) {
        for (let i = 0; i < retries; i++) {
            try {
                await this.transporter.sendMail({
                    from: `"Party shark" <${process.env.SMTP_USER}>`,
                    to,
                    subject: 'Активация аккаунта',
                    html: `
                    <div>
                        <h1>Для активации перейдите по ссылке</h1>
                        <a href="${link}">${link}</a>
                    </div>
                `
                });
                return;
            } catch (err) {
                if (i === retries - 1) throw err;
                await new Promise(resolve => setTimeout(resolve, 5000));
            }
        }
    }

}

export default MailService;
