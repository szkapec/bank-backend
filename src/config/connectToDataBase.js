import mongoose from 'mongoose';
// import env from './config';



const connectToDatabase = async () => {
  // const { mongodbUrl } = env;
  try {
    await mongoose.connect(process.env.MONGO_DB_REMOTE_URL);
    console.log("mongo db connected");
  } catch (error) {
    // console.log('error not connect to database', error.message, mongodbUrl);
  }
};

export default connectToDatabase;