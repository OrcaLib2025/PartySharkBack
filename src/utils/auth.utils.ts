import Joi from 'joi';
import Koa from 'koa';
import ApiError from '../exceptions/api-error';

export const validateRegistration = async (ctx: Koa.Context, next: Koa.Next) => {
    const schema = Joi.object({
        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'org', 'ru'] } })
            .required()
            .messages({
                'string.email': 'Please enter a valid email address',
                'string.empty': 'Email cannot be empty',
                'any.required': 'Email is required',
            }),
        password: Joi.string()
            .min(8)
            .max(30)
            .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
            .required()
            .messages({
                'string.min': 'Password must be at least 8 characters',
                'string.max': 'Password cannot exceed 30 characters',
                'string.pattern.base': 'Password must contain: 1 uppercase, 1 lowercase, 1 number, and 1 special character',
                'string.empty': 'Password cannot be empty',
                'any.required': 'Password is required',
            }),
    }).options({ abortEarly: false }); // Проверяет все поля перед возвратом ошибки

    const { error, value } = schema.validate(ctx.request.body, { 
        allowUnknown: false, // Запрещает неизвестные поля
        stripUnknown: false // Не удаляет неизвестные поля (для последующей обработки)
    });

    if (error) {
        throw new ApiError(400, 'Registration failed', [error.message]);
    }

    // Присваиваем валидированные данные (можно использовать ctx.state)
    ctx.state.validatedData = value;
    await next();
};