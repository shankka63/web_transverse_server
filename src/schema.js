import { merge } from 'lodash';
import { makeExecutableSchema } from 'graphql-tools';

import {
  typeDef as Pirate,
  resolvers as pirateResolvers,
} from './schema/pirate.schema';

import {
  typeDef as Crew,
  resolvers as crewResolvers,
} from './schema/crew.schema';

import {
  typeDef as Role,
  resolvers as roleResolvers,
} from './schema/role.schema';


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
  typeDefs: [ Query, Pirate, Crew, Role],
  resolvers: merge(resolvers, pirateResolvers, crewResolvers, roleResolvers),
});