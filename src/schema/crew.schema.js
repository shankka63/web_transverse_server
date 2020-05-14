import {Crew} from "../models/Crew";
import {Role} from "../models/Role";
//Required for dummy data
const dummy = require('mongoose-dummy');
const ignoredFields = ['_id','created_at', '__v', /detail.*_info/];


export const typeDef = `
    type Crew {
        _id: ID!
        name: String
        creator: Pirate
        roles: [Role]
    }

    input CrewInput{
        name: String
        creator: PirateInput
    }

    extend type Query {
        crewSchemaAssert: String
        crews: [Crew]
        crew(_id: ID!) : Crew
    }

    extend type Mutation {
        createCrew(name: String!, creator: PirateInput!): Boolean
        CreateCrewWithInput(input: CrewInput!): Crew
        deleteCrew(_id: ID!): Boolean
        updateCrew(_id: ID!, input: CrewInput!): Crew
        addRolesToCrew(_id: ID!, input: RoleInput!): Crew
    }
`;

export const resolvers = {
    Query: {
        crewSchemaAssert: async () => {
            return "Crew schema";
        },
        crews: async () => {
            var test = await Crew.find().populate('roles');
            console.log(test); 
            return test;      
        },
        crew: async () => {
            return await Crew.findOne({_id}).populate('roles');
        }
    },
    Mutation: {
        createCrew: async (root, args, context, info) => {
            await Crew.create(args);
            return true;
        },
        CreateCrewWithInput: async (root, {input}, context, info) => {
            return Crew.create(input);
        },
        deleteCrew: async (root, {_id}) => {
            return Crew.remove({_id});
        },
        updateCrew: async (root, {_id, input}) => {
            return Crew.findByIdAndUpdate(_id, input, {new: true});
        },
        addRolesToCrew: async (root, {_id, input}) => {
            var role = await Role.create(input);
            var crew = await Crew.findByIdAndUpdate(_id,{
                $push: {
                    roles: role
                }
            })
            console.log(role);
            console.log(crew);
            crew.save();
            return true;
        }
    }
}