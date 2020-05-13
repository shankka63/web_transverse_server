import {Role} from "../models/Role";
//Required for dummy data
const dummy = require('mongoose-dummy');
const ignoredFields = ['_id','created_at', '__v', /detail.*_info/];


export const typeDef = `
  type Role {
    _id: ID!
    name: String
    workers: [Pirate]
  }
  input RoleInput{
    name: String
    workers: [pirate]
  }
  extend type Query {
    roleSchemaAssert: String
    roles: [Role]
    role(_id: ID!): Role
  }
  extend type Mutation {
    createRole(name: String!,description: String!): Boolean
    createRoleWithInput(input: RoleInput!): Role
    deleteRole(_id: ID!): Boolean
    updateRole(_id: ID!,input: RoleInput!): Role
    addWorker(_id: ID!, input: PirateInput!): Role
  }
`;

export const resolvers = {
  Query: {
    roleSchemaAssert: async () => {
      return "Role schema";
    },
    roles: async () => {
      return Role.find();
    },
    role: async (root, { _id }, context, info) => {      
      return Role.findOne({_id});
    },
  },
  Mutation: {
    createRole: async (root, args, context, info) => {
      await Role.create(args);
      return Role.name;
    },
    createRoleWithInput: async (root, { input }, context, info) => {
      return Role.create(input);
    },
    deleteRole: async (root, { _id }, context, info) => {
      return Role.remove({ _id });
    },
    updateRole: async (root, { _id, input }) => {
      return Role.findByIdAndUpdate(_id, input, { new: true });
    }
  },
};