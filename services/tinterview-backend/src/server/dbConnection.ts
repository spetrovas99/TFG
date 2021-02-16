import { connect, set } from 'mongoose';

export const connectWithRetry = (mongoUrl: string) => {
  return connect(
    mongoUrl,
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    },
  )
    .then(() => console.log('successfully connected to Mongo.'))
    .catch((e) => {
      setTimeout(() => connectWithRetry(mongoUrl), 5000);
    });
};

export const dbConnect = async () => {
  const uri = process.env.MONGODB_URL || 'mongodb://localhost/test';
  set('useFindAndModify', false);
  await connectWithRetry(uri);
};