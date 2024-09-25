import { config } from 'dotenv';
config();

export const NODE_ENV = process.env.NODE_ENV as string;
export const PORT = process.env.PORT || 3000;
export const DATABASE_URI = process.env.DATABASE_URI as string;
export const JWT_SECRET = process.env.JWT_SECRET as string;
export const EMAIL_USER = process.env.EMAIL_USER as string;
export const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD as string;
export const REDIS_HOST = process.env.REDIS_HOST as string;
export const REDIS_PASSWORD = process.env.REDIS_PASSWORD as string;
export const REDIS_PORT = parseInt(process.env.REDIS_PORT as string);
export const OPENAI_ORG_ID = process.env.OPENAI_ORG_ID as string;
export const OPENAI_PROJECT_ID = process.env.OPENAI_PROJECT_ID as string;
export const OPENAI_KEY = process.env.OPENAI_KEY as string;
