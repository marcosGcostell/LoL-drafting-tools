import nodemailer from 'nodemailer';

export default async options => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 2525,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailoptions = {
    from: 'draftKing App <draftking@kuantik.com',
    to: options.email,
    subject: options.subject,
    text: options.text,
    html: options.html,
  };

  await transporter.sendMail(mailoptions);
};
