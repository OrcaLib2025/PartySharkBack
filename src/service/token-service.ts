import jwt from "jsonwebtoken";
import tokenModel from "../models/token.model";
import { IToken } from "../models/token.model";
import config from "../config";
import mongoose from "mongoose";

interface TokenPayload {
    userId: mongoose.Types.ObjectId;
    email: string;
    // Добавьте другие поля, если необходимо
}

class TokenService {
    generateTokens = (payload: TokenPayload): { accessToken: string; refreshToken: string } => {
        const accessToken = jwt.sign(payload, config.jwt_access_token, {expiresIn: '20m'})
        const refreshToken = jwt.sign(payload, config.jwt_refresh_token, {expiresIn: '30d'})
        return {
            accessToken,
            refreshToken
        }
    }
    async saveToken(userId: mongoose.Types.ObjectId, refreshToken: string) {
        //ПОДУМАТЬ КАК СДЕЛАТЬ НЕСКОЛЬКО УСТРОЙСТВ
        const tokenData = await tokenModel.findOne({user: userId})
        if (tokenData) {
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }
        return await tokenModel.create({user: userId, refreshToken})
    }
    async removeToken(refreshToken: string) {
        const tokenData = await tokenModel.deleteOne({refreshToken})
        return tokenData;
    }

    async findToken(refreshToken: string) {
        const tokenData = await tokenModel.findOne({refreshToken})
        return tokenData;
    }

    private isTokenPayload(data: unknown): data is TokenPayload {
        return (
            typeof data === 'object' && 
            data !== null && 
            'userId' in data
        );
    }

    validateAccessToken(token: string){
        try {
            const userData = jwt.verify(token, config.jwt_access_token);
            return this.isTokenPayload(userData) ? userData : null;
        } catch(e) {
            return null;
        }
    }

    validateRefreshToken(token: string){
        try {
            const userData = jwt.verify(token, config.jwt_refresh_token);
            return this.isTokenPayload(userData) ? userData : null;
        } catch(e) {
            return null;
        }
    }

}
export default TokenService;
