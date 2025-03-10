import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { Config } from 'src/config';

export const IS_DEV_ENV = Config.NODE_ENV === 'development';

export const errorMessage = (error: any) => {
  // if (showLog)
  console.log(`<<<<<<<<<<${error}>>>>>>>>>>`);
  return error?.message || 'Something went wrong';
};

export const generateHashedPassword = (rawPassword: string): string =>
  bcrypt.hashSync(rawPassword, 10);

export const comparePasswords = (
  rawPassword: string,
  originalPassword: string,
): boolean => bcrypt.compareSync(rawPassword, originalPassword);

export const generateOTL = () => {
  //OTL - One Time Link
  return {
    otl: randomBytes(20).toString('hex'),
    expires: Date.now() + 3600000, //expires in an hour
    // expires: Date.now() + 300000
  };
};

export const generateOtp = (duration = 300000) => {
  // Generate and send the OTP
  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  return { otp, duration: Date.now() + duration };
};

export function getRandomAlphabets(count: number) {
  const alphabets = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';

  while (result.length < count) {
    const randomChar = alphabets[Math.floor(Math.random() * alphabets.length)];
    if (!result.includes(randomChar)) {
      result += randomChar;
    }
  }

  return result;
}

export function isValidObjectId(value) {
  // Check if the value is a string and matches the 24-character hexadecimal format
  return typeof value === 'string' && /^[a-fA-F0-9]{24}$/.test(value);
}
