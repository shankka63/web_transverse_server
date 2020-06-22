import {Pirate} from "../models/Pirate";
import {Crew} from "../models/Crew";
import {Role} from "../models/Role";
import {AuthenticationError} from "apollo-server";

const bcrypt = require('bcryptjs');

//Required for dummy data
const dummy = require('mongoose-dummy');
const ignoredFields = ['_id', 'created_at', '__v', /detail.*_info/];
const jwt = require('jsonwebtoken');

import dotenv from 'dotenv';

dotenv.config();


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
        pirate: Pirate
        pirateCrew: Crew
    }
    extend type Mutation {
        createPirate(pseudo: String!): String
        createPirateWithInput(input: PirateInput!): String
        login(input: PirateInput!): String
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
            return Pirate.find().populate('crew');
        },
        // Get pirate by ID
        pirate: async (root, _, context, info) => {

            if (!context.user) throw new AuthenticationError("You must be logged");


            return Pirate.findOne({_id: context.user._id}).populate('crew');
        },
        pirateCrew: async (root, _, context, info) => {

            if (!context.user) throw new AuthenticationError("You must be logged");

            const p = await Pirate.findOne({_id: context.user._id});

            console.log(p.crew);
            if (p.crew === undefined){
                return null;

            }
            const crew = await Crew.findOne(p.crew).populate('creator');

            let ne = [];
            for (let i = 0; i < crew.roles.length; i++) {
                ne.push(await Role.findOne(crew.roles[i]).populate('workers'));
            }
            crew.roles = ne;
            return crew;
        },
    },
    Mutation: {
        createPirate: async (root, args, context, info) => {
            await Pirate.create(args);
            return Pirate.name;
        },
        createPirateWithInput: async (root, {input}, context, info) => {

            const p = await Pirate.findOne({pseudo: input.pseudo});

            if (p) {
                throw new Error("Pseudo déjà utilisé");
            }

            const salt = bcrypt.genSaltSync(10);
            input.password = bcrypt.hashSync(input.password, salt);

            const pirate = await Pirate.create(input);
            return jwt.sign({id: pirate._id, pseudo: pirate.pseudo}, process.env.SECRET);
        },
        login: async (root, {input}) => {
            const p = await Pirate.findOne({pseudo: input.pseudo});

            if (!p) {
                throw new Error("bad user");
            }
            if (!bcrypt.compareSync(input.password, p.password)) {
                throw new Error("bad password");
            }
            return jwt.sign({id: p._id, pseudo: p.pseudo}, process.env.SECRET);

        },
        deletePirate: async (root, {_id}, context, info) => {
            return Pirate.remove({_id});
        },
        updatePirate: async (root, {_id, input}) => {
            return Pirate.findByIdAndUpdate(_id, input, {new: true});
        },
    }
};