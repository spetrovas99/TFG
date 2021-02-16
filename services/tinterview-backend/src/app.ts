require('dotenv').config();

import 'babel-polyfill';
import { GraphQLServer } from 'graphql-yoga';
import { resolvers, typeDefs } from './schemas/modules/allSchemas';
import { dbConnect } from './server/dbConnection';
import { expressServer } from './server/expressServer';
import { contextHandler } from './server/graphqlContext';

const startGraphql = async () => {
  const server = new GraphQLServer({
    typeDefs,
    resolvers,
    context: contextHandler,
  });
  const options = { endpoint: '/api', playground: '/api/playground' };

  const callback = () => {
    console.log('server listening');
  };
  await expressServer(server);
  server.start(options, callback);
};

const runApp = async () => {
  try {
    await dbConnect();
    startGraphql();
  } catch (e) {
    console.log(e);
  }
};
runApp();