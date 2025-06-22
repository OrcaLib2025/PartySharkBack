import Koa from 'koa';
import { koaBody } from 'koa-body';
import mongoose from 'mongoose';
import cors from '@koa/cors';
import authRouter from './routes/authRouter';
import config from "./config";
import router from "./routes/authRouter";
import error from 'koa-json-error';
import mainRouter from './routes';


const PORT = config.port || 3003;
const app = new Koa();

app.use(
    cors({
        origin: 'http://79.141.73.245',
        credentials: true,
    })
);

app.use(error({
    format: (err: any) => ({
        success: false,
        status: err.status || 500,
        message: err.message || 'Internal server error',
        ...(err.errors && { errors: err.errors }),
        ...(process.env.NODE_ENV === 'development' && {
            stack: err.stack,
            originalError: err.originalError
        })
    }),

    postFormat: (e, obj) => process.env.NODE_ENV === 'production'
        ? { ...obj, status: obj.status, message: obj.message }
        : obj
}));

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
app.use(authRouter.routes());
app.use(mainRouter.routes());
app.use(cors());

router.get('/api', (ctx) => {
    ctx.body = 'Login page';
})

const start = async () => {
    try {
        await mongoose.connect(config.mongo_url);
        console.log('Успешное подключение к MongoDB');

        app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
    } catch (e) {
        console.error('Ошибка при запуске сервера:', e);
        process.exit(1);
    }
};

start().catch((err) => {
    console.error('Необработанная ошибка:', err);
    process.exit(1);
});
