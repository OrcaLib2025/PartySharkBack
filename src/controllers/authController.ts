import Koa from "koa";
import User from '../models/user.model'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import Role from '../models/role.model'
import config from '../config'
const generateAccessToken = (id: number, roles: string[]) => {
    const payload = {
        id,
        roles
    }
    return jwt.sign(payload, config.jwt_access_token, {expiresIn: "24h"} )
}
class authController {
    // async registration(ctx: Koa.Context) {
    //     try {
    //         const { username, password } = ctx.request.body;
    //         const candidate = await User.findOne({username});
    //         if (candidate) {
    //             ctx.status = 400;
    //             ctx.body = { message: "Пользователь с таким именем уже существует"};
    //             return
    //         }
    //         const hashPassword = bcrypt.hashSync(password, 10);
    //         const userRole = await Role.findOne({value: "USER"})
    //         const user = new User({
    //             username,
    //             password: hashPassword,
    //             roles:[userRole?.value || "USER"]
    //         })
    //         await user.save()
    //         return ctx.body = {message: "Пользователь успешно зарегистрирован"};
    //
    //     } catch (e) {
    //        console.log(e)
    //         ctx.status = 400;
    //         ctx.body = { message: "Registration error" };
    //
    //     }
    // }
    // async login(ctx: Koa.Context) {
    //     try {
    //         const { username, password } = ctx.request.body;
    //         const user = await User.findOne({username})
    //         if (!user) {
    //             ctx.status = 400;
    //             ctx.body = `Пользователь ${username} не найден`;
    //             return;
    //         }
    //         const validPassword = bcrypt.compareSync(password, user.password)
    //         if (!validPassword) {
    //             ctx.status = 400;
    //             ctx.body = `Введен неверный пароль`;
    //             return;
    //         }
    //         const token = generateAccessToken(user._id as number, user.roles);
    //         return ctx.body = {token};
    //
    //
    //     } catch (e) {
    //         console.log(e)
    //         ctx.status = 400;
    //         ctx.body = { message: "Login error" };
    //     }
    // }
    async getUsers(ctx: Koa.Context) {
        try {
            return ctx.body = await User.find();
        } catch (e) {
            ctx.body = "Server is not working";
        }

    }
}

export default authController;
