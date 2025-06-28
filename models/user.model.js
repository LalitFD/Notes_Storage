import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    created_at: { type: Date, default: Date.now }
});

export const User = mongoose.model('User', userSchema);
