import {ApolloServer} from "apollo-server";
import {schema} from "./src/schema";
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import {Pirate} from "./src/models/Pirate";
import * as jwt from "jsonwebtoken";

dotenv.config();

// connection to mongoose
mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});


//Pass the schema to ApolloServer
const server = new ApolloServer({
    schema,
    context: async ({req}) => {


        const token = req.headers.authorization || '';

        if (token !== '') {

            try {

                const decoded = jwt.verify(token, process.env.SECRET);

                const user = await Pirate.findOne({_id: decoded.id});
                return {user};
            } catch (e) {
                return new Error('invalid token');
            }
        } else {
            return null;
        }
    },
});

//Launch the server
server.listen().then(({url}) => {
    console.log(`==> 🚀  Server ready at ${url} `);
});