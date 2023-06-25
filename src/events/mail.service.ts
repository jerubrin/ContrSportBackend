import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Event } from './entities/event.entity';

@Injectable()
export class MailService {
  transporter = nodemailer.createTransport({
    host: 'smtp.gmail.email',
    // port: process.env.SMTP_PORT,
    secure: false,
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    // tls: {
    //   rejectUnauthorized: false,
    // },
  });

  constructor() {
    console.log(process.env.SMTP_HOST);
    console.log(process.env.SMTP_PORT);
    console.log(process.env.SMTP_USER);
    console.log(process.env.SMTP_PASS);
  }

  async sendNotifyAddedToEvent(to, userName, event: Event) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: 'contr-sport.online: Новое событие',
      text: '',
      html: `<p>${userName} пригласил вас на событие: "${event.place}", проверьте в своем личном кабинете на <a href="https://contr-sport.online/">сайте</a></p>`,
    });
  }

  async sendNotifyConfirmd(to, userName, event: Event) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: `contr-sport.online: ${userName} дал согласие`,
      text: '',
      html: `<p>${userName} согласился на событие: "${event.place}", проверьте в своем личном кабинете на <a href="https://contr-sport.online/">сайте</a></p>`,
    });
  }

  async sendNotifyPayed(to, userName, event: Event) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: `contr-sport.online: ${userName} внес оплату`,
      text: '',
      html: `<p>${userName} оплатил свою часть за событие: "${event.place}", проверьте в своем личном кабинете на <a href="https://contr-sport.online/">сайте</a></p>`,
    });
  }

  async sendNotifyRemoveEvent(to, userName, event: Event) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: 'contr-sport.online: Событие отменено',
      text: '',
      html: `<p>${userName} отменил событие: "${event.place}", проверьте в своем личном кабинете на <a href="https://contr-sport.online/">сайте</a></p>`,
    });
  }
}

// const mailService = new MailService();
