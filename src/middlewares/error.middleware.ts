import Koa from 'koa';
import ApiError from '../exceptions/api-error';

const errorMiddleware: Koa.Middleware = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    console.error('Error:', err);
    
    if (err instanceof ApiError) {
      ctx.status = err.status;
      ctx.body = { 
        success: false,
        message: err.message, 
        errors: err.errors || [],
      };
      return;
    }
    
    // Обработка всех остальных ошибок
    const message = err instanceof Error ? err.message : 'Непредвиденная ошибка';
    const errors = err instanceof Error ? [err.message] : [String(err)];
    
    ctx.status = 500;
    ctx.body = {
      success: false,
      message,
      errors,
    };
  }
};

export default errorMiddleware;