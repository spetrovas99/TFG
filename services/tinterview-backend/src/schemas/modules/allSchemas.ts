import { importSchema } from "graphql-import";
import { merge } from "lodash";
import * as path from "path";

import { allResolvers } from "../../resolvers/allResolvers";

export const typeDefs = importSchema(path.join(__dirname, "./allSchemas.graphql"));

export const resolvers = merge(allResolvers);
