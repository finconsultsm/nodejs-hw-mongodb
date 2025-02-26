import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const initMongoConnection = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_URL}/${process.env.MONGODB_DB}?retryWrites=true&w=majority`,
    );
    console.log('Mongo connection successfully established!');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};
