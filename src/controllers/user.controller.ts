import Koa from "koa";
import User from "../models/user.model";
import bcrypt from "bcryptjs";
import Role from "../models/role.model";
import jwt from "jsonwebtoken";
import config from "../config";
import UserService from "../service/user.service";
import ApiError from "../exceptions/api-error";


const userService = new UserService();

class UserController {
    async registration(ctx: Koa.Context) {
        try {
            const {email, password} = ctx.request.body;
            const userData = await userService.registration(email, password);
            return ctx.body = userData;

        } catch (e) {
            throw new ApiError(400, 'Registration failed', [e]);
        }
    }
    async activate(ctx: Koa.Context, next: Koa.Next) {
        try {
            const activationLink = ctx.params.link;
            await userService.activate(activationLink);
            console.log('Сюда попали')
            return ctx.redirect(config.client_url);
        } catch (e) {
            console.log(e)
            throw new ApiError(400, 'Activate error', [e]);
        }
    }
    async refresh(ctx: Koa.Context) {
        try {
            const refreshToken = ctx.cookies.get('refreshToken');
            const userData = await userService.refresh(refreshToken);
            ctx.cookies.set('refreshToken', userData.refreshToken,{
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24 * 7,
            });
            return ctx.body = userData;


        } catch (e) {
            console.log(e)
            throw new ApiError(400, 'Refresh failed', [e]);
        }
    }
    async getAllUsers(ctx: Koa.Context) {
        try {
            const users = await userService.getAllUsers()
            return ctx.body = users;
        } catch (e) {
            console.log(e)
            throw new ApiError(400, 'Get users failed');
        }
    }
    async login(ctx: Koa.Context) {
        try {
            const { email, password } = ctx.request.body;
            const userData = await userService.login(email, password);
            ctx.cookies.set('refreshToken', userData.refreshToken,{
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24 * 7,
            });
            return ctx.body = userData;

        } catch (e) {
            throw new ApiError(400, 'Login failed', [e]);
        }
    }
    async logout(ctx: Koa.Context) {
        try {
            const refreshToken = ctx.cookies.get('refreshToken');

            if(!refreshToken) {
                throw new ApiError(401, 'Refresh Token not found');
            }
            const deleteResult = await userService.logout(refreshToken);
            ctx.cookies.set('refreshToken', '',{
                httpOnly: true,
                expires: new Date(0), // Устанавливаем дату в прошлом
                });

            ctx.status = 200;
            ctx.body = {
                success: true,
                message: 'Logged out successfully',
                deletedCount: deleteResult.deletedCount
            };


            } catch (e) {
            console.log(e)
            throw new ApiError(500, 'Internal server error', [e]);
        }
    }
}
export default UserController
