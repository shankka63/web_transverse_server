import {Crew} from "../models/Crew";
import {Role} from "../models/Role";
import {Pirate} from "../models/Pirate";
import {AuthenticationError} from "apollo-server";
//Required for dummy data
const dummy = require('mongoose-dummy');
const ignoredFields = ['_id', 'created_at', '__v', /detail.*_info/];


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
        createCrew(name: String!): Boolean
        CreateCrewWithInput(input: CrewInput!): Crew
        leaveCrew: Boolean
        joinCrew(_id: ID!): Boolean
    }
    
`;

export const resolvers = {
    Query: {
        crewSchemaAssert: async () => {
            return "Crew schema";
        },
        crews: async () => {
            return Crew.find().populate('creator');
        },
        crew: async (root, {_id}, context, info) => {
            return Crew.findOne({_id}).populate('creator');
        }
    },
    Mutation: {
        createCrew: async (root, {name}, context, info) => {

            if (!context.user) throw new AuthenticationError("You must be logged");

            if (context.user.crew){
                throw new Error("You already have a crew");
            }

            let crew = await Crew.create({name, creator: context.user}).catch(e => console.error(e));
            await Pirate.findByIdAndUpdate(context.user._id, {
                crew: crew._id
            });

            const roleMousse = await Role.create({name: "Moussaillon"});
            const roleCaptain = await Role.create({name: "Capitaine"});
            crew = await Crew.findByIdAndUpdate(crew._id, {
                $push: {
                    roles: { $each: [roleCaptain, roleMousse] }
                }
            });
            roleCaptain.workers.push(context.user);

            await roleCaptain.save();
            await crew.save();
            return true;
        },

        leaveCrew: async (root, _, context, info) => {

            if (!context.user) throw new AuthenticationError("You must be logged");

            if (!context.user.crew)throw new Error("no crew to leave");

            const c = await Crew.findById(context.user.crew);

            if (c.creator.toString() === context.user._id.toString()){
                // Delete crew
                console.log("id",c._id);
                await c.remove();
            }else{

                await Pirate.findByIdAndUpdate(context.user._id, {
                    $unset: {
                        crew: 1
                    }
                });

            }
            return true;

        },

        joinCrew: async (root, {_id}, context, info) => {

            if (!context.user) throw new AuthenticationError("You must be logged");
            if (context.user.crew)throw new Error("You already have a crew");

            const c = await Crew.findById(_id).populate("roles");

            if (!c) throw new Error("This crew doesn't exist");

            let r = c.roles.filter(it => it.name === "Moussaillon")[0];

            if (!r){
                r=c.roles[0];
            }


            const user = await Pirate.findByIdAndUpdate(context.user._id, {
                $set: {
                    crew: c
                }
            });

            const role = await Role.findByIdAndUpdate(r._id, {
                $push:{
                    workers: user
                }
            });

            await role.save();
            await user.save();

            return true;
        }

    }
};