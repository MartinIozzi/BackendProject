import nodemailer from 'nodemailer'
import config from '../config/config.js'

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: config.EMAIL,
        pass: config.EMAIL_PASSWORD,
    },
    tls: {
        rejectUnauthorized: false
    }
})