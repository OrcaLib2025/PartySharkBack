import mongoose, { Schema, model, Document } from 'mongoose';

export interface IToken extends Document {
    user: mongoose.Types.ObjectId; // ObjectId для связи с пользователем
    refreshToken: string; // refreshToken — строка
}

const tokenSchema = new mongoose.Schema<IToken>({
    refreshToken: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User'}, // Ссылка на модель User
});

const TokenModel = mongoose.model<IToken>('Token', tokenSchema);

export default TokenModel;
