import mongoose from "mongoose";
export default class UserDto {
    email: string;
    userId: mongoose.Types.ObjectId;
    isActivated: boolean;
    constructor(model: { email: string; userId: mongoose.Types.ObjectId; isActivated: boolean }) {
        this.email = model.email;
        this.userId = model.userId
        this.isActivated = model.isActivated;
    }
}
