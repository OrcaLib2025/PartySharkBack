import Koa from "koa";
import jwt from "jsonwebtoken";
import config from "../config";

interface TokenPayload {
    id: string;
    roles: string[];
}

export default function (roles: string[]) {
    return async function (ctx: Koa.Context, next: Koa.Next) {
        if (ctx.method === "OPTIONS") {
            await next(); // Используем await
            return;
        }

        try {
            const token = ctx.headers.authorization?.split(' ')[1]; // Проверяем наличие заголовка
            if (!token) {
                ctx.status = 401; // 401 Unauthorized
                ctx.body = { message: "Пользователь не авторизован" };
                return;
            }

            const decoded = jwt.verify(token, config.jwt_access_token) as TokenPayload;
            const { roles: userRoles } = decoded;

            let hasRole = false;
            userRoles.forEach(role => {
                if (roles.includes(role)) {
                    hasRole = true;
                }
            });

            if (!hasRole) {
                ctx.status = 403; // 403 Forbidden (лучше использовать 403 для отсутствия доступа)
                ctx.body = { message: "Нет доступа" };
                return;
            }

            await next(); // Используем await
        } catch (e) {
            console.log(e);
            ctx.status = 401; // 401 Unauthorized
            ctx.body = { message: "Пользователь не авторизован" };
        }
    }; // Закрываем внутреннюю функцию
} // Закрываем внешнюю функцию
