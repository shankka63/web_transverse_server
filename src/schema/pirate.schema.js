import {Pirate} from "../models/Pirate";
//Required for dummy data
const dummy = require('mongoose-dummy');
const ignoredFields = ['_id','created_at', '__v', /detail.*_info/];


export const typeDef = `
    type Pirate {
        _id: ID!
        pseudo: String
        password: String
        crew: Crew
    }
    input PirateInput{
        pseudo: String
        password: String
    }
    extend type Query {
        pirateSchemaAssert: String
        pirates: [Pirate]
        pirate(_id: ID!): Pirate
    }
    extend type Mutation {
        createPirate(pseudo: String!): Boolean
        createPirateWithInput(input: PirateInput!): Pirate
        deletePirate(_id: ID!): Boolean
        updatePirate(_id: ID!,input: PirateInput!): Pirate
    }
`;

export const resolvers = {
    Query: {
        // Get all pirates
        pirateSchemaAssert: async () => {
            return "Hello world, from Pirate schema";
        },
        // Get all pirates
        pirates: async () => {
            let pirates = [];
            for (let index = 0; index < 5; index++) {
                pirates.push(dummy(Pirate, {
                    ignore: ignoredFields,
                    returnDate: true
                }))
            }
            return pirates;
        },
        // Get pirate by ID
        pirate: async (root, { _id }, context, info) => {
            // With a real mongo db
            //return Pirate.findOne({ _id });

            //Mogoose dummy
            return dummy(Pirate, {
                ignore: ignoredFields,
                returnDate: true
            })
        },
    },
    Mutation: {
        createPirate: async (root, args, context, info) => {
            await Pirate.create(args);
            return Pirate.name;
        },
        createPirateWithInput: async (root, { input }, context, info) => {
            //input.password = await bcrypt.hash(input.password, 10);
            return Pirate.create(input);
        },
        deletePirate: async (root, { _id }, context, info) => {
            return Pirate.remove({ _id });
        },
        updatePirate: async (root, { _id, input }) => {
            return Pirate.findByIdAndUpdate(_id, input, { new: true });
        }
    }
};