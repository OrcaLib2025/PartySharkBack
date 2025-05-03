import Router from 'koa-router';
const router = new Router();
import Controller from '../controllers/user.controller';
const userController = new Controller();
import {validateRegistration} from "../utils/auth.utils";
import authMiddleware from '../middlewares/auth.middleware'

router.post('/registration', validateRegistration, userController.registration);
router.post('/login', userController.login);
router.post('/logout', userController.logout)
router.get('/activate/:link', userController.activate)
router.get('/refresh', userController.refresh)
router.get('/users', authMiddleware, userController.getAllUsers);

export default router