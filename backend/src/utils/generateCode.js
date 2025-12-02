import crypto from 'crypto';
import { ExpressValidator } from 'express-validator';


// create 6 digits random integer
export const generateResetCode = () => {
    return crypto.randomInt(100000, 999999).toString();
}

export const getExpirationTime = (minutes = 15) => {
    return new Date(Date.now() + minutes * 60 * 1000);
}