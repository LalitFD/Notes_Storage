
import mongoose from 'mongoose';
import dotenv from "dotenv"
dotenv.config()

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('DB connection failed:', error);
    process.exit(1);
  }
};
