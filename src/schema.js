import { merge } from 'lodash';
import { makeExecutableSchema } from 'graphql-tools';

import {
    typeDef as Pirate,
    resolvers as userResolvers,
} from './schema/pirate.schema';


// General query
const Query = `
  type Query {
    _empty: String
  }
  type Mutation {
    _empty: String
  }
  type Subscription {
    _empty: String
  }
`;

const resolvers = {};

// Do not forget to merge at the end of typeDefs and resolvers
export const schema = makeExecutableSchema({
    typeDefs: [ Query, Pirate],
    resolvers: merge(resolvers, userResolvers),
});