import dotenv from 'dotenv'
dotenv.config();

interface Config {
    port: number;
    mongo_url: string;
    jwt_access_token: string,
    jwt_refresh_token: string,
    smtp_host: string,
    smtp_port: number,
    smtp_user: string,
    smtp_password: string,
    api_url: string,
    client_url:string,
}

const config: Config = {
    port: parseInt(process.env.PORT || '3003', 10),
    mongo_url: process.env.DB_URL as string,
    jwt_access_token: process.env.JWT_ACCESS_SECRET as string,
    jwt_refresh_token: process.env.JWT_REFRESH_SECRET as string,
    smtp_host: process.env.SMTP_HOST as string,
    smtp_port: parseInt(process.env.SMTP_PORT || '0', 10),
    smtp_user: process.env.SMTP_USER as string,
    smtp_password: process.env.SMTP_PASSWORD as string,
    api_url: process.env.API_URL as string,
    client_url: process.env.CLIENT_URL as string,
};
export default config;
