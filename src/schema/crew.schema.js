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
        createCrew(name: String!, creator: ID!): Boolean
        CreateCrewWithInput(input: CrewInput!): Crew
        deleteCrew(_id: ID!): Boolean
        updateCrew(_id: ID!, input: CrewInput!): Crew
        addRolesToCrew(_id: ID!, input: ID!): Crew
    }
`;

export const resolvers = {
    Query: {
        crewSchemaAssert: async () => {
            return "Crew schema";
        },
        crews: async () => {
            let crews = [];
            for (let index = 0; index < 5; index++) {
                crews.push(dummy(Crew, {
                    ignore: ignoredFields,
                    returnDate: true
                }))
            }
            return crews;    
        },
        crew: async () => {
            return dummy(Crew, {
                ignore: ignoredFields,
                returnDate: true
            })
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