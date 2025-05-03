import Router from 'koa-router';
import partyRouter from './party.route';
import authRoutes from './authRouter';

const mainRouter = new Router({ prefix: '/api' });

mainRouter.use('/auth', authRoutes.routes(), authRoutes.allowedMethods());
mainRouter.use('/parties', partyRouter.routes(), partyRouter.allowedMethods());

export default mainRouter;