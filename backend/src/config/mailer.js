import nodemailer, { createTransport } from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

transporter.verify((error, success) => {
    if(error) {
        console.error("Error connecting mail server.", error);
    } else {
        console.log("Successfully connected to mail server.");
    }
});

export default transporter;