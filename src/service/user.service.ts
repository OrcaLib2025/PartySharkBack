import UserModel from "../models/user.model";
import User from "../models/user.model";
import bcrypt from "bcryptjs";
import uuid from 'uuid'
import MailService from "./mail-service";
import {v4} from "uuid";
import mongoose from "mongoose";

const mailService = new MailService();
import TokenService from "./token-service";
import UserDto from "../dtos/user.dto"
import {string} from "joi";
import config from "../config";
import ApiError from "../exceptions/api-error";
const tokenService = new TokenService();


class UserService {
    async registration(email: string, password: string) {
        const candidate = await User.findOne({email});
        if (candidate) {
            throw new ApiError(400, `Пользователь с таким почтовым адресом ${email} уже существует`);
        }
        console.log(password);
        const hashPassword = bcrypt.hashSync(password, 10);
        const activationLink = v4();
        console.log(activationLink);
        const user = new User({
            email: email,
            password: hashPassword,
            activationLink: activationLink,
        });
        await mailService.sendActivationLink(email, `${config.api_url}/api/activate/${activationLink}`);
        console.log(`${config.api_url}/api/activate/${activationLink}`);
        await user.save();
        return console.log('Registration successful');
    }

    async activate(activationLink: string) {
        const user = await UserModel.findOne({activationLink})

        if (!user) {
            throw new ApiError(400, 'Некорректная ссылка активации')
        }
        
        user.isActivated = true;
        console.log(user.isActivated);
        await user.save();
        return console.log('Activation successful');
    }

    async login(email: string, password: string) {
        const user = await UserModel.findOne({ email })

        if (!user) {
            throw new ApiError(400, 'Пользователь ${email} не найден');
        }
        const validPassword = await bcrypt.compare(password, user.password)

        if (!validPassword) {
            throw new ApiError(400, 'Введен неверный пароль');
        }

        const userDto = new UserDto({
            email: user.email,
            userId: user._id as mongoose.Types.ObjectId,
            isActivated: user.isActivated,
        });
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.userId, tokens.refreshToken);
        return {...tokens, user: userDto}
    }

    async logout(refreshToken: string) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async refresh(refreshToken?: string) {
        if(!refreshToken) {
            throw new ApiError(401, 'Unauthozised error')
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDB = await tokenService.findToken(refreshToken);

        if(!userData || !tokenFromDB) {
            throw new ApiError(401, 'Unauthorized error')
        }
        
        const user = await UserModel.findById(userData.userId);
        if (!user) {
            throw new ApiError(404, 'User not found');
        }
        const userDto = new UserDto({
            email: user.email,
            userId: user._id as mongoose.Types.ObjectId,
            isActivated: user.isActivated,
        });
        const tokens = tokenService.generateTokens({...userDto});

        await tokenService.saveToken(userDto.userId, tokens.refreshToken);
        return {...tokens, user: userDto}
    }

    async getAllUsers() {
        const users = await UserModel.find();
        return users;
    }


}
export default UserService;
