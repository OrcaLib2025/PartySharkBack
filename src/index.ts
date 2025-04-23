import Koa from 'koa';
import { koaBody } from 'koa-body'; // Импортируем koa-body
import mongoose from 'mongoose';
import cors from '@koa/cors';
import authRouter from './routes/authRouter'; // Импортируем роутер
import config from "./config";
import router from "./routes/authRouter";
import error from 'koa-json-error';


const PORT = config.port || 3003;
const app = new Koa();

// Настройка error middleware (должен быть ПЕРВЫМ)
app.use(error({
    // Кастомизация формата ошибки
    format: (err: any) => ({
      success: false,
      status: err.status || 500,
      message: err.message || 'Internal server error',
      ...(err.errors && { errors: err.errors }), // Добавляем детали ошибок если есть
      ...(process.env.NODE_ENV === 'development' && { 
        stack: err.stack,
        originalError: err.originalError 
      })
    }),
    
    // Пост-обработка (убираем stack в production)
    postFormat: (e, obj) => process.env.NODE_ENV === 'production' 
      ? { ...obj, status: obj.status, message: obj.message }
      : obj
  }));

// Middleware для парсинга JSON и других типов данных
app.use(koaBody())
app.use(async (ctx, next) => {
    await next();
    const rt = ctx.response.get('X-Response-Time');
    console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});
app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.set('X-Response-Time', `${ms}ms`);
});
// Подключаем роутер
app.use(authRouter.routes());
app.use(cors());

router.get('/api', (ctx) => {
    ctx.body = 'Login page';
})

// Функция для запуска сервера
const start = async () => {
    try {
        // Подключение к MongoDB
        await mongoose.connect(config.mongo_url);
        console.log('Успешное подключение к MongoDB');

        // Запуск сервера
        app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
    } catch (e) {
        console.error('Ошибка при запуске сервера:', e);
        process.exit(1); // Завершаем процесс с кодом ошибки
    }
};

// Запуск приложения с обработкой ошибок
start().catch((err) => {
    console.error('Необработанная ошибка:', err);
    process.exit(1);
});
