import { Context, Next } from 'koa';
import jwt from 'jsonwebtoken';
import config from '../config';
import ApiError from '../exceptions/api-error';
import TokenService from '../service/token-service'
const tokenService = new TokenService();
import Koa from 'koa'

export default async function (ctx: Koa.Context, next: Koa.Next) {
    try {
        const authorizationHeader = ctx.headers.authorization// Проверяем наличие заголовка
        if (!authorizationHeader) {
            throw new ApiError(401, 'Пользователь не авторизирован Header')
        }
        const accessToken = authorizationHeader.split(' ')[1];
        if (!accessToken) {
            throw new ApiError(401, 'Пользователь не авторизирован Header')
        }

        const userData = tokenService.validateAccessToken(accessToken);
        if (!userData) {
            throw new ApiError(401, 'Пользователь не авторизирован userData')
        }
        ctx.state.user = userData;
        await next();
    } catch (e) {
        console.log(e);
        throw new ApiError(401, 'Пользователь не авторизирован Вообще мимо', [e])
    }
}
